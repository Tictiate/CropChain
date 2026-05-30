<?php
// tests/test_backend.php

// A simple custom test runner to validate backend APIs and Database
require_once __DIR__ . '/../public/db.php';

$passed = 0;
$failed = 0;

function assertTest($name, $condition) {
    global $passed, $failed;
    if ($condition) {
        echo "✅ [PASS] $name\n";
        $passed++;
    } else {
        echo "❌ [FAIL] $name\n";
        $failed++;
    }
}

echo "Starting Backend Automated Tests...\n";
echo "-------------------------------------\n";

// Test 1: Database Connection
assertTest("Database Connection is successful", isset($pdo) && $pdo instanceof PDO);

// Test 2: Users Table exists
try {
    $stmt = $pdo->query("SELECT 1 FROM users LIMIT 1");
    assertTest("Users table exists and is accessible", $stmt !== false);
} catch (Exception $e) {
    assertTest("Users table exists and is accessible", false);
}

// Test 3: Crop_logs Table exists
try {
    $stmt = $pdo->query("SELECT 1 FROM crop_logs LIMIT 1");
    assertTest("Crop_logs table exists and is accessible", $stmt !== false);
} catch (Exception $e) {
    assertTest("Crop_logs table exists and is accessible", false);
}

// Test 4: Can fetch a known user (farmer_test)
try {
    $stmt = $pdo->prepare("SELECT username, role FROM users WHERE username = 'farmer_test'");
    $stmt->execute();
    $user = $stmt->fetch();
    assertTest("Can retrieve test user 'farmer_test' as Farmer", $user && $user['role'] === 'Farmer');
} catch (Exception $e) {
    assertTest("Can retrieve test user 'farmer_test' as Farmer", false);
}

// Test 5: Can execute GET users API logic locally
try {
    $stmt = $pdo->query("SELECT id, username, role, location FROM users LIMIT 5");
    $users = $stmt->fetchAll();
    assertTest("Can query users for directory API", is_array($users) && count($users) > 0);
} catch (Exception $e) {
    assertTest("Can query users for directory API", false);
}

echo "-------------------------------------\n";
echo "Tests Completed: " . ($passed + $failed) . "\n";
echo "Passed: $passed\n";
echo "Failed: $failed\n";

if ($failed > 0) {
    exit(1);
} else {
    exit(0);
}
?>
