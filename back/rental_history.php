<?php
include 'db_header.php';
session_start();
$user_id = $_SESSION['user_id'];

if(!isset($_SESSION['user_id'])){
    echo json_encode(['logged_in' => false]);
    exit();
}

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $fetch_history = "SELECT 
    r.*, 
    c.image, 
    c.model, 
    rrd.return_date_actual, 
    rrd.final_refund_amount, 
    rrd.late_fee,
    (CURRENT_DATE > DATE_ADD(r.rental_date, INTERVAL (r.rental_duration_days - 1) DAY)) AS is_late,
    (CURRENT_DATE < DATE_ADD(r.rental_date, INTERVAL (r.rental_duration_days - 1) DAY)) AS is_early
    FROM rental_requests r 
    INNER JOIN cars c ON r.car_id = c.car_id 
    LEFT JOIN rental_return_details rrd ON r.request_id = rrd.request_id 
    WHERE r.user_id = ? 
    AND r.request_status IN ('Pending', 'Approved', 'Cancelled', 'Returned', 'Early Return Requested', 'Picked Up', 'Early Return Approved', 'Return Approved', 'Return Requested', 'Late Return Requested', 'Late Return Approved')";
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
        $return_stmt->close();

        if (!$return_result) {
            echo json_encode(["return" => false, "error" => "Rental request not found or unauthorized."]);
            exit();
        }

        $start = new DateTime($return_result['rental_date']);
        $date_to_process = isset($reqData['earlyReturnDate']) ? $reqData['earlyReturnDate'] : $reqData['date'];
        $today = new DateTime($date_to_process);
        $duration = (int)$return_result['rental_duration_days'];

        if($reqData['returnType']==="early"){

            $interval = $start->diff($today);
            $days_used = $interval->days+1;
            if($days_used<1) $days_used = 1;

            $early_cost = $days_used * $return_result['daily_rate'];
            $non_refundable = $return_result['total_cost']*0.5;
            //ensures refund amount does not exceed 50% of total paid, kasi non refundable na yung other 50% sa first downpayment
            $new_total_cost = max($early_cost, $non_refundable);
            $new_total_cost = min($new_total_cost, $return_result['total_cost']);
            $refund = $return_result['total_cost'] - $new_total_cost;

            $return_request = "INSERT INTO rental_return_requests (`request_id`, `user_id`, `requested_at`, `total_deducted_cost`, `status`, `calc_refund`) VALUES (?,?,NOW(),?,'Pending',?)";
            $early_stmt= $conn -> prepare($return_request);
            $early_stmt -> bind_param("iidd",$request_id, $user_id, $new_total_cost, $refund);
                
            if($early_stmt->execute()){
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
            exit();
        } else if ($reqData['returnType']==="on_time"){
            $on_time_cost = $return_result['total_cost'];
            $return_request = "INSERT INTO rental_return_requests (`request_id`, `user_id`, `requested_at`, `total_deducted_cost`, `status`) VALUES (?,?,NOW(),?,'Pending')";
            $on_time_stmt = $conn->prepare($return_request);
            $on_time_stmt->bind_param("iid", $request_id, $user_id, $on_time_cost);

            if($on_time_stmt->execute()){
                $update_rental_status = "UPDATE rental_requests SET request_status = 'Return Requested' WHERE request_id = ?";
                $update_stmt = $conn->prepare($update_rental_status);
                $update_stmt->bind_param("i", $request_id);
                $update_stmt->execute();
                $update_stmt->close();

                echo json_encode([
                "return" => true,
                "refund" => 0
                ]);
            } else {
                echo json_encode(["return" => false]);
            }
            $on_time_stmt->close();
        } else if ($reqData['returnType']==="late"){
            $scheduled_end = clone $start;
            $scheduled_end->modify("+".($duration-1)."Days");
            $today->setTime(0, 0, 0);
            $scheduled_end->setTime(0, 0, 0);

            $late_fee = 0;
            $new_total_cost = $return_result['total_cost'];

            if($today>$scheduled_end){
                $interval = $scheduled_end -> diff($today);
                $days_late = $interval->days;

                if($days_late<1) $days_late=1;

                $late_fee = $days_late * $return_result['daily_rate'];
                $new_total_cost+=$late_fee;
            }

            $return_request = "INSERT INTO rental_return_requests (`request_id`, `user_id`, `requested_at`, `total_deducted_cost`, `status`, `calc_late_fee`) VALUES (?,?,NOW(),?,'Pending',?)";
            $late_stmt = $conn->prepare($return_request);
            $late_stmt->bind_param("iidd", $request_id, $user_id, $new_total_cost, $late_fee);

            if($late_stmt->execute()){
                $update_rental_status = "UPDATE rental_requests SET request_status = 'Late Return Requested' WHERE request_id = ?";
                $update_stmt = $conn->prepare($update_rental_status);
                $update_stmt->bind_param("i", $request_id);
                $update_stmt->execute();
                $update_stmt->close();

                echo json_encode([
                    "return" => true,
                    "late_fee" => $late_fee,
                    "late_cost" => $new_total_cost
                ]);
            } else {
                echo json_encode(["return" => false]);
            }

            $late_stmt->close();
            exit();

        }
    }
}

?>