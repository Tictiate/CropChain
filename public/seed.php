<?php
// public/seed.php
require_once 'db.php';

echo "<h2>🌱 Seeding Database...</h2>";

// 1. Clear existing test users/logs (optional, but good for reset)
// $pdo->exec("DELETE FROM users WHERE username LIKE '%_test'");
// $pdo->exec("DELETE FROM crop_logs");

// 2. Create Test Users
$users = [
    ['username' => 'farmer_test', 'password' => 'password123', 'role' => 'Farmer'],
    ['username' => 'dist_test', 'password' => 'password123', 'role' => 'Distributor'],
    ['username' => 'retail_test', 'password' => 'password123', 'role' => 'Retailer'],
    ['username' => 'consumer_test', 'password' => 'password123', 'role' => 'Consumer'],
    ['username' => 'admin_test', 'password' => 'password123', 'role' => 'Admin']
];

foreach ($users as $u) {
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, wallet_address) VALUES (?, ?, ?, ?)");
        $wallet = '0xTest' . bin2hex(random_bytes(4));
        $passHash = password_hash($u['password'], PASSWORD_DEFAULT);
        $stmt->execute([$u['username'], $passHash, $u['role'], $wallet]);
        echo "✅ Created User: {$u['username']} ({$u['role']})<br>";
    }
    catch (PDOException $e) {
        echo "⚠️ User {$u['username']} already exists (Skipping).<br>";
    }
}

// 3. Get Farmer ID for logs
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = 'farmer_test'");
$stmt->execute();
$farmer = $stmt->fetch(PDO::FETCH_ASSOC);
$farmerId = $farmer ? $farmer['id'] : 1;

// 4. Create Mock Crop Logs
$crops = [
    ['Organic Wheat', 'Grade A', '500', 30.50, 'Punjab, India'],
    ['Basmati Rice', 'Premium', '200', 85.00, 'Haryana, India'],
    ['Tomatoes', 'Red Fresh', '100', 40.00, 'Nashik, Maharashtra'],
    ['Cotton', 'Long Staple', '300', 120.00, 'Gujarat, India'],
    ['Potatoes', 'Large', '150', 25.00, 'Agra, UP']
];

echo "<br><strong>Creating Mock Crop Logs...</strong><br>";

// Clear old logs to avoid duplicates if re-running
$pdo->exec("DELETE FROM crop_logs");

foreach ($crops as $i => $c) {
    $stmt = $pdo->prepare("INSERT INTO crop_logs (product_id, farmer_id, crop_name, quality, quantity, expected_price, location, logged_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-$i days'))");
    // Mock Product IDs with 6 digits
    $stmt->execute([890123 + $i, $farmerId, $c[0], $c[1], $c[2], $c[3], $c[4]]);
    echo "✅ Logged: {$c[0]} at {$c[4]} (ID: " . (890123 + $i) . ")<br>";
}

echo "<br><h3>🎉 Seeding Complete!</h3>";
echo "
<script>
    // Auto-clear local storage to ensure fresh simulation state
    localStorage.clear();
    console.log('🧹 Simulation Data Cleared');
</script>
";
echo "<p><a href='index.php'>Go Home</a> | <a href='login.php'>Login</a></p>";
?>