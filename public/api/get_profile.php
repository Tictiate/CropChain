<?php
// public/api/get_profile.php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit();
}

$response = [
    'username' => $_SESSION['username'],
    'role' => $_SESSION['role'],
    'wallet_address' => $_SESSION['wallet_address']
];

echo json_encode($response);
?>