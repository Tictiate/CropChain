<?php
// public/seed.php
require_once 'db.php';

echo "<h2>🌱 Seeding Database...</h2>";

// 1. Reset Database
$pdo->exec("DROP TABLE IF EXISTS users");

// Re-create Users Table with new schema
$query = "CREATE TABLE users (
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

// 2. Create Test Users
$users = [
    ['username' => 'farmer_test', 'password' => 'password123', 'role' => 'Farmer', 'email' => 'farmer@cropchain.com', 'phone' => '+91-9876543210', 'location' => 'Punjab, India'],
    ['username' => 'dist_test', 'password' => 'password123', 'role' => 'Distributor', 'email' => 'distributor@logistics.com', 'phone' => '+91-9876543211', 'location' => 'New Delhi, India'],
    ['username' => 'retail_test', 'password' => 'password123', 'role' => 'Retailer', 'email' => 'retailer@freshmart.com', 'phone' => '+91-9876543212', 'location' => 'Mumbai, India'],
    ['username' => 'consumer_test', 'password' => 'password123', 'role' => 'Consumer', 'email' => 'consumer@gmail.com', 'phone' => '+91-9876543213', 'location' => 'Bangalore, India'],
    ['username' => 'admin_test', 'password' => 'password123', 'role' => 'Admin', 'email' => 'admin@cropchain.com', 'phone' => '+91-0000000000', 'location' => 'HQ']
];

// Add some more mock users
$extra_users = [
    ['username' => 'ramesh_farmer', 'password' => 'password123', 'role' => 'Farmer', 'email' => 'ramesh@kisan.com', 'phone' => '+91-9812345678', 'location' => 'Haryana, India'],
    ['username' => 'fresh_logistics', 'password' => 'password123', 'role' => 'Distributor', 'email' => 'contact@freshlogistics.in', 'phone' => '+91-9988776655', 'location' => 'Pune, Maharashtra'],
    ['username' => 'green_grocers', 'password' => 'password123', 'role' => 'Retailer', 'email' => 'store@greengrocers.com', 'phone' => '+91-9123456789', 'location' => 'Chennai, Tamil Nadu']
];

$users = array_merge($users, $extra_users);

foreach ($users as $u) {
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, email, phone, location, wallet_address) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $wallet = '0xTest' . bin2hex(random_bytes(4));
        $passHash = password_hash($u['password'], PASSWORD_DEFAULT);
        $stmt->execute([$u['username'], $passHash, $u['role'], $u['email'], $u['phone'], $u['location'], $wallet]);
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