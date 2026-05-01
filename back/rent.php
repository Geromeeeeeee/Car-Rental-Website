<?php
include 'db_header.php';
session_start();

if($_SERVER['REQUEST_METHOD']==='POST'){
    $action = $_POST['action'];

    //para hindi ma rent yung cars na may pending requests on certain dates
    if($action === 'getDates'){
        $carID = $_POST['carID'];
        $getDates = "SELECT rental_date AS start_date, DATE_ADD(rental_date, INTERVAL rental_duration_days DAY) AS end_date FROM rental_requests WHERE car_id = ? AND request_status NOT IN ('Returned', 'Cancelled', 'Rejected')";
        $stmt = $conn->prepare($getDates);
        $stmt->bind_param('i',$carID);
        $stmt->execute();
        $result = $stmt->get_result();

        $booked_dates = [];
        while($row = $result->fetch_assoc()){
            $booked_dates[]= [
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date']
            ];
        }

        echo json_encode(['booked_dates' => $booked_dates]);
        $stmt->close();
        exit();
    }

    //Rental request block
    if($action==='request'){
        if(!isset($_SESSION['user_id'])){
            echo json_encode(['logged_in' => false]);
            exit();
        } else {

            $user_id = $_SESSION['user_id'];
            $carID = $_POST['carID'];
            $date =  $_POST['date'];
            $time =  $_POST['time'];
            $duration =  $_POST['duration'];
            $totalPrice =  $_POST['totalPrice'];
            $photo = $_FILES['photo'];
            $requestStat = 'pending';

            $photo_dir = "C:/xampp/htdocs/vnm-system1-copy/uploads/licenses/";
            $ext = pathinfo($photo['name'], PATHINFO_EXTENSION);
            $license_pic = uniqid(). "." . $ext;
            $license_path = $photo_dir . $license_pic;

            if(move_uploaded_file($photo['tmp_name'], $license_path)){
                $create_request = "INSERT INTO rental_requests(user_id, car_id, driver_license_photo, rental_date, rental_time, rental_duration_days, total_cost, request_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                $stmt = $conn->prepare($create_request);
                $stmt->bind_param("iisssids",$user_id, $carID, $license_pic, $date, $time, $duration, $totalPrice, $requestStat);
                if($stmt->execute()){
                    echo json_encode(['request_stat' => true]);
                    $stmt->close();
                    exit();
                } else {
                    echo json_encode(['request_stat' => false]);
                    $stmt->close();
                    exit();
                }
            }
        }
    }
}
?>