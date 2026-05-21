<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

include 'db_header.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // FormData for Signup, JSON for Login/OTP
    $action = "";
    if (isset($_POST['action'])) {
        $action = $_POST['action']; 
    } else {
        $user_data = json_decode(file_get_contents('php://input'));
        if ($user_data && isset($user_data->action)) {
            $action = $user_data->action;
        }
    }

    // LOGIN PROCESS 
    if ($action === "login") {
        $email = $user_data->email;
        $pass = $user_data->password;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $login_error = "Invalid email format.";
        } else {
            $stmt = $conn->prepare("SELECT user_id, password FROM users WHERE TRIM(email)=?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows == 1) {
                $data = $result->fetch_assoc();
                $stored_password = $data['password'];
                if (password_verify($pass, $stored_password)) {
                    $_SESSION['user_id'] = $data['user_id'];
                    $_SESSION['email'] = $email;
                    echo json_encode(["stat" => "logged"]);
                    exit;
                } else {
                    echo json_encode(["stat" => "failed"]);
                    exit;
                }
            } else {
                echo json_encode(["stat" => "notfound"]);
                exit;
            }
            $stmt->close();
        }
    }

    // SIGNUP PROCESS 
    if ($action === "signup") {
        $fullName = $_POST['fullName'] ?? '';
        $email = $_POST['email'] ?? '';
        $pass = $_POST['password'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $licenseNumber = $_POST['licenseNumber'] ?? '';
        $defaultAdd = "Address";

        // Full name check
        $nameParts = array_filter(explode(" ", $fullName));
        if (count($nameParts) < 2) {
            echo json_encode(["signup" => "1"]);
            exit;
        } // Letter only check
        elseif (!preg_match("/^[a-zA-Z ]+$/", $fullName)) {
            echo json_encode(["signup" => "2"]);
            exit;
        } // Short name check
        elseif (strlen($fullName) < 5) {
            echo json_encode(["signup" => "3"]);
            exit;
        }

        // Email structure validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["signup" => "4"]);
            exit;
        }

        // Password structure validation
        if (strlen($pass) < 8 || strlen($pass) > 20) {
            echo json_encode(["signup" => "5"]);
            exit;
        }

        // License Validation
        if (!preg_match("/^[A-Za-z0-9]{3}-?\d{2}-?\d{6}$/", trim($licenseNumber))) {
            echo json_encode(["signup" => "6"]);
            exit;
        }
        if (!isset($_FILES['licenseImage']) || $_FILES['licenseImage']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(["signup" => "8"]); 
            exit;
        }

        $file = $_FILES['licenseImage'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];

        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExts = ['jpg', 'jpeg', 'png'];
        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(["signup" => "9"]); 
            exit;
        }

        if ($fileSize > 5 * 1024 * 1024) {
            echo json_encode(["signup" => "10"]); 
            exit;
        }

        $check = $conn->prepare("SELECT user_id FROM users WHERE TRIM(email)=?");
        $check->bind_param("s", $email);
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["signup" => "7"]);
            $check->close();
            exit;
        }
        $check->close();
        
        $newFileName = "lic_" . uniqid() . "." . $fileExt;
        $uploadDirectory = "uploads/";

        if (!is_dir($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true);
        }

        $fileDestination = $uploadDirectory . $newFileName;

        if (move_uploaded_file($fileTmpName, $fileDestination)) {
            $hashed_password = password_hash($pass, PASSWORD_DEFAULT);
            
            $stmt_signup = $conn->prepare("INSERT INTO users(fullname, email, phone, address, license, license_picture, password) VALUES (?, ?, ?, ?, ?, ?, ?)");

            if (!$stmt_signup) {
                echo json_encode(["signup" => "8"]);
                exit;
            }

            $stmt_signup->bind_param("sssssss", $fullName, $email, $phone, $defaultAdd, $licenseNumber, $newFileName, $hashed_password);
            
            if ($stmt_signup->execute()) {
                echo json_encode(["signup" => "success"]);
            } else {
                echo json_encode(["signup" => "8"]);
            }
            $stmt_signup->close();
        } else {
            echo json_encode(["signup" => "11"]); 
        }
        exit;
    }

    // REQUEST OTP 
    if ($action === "forgot_password_request") {
        $email = $user_data->email;

        $stmt = $conn->prepare("SELECT user_id, fullname FROM users WHERE TRIM(email)=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user_info = $result->fetch_assoc();
            $fullname = $user_info['fullname'];
            
            $otp = rand(100000, 999999);
            $expiry = date("Y-m-d H:i:s", strtotime("+5 minutes"));

            $clean_stmt = $conn->prepare("DELETE FROM usersreset WHERE email = ?");
            $clean_stmt->bind_param("s", $email);
            $clean_stmt->execute();
            $clean_stmt->close();

            $insert_stmt = $conn->prepare("INSERT INTO usersreset (email, reset_code, reset_expiry) VALUES (?, ?, ?)");
            $insert_stmt->bind_param("sss", $email, $otp, $expiry);
            $insert_stmt->execute();
            $insert_stmt->close();

            // DITO IPINASOK YUNG PHPMAILER 
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'mltcarrental.official@gmail.com'; 
                $mail->Password   = 'sexn skcq wtuc teye'; 
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('mltcarrental.official@gmail.com', 'MLT Car Rental');
                $mail->addAddress($email, $fullname);

                $mail->isHTML(true);
                $mail->Subject = 'Your MLT Car Rental OTP Code';
                $mail->Body    = "
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <h2>Hello " . htmlspecialchars($fullname) . ",</h2>
                        <p>Use this OTP to reset your password:</p>
                        <h1 style='color: #1e3a8a;'>" . $otp . "</h1>
                    </div>";

                $mail->send();
                echo json_encode(["status" => "otp_generated"]);
            } catch (Exception $e) {
                echo json_encode(["status" => "email_failed", "error" => $mail->ErrorInfo]);
            }

            $stmt->close();
            exit;
        } else {
            echo json_encode(["status" => "email_not_found"]);
        }
        $stmt->close();
        exit;
    }

    // VERIFY OTP 
    if ($action === "verify_otp_only") {
        $email = $user_data->email;
        $otp = $user_data->otp;
        $current_time = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("SELECT email FROM usersreset WHERE email = ? AND reset_code = ? AND reset_expiry > ?");
        $stmt->bind_param("sss", $email, $otp, $current_time);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            echo json_encode(["status" => "otp_valid"]);
        } else {
            echo json_encode(["status" => "invalid_otp"]);
        }
        $stmt->close();
        exit;
    }

    // RESET PASSWORD 
    if ($action === "verify_otp_and_reset") {
        $email = $user_data->email;
        $otp = $user_data->otp;
        $new_pass = $user_data->password;
        $current_time = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("SELECT email FROM usersreset WHERE email = ? AND reset_code = ? AND reset_expiry > ?");
        $stmt->bind_param("sss", $email, $otp, $current_time);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $hashed_password = password_hash($new_pass, PASSWORD_DEFAULT);

            $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
            $update_stmt->bind_param("ss", $hashed_password, $email);

            if ($update_stmt->execute()) {
                $delete_stmt = $conn->prepare("DELETE FROM usersreset WHERE email = ?");
                $delete_stmt->bind_param("s", $email);
                $delete_stmt->execute();
                $delete_stmt->close();

                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "failed"]);
            }
            $update_stmt->close();
        } else {
            echo json_encode(["status" => "invalid_otp"]);
        }
        $stmt->close();
        exit;
    }

    // LOGOUT 
    if ($action === "logout") {
        $action = ""; 
        session_unset();
        session_destroy();
        exit;
    }
}

$conn->close();
?>