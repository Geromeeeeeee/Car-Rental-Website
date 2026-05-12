<?php
include 'db_header.php';
session_start();
$user_id = $_SESSION['user_id'];

if(!isset($_SESSION['user_id'])){
    echo json_encode(['logged_in' => false]);
    exit();
}

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $fetch_history = "SELECT r.car_id, r.rental_date, r.rental_duration_days, r.total_cost, r.request_status, r.request_id, r.payment_status ,c.image, c.model FROM rental_requests r INNER JOIN cars c ON r.car_id = c.car_id WHERE r.user_id = ? AND request_status IN ('Pending', 'Approved', 'Cancelled', 'Returned')";
    $fetch_stmt = $conn->prepare($fetch_history);
    $fetch_stmt->bind_param("i",$user_id);
    $fetch_stmt->execute();
    $result = $fetch_stmt->get_result();

    $history = [];

    while($row = mysqli_fetch_assoc($result)){
        $history[] = $row;
    }

    echo json_encode($history);
    $fetch_stmt->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD']==='POST') {
    $reqData = json_decode(file_get_contents('php://input'), true);

    if($reqData['action']==="cancel"){
        $request_id =$reqData['reqID'];

        $cancel_query = "UPDATE rental_requests SET request_status = 'Cancelled' WHERE request_id = ? AND user_id = ? AND request_status IN ('Pending', 'Approved')";
        $cancel_query_stmt = $conn->prepare($cancel_query);
        $cancel_query_stmt->bind_param("ii", $request_id, $user_id);
        $cancel_query_stmt->execute();

        if(!$cancel_query_stmt->execute()){
            echo json_encode(["cancelled"=>false]);
            exit();
        } else if ($cancel_query_stmt->execute()){
            echo json_encode(["cancelled"=>true]);
            $cancel_query_stmt->close();
            exit();
        }
    }
}

?>