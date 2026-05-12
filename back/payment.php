<?php
include 'db_header.php';
session_start();
$uID = $_SESSION['user_id'];

if($_SERVER['REQUEST_METHOD']==='POST'){
    if(!isset($uID)){
        echo json_encode(['logged_in' => false]);
        exit();
    } 
    $action = $_POST['action'];
    $reqID = $_POST['reqID'];
    $method = $_POST['method'];
    $ref = $_POST['ref'];
    $photo = $_FILES['proof'];

    $photo_dir = "C:/xampp/htdocs/vnm-system1-copy/uploads/payments/";
    $ext = pathinfo($photo['name'], PATHINFO_EXTENSION);
    $payment_proof = uniqid(). "." . $ext;
    $proof_path = $photo_dir . $payment_proof;
    
    if(move_uploaded_file($photo['tmp_name'], $proof_path)){
        if($action==='payment'){
            $payment_query = "UPDATE rental_requests 
            SET payment_proof_path = ?,
            payment_method = ?,
            payment_reference_no = ?,
            payment_status = 'Proof Uploaded'
            WHERE user_id = ? AND request_id = ?";

            $payment_stmt = $conn->prepare($payment_query);
            $payment_stmt->bind_param("sssii", $proof_path, $method, $ref, $uID, $reqID);

            if($payment_stmt->execute()){
                echo json_encode(['request_stat' => true]);
                $payment_stmt->close();
                exit();
            } else {
                echo json_encode(['request_stat' => false]);
                $payment_stmt->close();
                exit();
            }
        }
    }
}
?>