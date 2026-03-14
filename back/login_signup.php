<?php
include 'db_header.php';

session_start();

if($_SERVER['REQUEST_METHOD']==='POST'){
    $user_data = json_decode(file_get_contents('php://input'));

    //login process. hindi ko to masyadong gets, kinuha ko lang sa code ni gab. sorry >.<
    if($user_data->action==="login"){

        $email = $user_data->email;
        $pass = $user_data->password;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $login_error = "Invalid email format.";
        } else {
            $stmt = $conn->prepare("SELECT user_id, password FROM users WHERE TRIM(email)=?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if($result->num_rows==1){
                $data = $result->fetch_assoc();
                $stored_password = $data['password'];
                //Checking if credentials match
                 if (password_verify($pass, $stored_password)) {
                    $_SESSION['user_id'] = $data['user_id'];
                    $_SESSION['email'] = $email;
                    echo json_encode(["stat" => "logged"]);
                    exit;
                } else {
                    echo json_encode(["stat" => "failed"]);
                    exit;
                }
            //Checking if may credentials talaga sa database. If wala, this happens.
            } else {
                echo json_encode(["stat" => "notfound"]);
                exit;
            }
            $stmt -> close();
        }

    }

    //Signup process
    if($user_data->action==="signup"){
        $fullName = $user_data->fullName;
        $email = $user_data->email;
        $pass = $user_data->password;
        $phone = $user_data->phone;
        $licenseNumber = $user_data->licenseNumber;
        $defaultAdd = "Address";

        //Validation ng mga user input. Di ko gets ginawa ni gab
        $nameParts = array_filter(explode(" ", $fullName));
        if (count($nameParts) < 2) {
            echo json_encode(["signup" => "1"]);
            exit;
        } elseif (!preg_match("/^[a-zA-Z ]+$/", $fullName)) {
            echo json_encode(["signup" => "2"]);
            exit;
        } elseif (strlen($fullName) < 5) {
            echo json_encode(["signup" => "3"]);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["signup" => "4"]);
            exit;
        }

        if (strlen($pass) < 8 || strlen($pass) > 20) {
            echo json_encode(["signup" => "5"]);
            exit;
        }

        if (!preg_match("/^[A-Z]{3}\s?\d{2,4}$/", $licenseNumber)) {
            echo json_encode(["signup" => "6"]);
            exit;
        }

        $check = $conn->prepare("SELECT user_id FROM users WHERE TRIM(email)=?");
        $check->bind_param("s", $email);
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows > 0){
            echo json_encode(["signup" => "7"]);
            $check->close();
            exit;
        } $check->close();
        
        $hashed_password = password_hash($pass, PASSWORD_DEFAULT);
        $stmt_signup = $conn->prepare("INSERT INTO users(fullname,email,phone,address,license,password) VALUES (?, ?, ?, ?, ?, ?)");

        if (!$stmt_signup) {
            echo json_encode(["signup" => "8"]);
            exit;
        }

        $stmt_signup->bind_param("ssssss", $fullName, $email, $phone, $defaultAdd ,$licenseNumber, $hashed_password);
        if ($stmt_signup->execute()) {
            echo json_encode(["signup" => "success"]);
        } else {
            echo json_encode(["signup" => "8"]);
        }
        $stmt_signup->close();
    }

    if($user_data->action==="logout"){
        session_unset();
        session_destroy();
        exit;
    }
}

$conn->close();

?>