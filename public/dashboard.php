<?php
// public/dashboard.php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

require_once 'db.php';

$role = $_SESSION['role'];
$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - CropChain</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
    <script src="js/app.js?v=<?php echo time(); ?>" defer></script>
</head>

<body>
    <div class="nav">
        <div><strong>🌿 CropChain</strong> <span
                style="font-weight: 400; color: var(--text-secondary); margin-left: 10px;">|
                <?php echo htmlspecialchars($username); ?> (
                <?php echo htmlspecialchars($role); ?>)
            </span></div>
        <div>
            <a href="marketplace.php">Marketplace</a>
            <a href="directory.php">Directory</a>
            <a href="logout.php">Logout</a>
        </div>
    </div>

    <div class="dashboard-container container">
        <div id="statusMessage" class="error"
            style="color: var(--primary-color); background: #e6fffa; border-color: #b2f5ea; display: none;"></div>

        <!-- Wallet Section -->
        <div id="walletSection"
            style="margin-bottom: 2rem; padding: 1.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0;">🔗 Blockchain Status</h4>
                    <p style="margin: 0; color: var(--text-secondary);"><strong>Account:</strong> <span
                            id="walletStatus">Not Connected</span></p>
                </div>
                <button id="connectBtn" onclick="init()" style="width: auto; margin: 0;">Connect Wallet</button>
            </div>

            <div id="registrationSection"
                style="display:none; margin-top: 1.5rem; border-top: 1px solid #bbf7d0; padding-top: 1rem;">
                <p style="margin-bottom: 1rem;">You need to register your role on the blockchain to interact.</p>
                <button onclick="registerOnChain()">Register as
                    <?php echo $role; ?>
                </button>
            </div>
        </div>

        <?php if ($role === 'Admin'): ?>
        <!-- Admin View Toggles -->
        <div class="admin-toggle">
            <button class="toggle-btn active" onclick="switchView('farmer')">Farmer View</button>
            <button class="toggle-btn" onclick="switchView('distributor')">Distributor View</button>
            <button class="toggle-btn" onclick="switchView('retailer')">Retailer View</button>
        </div>
        <?php
endif; ?>

        <!-- FARMER VIEW -->
        <div id="farmerView"
            class="view-section <?php echo ($role === 'Farmer' || $role === 'Admin') ? 'active' : ''; ?>">
            <h3>🌱 Log Crop Produce</h3>
            <form id="addCropForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Crop Name</label>
                        <input type="text" id="cropName" placeholder="e.g. Wheat" required>
                    </div>
                    <div class="form-group">
                        <label>Origin</label>
                        <input type="text" id="origin" placeholder="e.g. Punjab Farm" required>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label>Quantity (kg)</label>
                        <input type="number" id="quantity" required>
                    </div>
                    <div class="form-group">
                        <label>Quality / Grade</label>
                        <input type="text" id="quality" placeholder="e.g. Grade A" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Expected Price (per kg in ₹ Rupees)</label>
                    <input type="number" step="0.01" id="price" required>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="location" placeholder="Waiting for location..." readonly required>
                        <button type="button" onclick="getLocation()"
                            style="width: auto; margin: 0; white-space: nowrap;">📍 Get Loc</button>
                    </div>
                </div>
        </div>

        <div class="form-group">
            <label>Product Photo</label>
            <input type="file" id="cropImage" accept="image/*" capture="environment">
            <div
                style="background: #f0f9ff; padding: 10px; border-radius: 6px; border: 1px solid #bae6fd; margin-top: 5px;">
                <small style="color: #0c4a6e;">
                    📸 <strong>Mobile:</strong> Opens Camera<br>
                    💻 <strong>Desktop:</strong> Opens File Picker
                </small>
            </div>
            <div id="imagePreview" style="margin-top: 10px; max-width: 100%; display:none;">
                <img src="" style="max-height: 200px; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
            </div>
        </div>

        <button type="submit">Submit to Blockchain</button>
        </form>

        <hr style="margin: 2rem 0; border: 0; border-top: 1px solid var(--border-color);">
        <h3>📦 My Inventory</h3>
        <div id="farmerInventory">Loading inventory...</div>
    </div>

    <!-- DISTRIBUTOR / RETAILER VIEW -->
    <div id="distributorView"
        class="view-section <?php echo ($role === 'Distributor' || $role === 'Retailer') ? 'active' : ''; ?>">
        <h3>🔍 Track & Update Product</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Scan a product ID to update its status in
            the supply chain.</p>

        <form id="updateProductForm">
            <div class="form-group" style="display: flex; gap: 0.5rem;">
                <input type="number" id="productId" placeholder="Enter Product ID" required>
                <button type="button" onclick="fetchProductDetails()" style="width: auto; margin: 0;">Search</button>
            </div>

            <div id="productDetails"
                style="display:none; margin-top: 1.5rem; background: #f9fafb; padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border-color);">
                <h4 style="margin-bottom: 1rem;">Product Details</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div><small>Name</small><br><strong id="pName">-</strong></div>
                    <div><small>Stage</small><br><strong id="pStage">-</strong></div>
                    <div><small>Owner</small><br><strong id="pOwner">-</strong></div>
                </div>
                <div id="pData" style="text-align: center; margin-bottom: 1.5rem;">
                    <img id="pImage" src=""
                        style="max-width: 100%; max-height: 200px; border-radius: var(--radius); display: none;">
                </div>

                <hr style="margin: 1rem 0; border: 0; border-top: 1px dashed var(--border-color);">

                <h4 style="margin-bottom: 1rem;">Update Status</h4>
                <div class="form-group">
                    <label>New Owner Address</label>
                    <input type="text" id="newOwner" placeholder="0x...">
                </div>
                <div class="form-group">
                    <label>New Stage</label>
                    <select id="newStage">
                        <option value="1">Distribution (1)</option>
                        <option value="2">Retail (2)</option>
                        <option value="3">Sold (3)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Current Location</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="updateLocation" placeholder="Fetching..." readonly>
                        <button type="button" onclick="getUpdateLocation()" style="width: auto; margin: 0;">📍 Get
                            Loc</button>
                    </div>
                </div>
                <button type="submit">Update Product Status</button>
            </div>
        </form>
    </div>

    <!-- Retailer View (For Toggle Compatibility - currently same update logic) -->
    <div id="retailerView" class="view-section">
        <!-- Same as distributor for now, but Admin can toggle to it -->
        <h3>🛒 Retailer Interface</h3>
        <p>Use the Tracker above to mark items as "Retail" or "Sold".</p>
    </div>

    </div>

    <script>
        function switchView(viewName) {
            // Hide all
            document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.toggle-btn').forEach(el => el.classList.remove('active'));

            if (viewName === 'farmer') {
                document.getElementById('farmerView').classList.add('active');
                document.querySelectorAll('.toggle-btn')[0].classList.add('active');
            } else if (viewName === 'distributor') {
                document.getElementById('distributorView').classList.add('active');
                document.querySelectorAll('.toggle-btn')[1].classList.add('active');
            } else if (viewName === 'retailer') {
                // Retailer shares the same view logic as Distributor for now
                document.getElementById('distributorView').classList.add('active');
                document.querySelectorAll('.toggle-btn')[2].classList.add('active');


    </script>
</body>

</html>