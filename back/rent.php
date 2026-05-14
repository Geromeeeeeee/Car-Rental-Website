<?php
include 'db_header.php';
session_start();

if($_SERVER['REQUEST_METHOD']==='POST'){
    $action = $_POST['action'];

    //Greying out ng dates na may pending na rental
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
            //If less than 1 yung duration, hindi papasok sa database
            $duration =  (int)$_POST['duration'];
            if($duration < 1){
                echo json_encode(['request_stat' => false, 'error'=>'duration']);
                exit();
            } else {
                //Actual disabling ng rental kapag lumagpas yung duration sa mga date na may pending rentals.
                $carID = $_POST['carID'];
                $date =  $_POST['date'];
                $start_date = new DateTime($date);
                $start_date->modify("+" . ($duration-1) . " days");
                $end_date = $start_date->format("Y-m-d");
                $overlap = "SELECT COUNT(*) as overlap_count FROM rental_requests WHERE car_id=? AND request_status NOT IN ('Returned', 'Cancelled', 'Rejected') AND (? <= DATE_ADD(rental_date, INTERVAL rental_duration_days DAY) AND ? >= rental_date)";

                $overlap_stmt = $conn->prepare($overlap);
                $overlap_stmt->bind_param("iss", $carID, $date, $end_date);
                $overlap_stmt->execute();
                $overlap_dates = $overlap_stmt->get_result()->fetch_assoc();

                if($overlap_dates['overlap_count']>0){
                    echo json_encode(['request_stat' => false, 'error'=>'overlap']);
                    $overlap_stmt->close();
                    exit();
                } else {
                    //Insert block ng rental request sa database
                    $user_id = $_SESSION['user_id'];
                    $time =  $_POST['time'];
                    $totalPrice =  $_POST['totalPrice'];
                    $photo = $_FILES['photo'];
                    $requestStat = 'pending';

                    $photo_dir = "C:/xampp/htdocs/vnm-system1/uploads/licenses/";
                    $ext = pathinfo($photo['name'], PATHINFO_EXTENSION);
                    $license_pic = uniqid(). "." . $ext;
                    $license_path = $photo_dir . $license_pic;
                    $license_pic_path = "uploads/licenses/".$license_pic;

                    if(move_uploaded_file($photo['tmp_name'], $license_path)){
                        $create_request = "INSERT INTO rental_requests(user_id, car_id, driver_license_photo, rental_date, rental_time, rental_duration_days, total_cost, request_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                        $stmt = $conn->prepare($create_request);
                        $stmt->bind_param("iisssids",$user_id, $carID, $license_pic_path, $date, $time, $duration, $totalPrice, $requestStat);
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
    }
}
?>