<?php
include 'db_header.php';

if($_SERVER['REQUEST_METHOD']==='GET'){

    $sql = "SELECT 
                c.car_id, 
                c.image, 
                c.model, 
                c.year,
                c.fuel_type, 
                c.transmission, 
                c.daily_rate, 
                c.description,
                GROUP_CONCAT(ci.image_path ORDER BY ci.image_id SEPARATOR ',') AS additional_images 
            FROM cars c
            LEFT JOIN car_images ci ON c.car_id = ci.car_id
            WHERE c.availability = 1
            GROUP BY c.car_id
            ORDER BY c.car_id DESC";

    $result = $conn->query($sql);
    $cars = [];
    if ($result) {
        $cars = $result->fetch_all(MYSQLI_ASSOC);
    }

    $featured_sql = "SELECT 
        c.car_id,
        c.model,
        c.image,
        COUNT(r.car_id) AS rental_count 
        FROM cars c 
        JOIN rental_requests r ON c.car_id = r.car_id
        GROUP BY c.car_id, c.model, c.image
        ORDER BY rental_count DESC";

    $featured_result = $conn->query($featured_sql);
    $featured_cars = [];

    if($featured_result){
        while($row = mysqli_fetch_assoc($featured_result)){
            $featured_cars[] = $row;
        }
    }

    $car_data = [
        'cars'=>$cars,
        'featured'=>$featured_cars
    ];

    echo json_encode($car_data);
}
?>