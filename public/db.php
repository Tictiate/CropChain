<?php
// public/db.php

$db_path = __DIR__ . '/../database/database.sqlite';

try {
    $pdo = new PDO("sqlite:$db_path");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create Users Table if not exists
    $query = "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
