<?php
include 'db_header.php';

session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode(["logged" => true, "email" => $_SESSION['email']]);
} else {
    echo json_encode(["logged" => false]);
}
?>