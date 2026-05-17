<?php
include 'db_header.php';
session_start();
$user_id = $_SESSION['user_id'];

if(!isset($_SESSION['user_id'])){
    echo json_encode(['logged_in' => false]);
    exit();
}

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $fetch_history = "SELECT r.car_id, r.rental_date, r.rental_duration_days, r.total_cost, r.request_status, r.request_id, r.payment_status ,c.image, c.model FROM rental_requests r INNER JOIN cars c ON r.car_id = c.car_id WHERE r.user_id = ? AND request_status IN ('Pending', 'Approved', 'Cancelled', 'Returned','Early Return Requested', 'Picked Up')";
    $fetch_stmt = $conn->prepare($fetch_history);
    $fetch_stmt->bind_param("i",$user_id);
    $fetch_stmt->execute();
    $result = $fetch_stmt->get_result();

    $history = [];

    while($row = mysqli_fetch_assoc($result)){
        $history[] = $row;
    }

    $fetch_active = "SELECT ar.pickup_id, ar.request_id, ar.pickup_date_actual, r.car_id, r.rental_date, r.rental_duration_days, r.total_cost, r.request_status, r.request_id, r.payment_status ,c.image, c.model FROM rental_pickup_details ar INNER JOIN rental_requests r ON ar.request_id = r.request_id INNER JOIN cars c ON r.car_id = c.car_id WHERE r.user_id = ?";
    $active_stmt = $conn->prepare($fetch_active);
    $active_stmt->bind_param("i", $user_id);
    $active_stmt->execute();
    $active_rental = $active_stmt->get_result();

    $active = [];
    while($row = mysqli_fetch_assoc($active_rental)){
        $active[] = $row;
    }

    echo json_encode([
        "history" => $history,
        "active" => $active
    ]);
    $fetch_stmt->close();
    $active_stmt->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD']==='POST') {
    $reqData = json_decode(file_get_contents('php://input'), true);
    $request_id =$reqData['reqID'];

    if($reqData['action']==="cancel"){

        $cancel_query = "UPDATE rental_requests SET request_status = 'Cancelled' WHERE request_id = ? AND user_id = ? AND request_status IN ('Pending', 'Approved')";
        $cancel_query_stmt = $conn->prepare($cancel_query);
        $cancel_query_stmt->bind_param("ii", $request_id, $user_id);

        if($cancel_query_stmt->execute()){
            echo json_encode(["cancelled"=>true]);
        } else {
            echo json_encode(["cancelled"=>false]);
        }

        $cancel_query_stmt->close();
        exit();
    }

    if($reqData['action']==="return"){

        $return = "SELECT r.car_id, r.rental_date, r.rental_duration_days, r.total_cost, r.request_status, r.payment_status ,c.image, c.model, c.daily_rate FROM rental_requests r INNER JOIN cars c ON r.car_id = c.car_id WHERE r.user_id = ? AND r.request_id = ?";

        $return_stmt = $conn->prepare($return);
        $return_stmt->bind_param("ii", $user_id, $request_id);
        $return_stmt->execute();
        $return_result = $return_stmt->get_result()->fetch_assoc();

        if($reqData['returnType']==="early"){
            if($return_result){
                $start = new DateTime($return_result['rental_date']);
                $today = new DateTime();

                $interval = $start->diff($today);
                $days_used = $interval->days;

                if($days_used<1) $days_used = 1;

                $new_total_cost = $days_used*$return_result['daily_rate'];

                if($new_total_cost>$return_result['total_cost'])$new_total_cost=$return_result['total_cost'];

                $return_request = "INSERT INTO rental_return_requests (`request_id`, `user_id`, `requested_at`, `total_deducted_cost`, `status`) VALUES (?,?,NOW(),?,'Pending')";
                $return_stmt= $conn -> prepare($return_request);
                $return_stmt -> bind_param("iid",$request_id, $user_id,$new_total_cost);
                
                if($return_stmt->execute()){

                    $update_rental_status = "UPDATE rental_requests SET request_status = 'Early Return Requested' WHERE request_id = ?";
                    $update_stmt = $conn -> prepare($update_rental_status);
                    $update_stmt->bind_param("i", $request_id);
                    $update_stmt->execute();

                    echo json_encode([
                        "return" => true,
                        "refund" => $return_result['total_cost'] - $new_total_cost
                        ]);
                } else {
                    echo json_encode(["return" => false]);
                }
                $return_stmt->close();
                exit();
        } else if ($reqData['returnType']==="on_time"){

        } else if ($reqData['returnType']==="late"){

        }
        }
    }
}

?>