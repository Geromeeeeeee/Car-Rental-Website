<?php
include 'config.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

include 'db_header.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $user_data = json_decode(file_get_contents('php://input'));
    
    $action = "";
    if (isset($_POST['action'])) {
        $action = $_POST['action']; 
    } elseif ($user_data && isset($user_data->action)) {
        $action = $user_data->action;
    }

    // LOGIN PROCESS 
    if ($action === "login") {
        $email = $user_data->email ?? '';
        $pass = $user_data->password ?? '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["stat" => "invalid_format"]);
            exit;
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

    // SIGNUP PROCESS (STAGE 1: Validation, Upload, and Send OTP)
    if ($action === "signup") {
        $fullName = $_POST['fullName'] ?? '';
        $email = $_POST['email'] ?? '';
        $pass = $_POST['password'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $address = $_POST['address'] ?? '';
        $licenseNumber = $_POST['licenseNumber'] ?? '';

        // 1. Validations
        $nameParts = array_filter(explode(" ", $fullName));
        if (count($nameParts) < 2) { echo json_encode(["signup" => "1"]); exit; }
        if (!preg_match("/^[a-zA-Z ]+$/", $fullName)) { echo json_encode(["signup" => "2"]); exit; }
        if (strlen($fullName) < 5) { echo json_encode(["signup" => "3"]); exit; }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { echo json_encode(["signup" => "4"]); exit; }
        if (strlen($pass) < 8 || strlen($pass) > 20) { echo json_encode(["signup" => "5"]); exit; }
        if (!preg_match("/^[A-Za-z0-9]{3}-?\d{2}-?\d{6}$/", trim($licenseNumber))) { echo json_encode(["signup" => "6"]); exit; }
        
        // Check if email already exists
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

        // 2. File Upload Handling
        if (!isset($_FILES['licenseImage']) || $_FILES['licenseImage']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(["signup" => "8"]); 
            exit;
        }

        $file = $_FILES['licenseImage'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        if (!in_array($fileExt, ['jpg', 'jpeg', 'png'])) { echo json_encode(["signup" => "9"]); exit; }
        if ($fileSize > 5 * 1024 * 1024) { echo json_encode(["signup" => "10"]); exit; }

        $newFileName = "lic_" . uniqid() . "." . $fileExt;
        $uploadDirectory = "C:/xampp/htdocs/mlt-admin/back/Uploads/License/";
        if (!is_dir($uploadDirectory)) { mkdir($uploadDirectory, 0777, true); }

        // 3. Move File & Create OTP
        if (move_uploaded_file($fileTmpName, $uploadDirectory . $newFileName)) {
            $otp = rand(100000, 999999);
            $expiry = date("Y-m-d H:i:s", strtotime("+5 minutes"));

            // Clear any old pending codes for this email
            $clean_stmt = $conn->prepare("DELETE FROM usersreset WHERE email = ?");
            $clean_stmt->bind_param("s", $email);
            $clean_stmt->execute();
            $clean_stmt->close();

            // Save OTP to temporary table
            $insert_stmt = $conn->prepare("INSERT INTO usersreset (email, reset_code, reset_expiry) VALUES (?, ?, ?)");
            $insert_stmt->bind_param("sss", $email, $otp, $expiry);
            $insert_stmt->execute();
            $insert_stmt->close();

            // Send OTP Email using PHPMailer
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = SMTP_EMAIL;
                $mail->Password   = SMTP_PASSWORD;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('mltcarrental.official@gmail.com', 'MLT Car Rental');
                $mail->addAddress($email, $fullName);

                $mail->isHTML(true);
                $mail->Subject = 'Verify Your MLT Car Rental Account';
                $mail->Body    = "
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <h2>Hello " . htmlspecialchars($fullName) . ",</h2>
                        <p>Thank you for registering! Please use this OTP code to complete your registration:</p>
                        <h1 style='color: #1e3a8a; letter-spacing: 2px;'>" . $otp . "</h1>
                        <p>This code is valid for 5 minutes only.</p>
                    </div>";

                $mail->send();
                echo json_encode(["signup" => "otp_sent", "savedFilename" => $newFileName]);
            } catch (Exception $e) {
                echo json_encode(["signup" => "8", "error" => $mail->ErrorInfo]);
            }
        } else {
            echo json_encode(["signup" => "11"]); 
        }
        exit;
    }

    // VERIFY SIGNUP OTP 
    if ($action === "verify_signup_otp") {
        $email = $user_data->email ?? '';
        $otp = $user_data->otp ?? '';
        $fullName = $user_data->fullName ?? '';
        $pass = $user_data->password ?? '';
        $phone = $user_data->phone ?? '';
        $address = $user_data->address ?? '';
        $licenseNumber = $user_data->licenseNumber ?? '';
        $savedFilename = $user_data->savedFilename ?? '';
        $current_time = date("Y-m-d H:i:s");

        // Check if OTP is valid and not expired
        $stmt = $conn->prepare("SELECT email FROM usersreset WHERE email = ? AND reset_code = ? AND reset_expiry > ?");
        $stmt->bind_param("sss", $email, $otp, $current_time);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $stmt->close();
            
            // pinapasok na sa users table
            $hashed_password = password_hash($pass, PASSWORD_DEFAULT);
            $stmt_signup = $conn->prepare("INSERT INTO users(fullname, email, phone, address, license, license_picture, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt_signup->bind_param("sssssss", $fullName, $email, $phone, $address, $licenseNumber, $savedFilename, $hashed_password);
            
            if ($stmt_signup->execute()) {
                // Delete the used OTP code
                $delete_stmt = $conn->prepare("DELETE FROM usersreset WHERE email = ?");
                $delete_stmt->bind_param("s", $email);
                $delete_stmt->execute();
                $delete_stmt->close();

                echo json_encode(["signup" => "success"]);
            } else {
                echo json_encode(["signup" => "8"]);
            }
            $stmt_signup->close();
        } else {
            $stmt->close();
            echo json_encode(["signup" => "invalid_otp"]);
        }
        exit;
    }
    
    // REQUEST OTP (FORGOT PASSWORD)
    if ($action === "forgot_password_request") {
        $email = $user_data->email ?? '';

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

            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = SMTP_EMAIL;
                $mail->Password   = SMTP_PASSWORD;
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
                        <h1 style='color: #1e3a8a;'> warmth" . $otp . "</h1>
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

    // VERIFY OTP ONLY
    if ($action === "verify_otp_only") {
        $email = $user_data->email ?? '';
        $otp = $user_data->otp ?? '';
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
        $email = $user_data->email ?? '';
        $otp = $user_data->otp ?? '';
        $new_pass = $user_data->password ?? '';
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
        session_unset();
        session_destroy();
        echo json_encode(["stat" => "logout_success"]);
        exit;
    }
}

$conn->close();
?>