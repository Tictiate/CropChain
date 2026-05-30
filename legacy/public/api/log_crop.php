<?php
// public/api/log_crop.php
session_start();
require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    exit();
}

if ($data) {
    $stmt = $pdo->prepare("INSERT INTO crop_logs (product_id, farmer_id, crop_name, quality, quantity, expected_price, location, logged_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['product_id'],
        $_SESSION['user_id'],
        $data['name'],
        $data['quality'],
        $data['quantity'],
        $data['expected_price'],
        $data['location'],
        date('Y-m-d H:i:s')
    ]);
    echo json_encode(['status' => 'success']);
}
else {
    echo json_encode(['status' => 'error', 'message' => 'No data provided']);
}
?>