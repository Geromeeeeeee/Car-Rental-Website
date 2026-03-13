<?php
include 'db_header.php';

if($_SERVER['REQUEST_METHOD']==='POST'){
    $user_data = json_decode(file_get_contents('php://input'));

    //login process. hindi ko to masyadong gets, kinuha ko lang sa code ni gab. sorry >.<
    if($user_data->action=="login"){

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
                    echo json_encode(["stat" => "logged"]);
                    exit;
                } else {
                    echo json_encode(["stat" => "failed"]);
                }
            //Checking if may credentials talaga sa database. If wala, this happens.
            } else {
                echo json_encode(["stat" => "notfound"]);
            }
            $stmt -> close();
        }

    }
}

$conn -> close();

?>