<?php
// public/db.php

$host = '127.0.0.1';
$db   = 'cropchain';
$user = 'root';
$pass = 'Ishaan@11';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Create Users Table if not exists
    $query = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        location TEXT,
        wallet_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($query);

    // Create Crop Logs Table (for offline/marketplace caching)
    $queryLogs = "CREATE TABLE IF NOT EXISTS crop_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INTEGER,
        farmer_id INTEGER,
        crop_name TEXT,
        quality TEXT,
        quantity TEXT,
        expected_price REAL,
        location TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(farmer_id) REFERENCES users(id)
    )";
    $pdo->exec($queryLogs);

}
catch (PDOException $e) {
    die("Database Connection failed: " . $e->getMessage());
}
?>
