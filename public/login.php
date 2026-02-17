<?php
// public/login.php
session_start();
require_once 'db.php';

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['wallet_address'] = $user['wallet_address'];
        header("Location: dashboard.php");
        exit();
    }
    else {
        $message = "Invalid username or password.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CropChain</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body style="background-image: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);">
    <div class="nav" style="background: transparent; box-shadow: none;">
        <a href="index.php"><strong>🌿 CropChain</strong></a>
    </div>

    <div class="container" style="max-width: 400px;">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="margin-bottom: 0.5rem;">Welcome Back</h2>
            <p style="color: var(--text-secondary);">Sign in to access your dashboard.</p>
        </div>

        <?php if ($message): ?>
        <p class="error">
            <?php echo htmlspecialchars($message); ?>
        </p>
        <?php
endif; ?>

        <form method="POST" action="login.php">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn-primary">Sign In</button>
        </form>

        <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary);">
            Don't have an account? <a href="register.php" style="font-weight: 600;">Register now</a>
        </p>

        <div
            style="margin-top: 2rem; padding: 1rem; background: #f0fdf4; border: 1px dashed #4ade80; border-radius: var(--radius); font-size: 0.9rem;">
            <strong>Test Credentials (Populated by Seed):</strong><br>
            👨‍🌾 <code>farmer_test</code> / <code>password123</code><br>
            🚚 <code>dist_test</code> / <code>password123</code><br>
            🏪 <code>retail_test</code> / <code>password123</code><br>
            🛠️ <code>admin_test</code> / <code>password123</code>
        </div>
    </div>
</body>

</html>