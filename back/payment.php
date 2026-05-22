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
    $paymentType = $_POST['paymentType'];

    $photo_dir = "C:/xampp/htdocs/vnm-system1/uploads/payments/";
    $ext = pathinfo($photo['name'], PATHINFO_EXTENSION);
    $payment_proof = uniqid(). "." . $ext;
    $proof_path = $photo_dir . $payment_proof;
    $proof_pic_path = "uploads/payments/".$payment_proof;
    
    if(!is_dir($photo_dir)){
        mkdir($photo_dir, 0755, true);
    }
    
    if(move_uploaded_file($photo['tmp_name'], $proof_path)){
        if($action==='payment'){
            if($paymentType === 'Downpayment') {
                $payment_query = "UPDATE rental_requests 
                                  SET downpayment_proof_path = ?,
                                  downpayment_method = ?,
                                  downpayment_reference_no = ?,
                                  payment_status = 'Downpayment Proof Uploaded'
                                  WHERE user_id = ? AND request_id = ?";
            } else {
                $payment_query = "UPDATE rental_requests 
                SET final_payment_proof_path = ?,
                final_payment_method = ?,
                final_payment_reference_no = ?,
                payment_status = 'Final Proof Uploaded'
                WHERE user_id = ? AND request_id = ?";
            }

            $payment_stmt = $conn->prepare($payment_query);
            $payment_stmt->bind_param("sssii", $proof_pic_path, $method, $ref, $uID, $reqID);

            if($payment_stmt->execute()){
                echo json_encode(['payment' => true]);
                $payment_stmt->close();

                exit();
            } else {
                echo json_encode(['payment' => false]);
                $payment_stmt->close();
                exit();
            }
        }
    }
}
?>