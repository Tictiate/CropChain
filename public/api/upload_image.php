<?php
// public/api/upload_image.php
header("Content-Type: application/json");

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No image uploaded or upload error.']);
    exit;
}

$file = $_FILES['image'];
$uploadDir = __DIR__ . '/../uploads/';

// Create directory if not exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
// finfo_close($finfo); // Deprecated in PHP 8.X, freed automatically

if (!in_array($mimeType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.']);
    exit;
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('crop_', true) . '.' . $extension;
$destination = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Return the public URL
    // Assuming server root is 'public/'
    $publicUrl = 'uploads/' . $filename;
    echo json_encode(['success' => true, 'url' => $publicUrl]);
}
else {
    echo json_encode(['success' => false, 'message' => 'Failed to transform file.']);
}
?>