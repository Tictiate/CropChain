<?php
// public/register.php
session_start();
require_once 'db.php';

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'];
    $wallet = !empty($_POST['wallet_address']) ? $_POST['wallet_address'] : '0xMock_' . bin2hex(random_bytes(4));

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, wallet_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $password, $role, $wallet]);
        header("Location: login.php");
        exit();
    }
    catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            $message = "Username already exists.";
        }
        else {
            $message = "Error: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - CropChain</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body style="background-image: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);">
    <div class="nav" style="background: transparent; box-shadow: none;">
        <a href="index.php"><strong>🌿 CropChain</strong></a>
    </div>

    <div class="container" style="max-width: 450px;">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="margin-bottom: 0.5rem;">Create Account</h2>
            <p style="color: var(--text-secondary);">Join the transparent agricultural network.</p>
        </div>

        <?php if ($message): ?>
        <p class="error">
            <?php echo htmlspecialchars($message); ?>
        </p>
        <?php
endif; ?>

        <form method="POST" action="register.php">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a unique username" required>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create a strong password" required>
            </div>

            <div class="form-group">
                <label>I am a...</label>
                <select name="role" required>
                    <option value="" disabled selected>Select your role</option>
                    <option value="Farmer">👨‍🌾 Farmer (Producer)</option>
                    <option value="Distributor">🚚 Distributor (Logistics)</option>
                    <option value="Retailer">🏪 Retailer (Seller)</option>
                    <option value="Consumer">🛒 Consumer (Buyer)</option>
                    <option value="Admin">🛠️ Admin (Manager)</option>
                </select>
            </div>

            <div class="form-group">
                <label>Wallet Address (MetaMask)</label>
                <input type="text" name="wallet_address" placeholder="0x..." required>
                <small style="color: var(--text-secondary); display: block; margin-top: 5px;">Used for blockchain
                    verification.</small>
            </div>

            <button type="submit" class="btn-primary">Create Account</button>
        </form>

        <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary);">
            Already have an account? <a href="login.php" style="font-weight: 600;">Sign in</a>
        </p>
    </div>
</body></html>