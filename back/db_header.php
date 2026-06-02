<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");

date_default_timezone_set('Asia/Manila');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


$servername = getenv('DB_HOST') ?: "localhost";
$username   = getenv('DB_USER') ?: "root"; 
$password   = getenv('DB_PASS') ?: "";     
$dbname     = getenv('DB_NAME') ?: "vnm";   


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
