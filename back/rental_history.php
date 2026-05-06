<?php
include 'db_header.php';
session_start();

$user_id = $_SESSION['user_id'];

$fetch_history = "SELECT r.car_id, r.rental_date, r.rental_duration_days, r.total_cost, r.request_status, r.request_id,c.image, c.model FROM rental_requests r INNER JOIN cars c ON r.car_id = c.car_id WHERE r.user_id = ? AND request_status IN ('Pending', 'Approved', 'Cancelled')";
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

?>