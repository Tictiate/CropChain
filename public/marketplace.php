<?php
// public/marketplace.php
session_start();
require_once 'db.php';

// Fetch logs from DB
$query = "SELECT cl.*, u.username as farmer_name FROM crop_logs cl JOIN users u ON cl.farmer_id = u.id ORDER BY logged_at DESC";
try {
    $stmt = $pdo->query($query);
    $crops = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketplace - CropChain</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="nav">
        <div><a href="index.php" style="margin:0; text-decoration:none; color:inherit;"><strong>🌿 CropChain
                    Marketplace</strong></a></div>
        <div style="display: flex; align-items: center; gap: 1.5rem;">
            <?php if (isset($_SESSION['user_id'])): ?>
            <a href="dashboard.php">Dashboard</a>
            <div
                style="display: flex; align-items: center; gap: 0.5rem; background: #f3f4f6; padding: 0.5rem 1rem; border-radius: 99px;">
                <div
                    style="width: 32px; height: 32px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                    <?php echo strtoupper(substr($_SESSION['username'], 0, 1)); ?>
                </div>
                <div style="display: flex; flex-direction: column; line-height: 1.2;">
                    <span style="font-weight: 600; font-size: 0.9rem;">
                        <?php echo htmlspecialchars($_SESSION['username']); ?>
                    </span>
                </div>
            </div>
            <a href="logout.php" style="color: #ef4444;">Logout</a>
            <?php
else: ?>
            <a href="login.php">Login</a>
            <a href="register.php">Register</a>
            <?php
endif; ?>
        </div>
    </div>

    <div class="container" style="max-width: 1000px;">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2>Fresh Produce Marketplace</h2>
            <p style="color: var(--text-secondary);">Real-time listings from verified farmers on the blockchain.</p>
        </div>

        <?php if (count($crops) > 0): ?>
        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Crop / Produce</th>
                        <th>Quality</th>
                        <th>Quantity (kg)</th>
                        <th>Price (Tokens/kg)</th>
                        <th>Location</th>
                        <th>Farmer</th>
                        <th>Listed At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($crops as $crop): ?>
                    <tr>
                        <td>
                            <strong>
                                <?php echo htmlspecialchars($crop['crop_name']); ?>
                            </strong><br>
                            <span style="font-size: 0.8rem; color: var(--text-secondary);">ID: #
                                <?php echo htmlspecialchars($crop['product_id']); ?>
                            </span>
                        </td>
                        <td><span
                                style="background: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">
                                <?php echo htmlspecialchars($crop['quality']); ?>
                            </span></td>
                        <td>
                            <?php echo htmlspecialchars($crop['quantity']); ?>
                        </td>
                        <td style="font-weight: 600; color: var(--text-main);">
                            ₹
                            <?php echo htmlspecialchars($crop['expected_price']); ?>
                        </td>
                        <td>
                            <a href="https://www.google.com/maps/search/?api=1&query=<?php echo urlencode($crop['location']); ?>"
                                target="_blank" style="display: flex; align-items: center; gap: 4px;">
                                📍 View Map
                            </a>
                        </td>
                        <td>
                            <?php echo htmlspecialchars($crop['farmer_name']); ?>
                        </td>
                        <td style="color: var(--text-secondary); font-size: 0.9rem;">
                            <?php echo date('M d, H:i', strtotime($crop['logged_at'])); ?>
                        </td>
                    </tr>
                    <?php
    endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
else: ?>
        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <p>No crops listed yet. Farmers can add produce from their dashboard.</p>
            <a href="dashboard.php" class="btn btn-primary"
                style="display: inline-block; margin-top: 1rem; width: auto;">Go to Dashboard</a>
        </div>
        <?php
endif; ?>
    </div>
</body>

</html>