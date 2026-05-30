<?php
// public/directory.php
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
    <title>User Directory - CropChain</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/app.js?v=<?php echo time(); ?>" defer></script>
</head>

<body>
    <div class="nav">
        <div><strong>🌿 CropChain</strong> <span
                style="font-weight: 400; color: var(--text-secondary); margin-left: 10px;">| Directory</span></div>
        <div>
            <a href="dashboard.php">Dashboard</a>
            <a href="marketplace.php">Marketplace</a>
            <a href="logout.php">Logout</a>
        </div>
    </div>

    <div class="container" style="max-width: 1000px; margin-top: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>👥 User Directory</h2>

            <div style="display: flex; gap: 1rem;">
                <!-- Filter by Role -->
                <select id="roleFilter" onchange="loadUsers()"
                    style="padding: 0.5rem; border-radius: var(--radius); border: 1px solid var(--border-color);">
                    <option value="All">All Roles</option>
                    <option value="Farmer">Farmers</option>
                    <option value="Distributor">Distributors</option>
                    <option value="Retailer">Retailers</option>
                </select>

                <!-- Sort By -->
                <select id="sortBy" onchange="loadUsers()"
                    style="padding: 0.5rem; border-radius: var(--radius); border: 1px solid var(--border-color);">
                    <option value="name">Sort by Name</option>
                    <option value="role">Sort by Role</option>
                    <option value="location">Sort by Location</option>
                </select>
            </div>
        </div>

        <div id="userGrid"
            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
            <!-- Users will be loaded here -->
            <p>Loading users...</p>
        </div>
    </div>

    <!-- User Details Modal -->
    <div id="userModal" class="modal"
        style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); backdrop-filter: blur(4px);">
        <div class="modal-content"
            style="background-color: #fff; margin: 10% auto; padding: 2rem; border-radius: var(--radius); width: 90%; max-width: 500px; box-shadow: var(--shadow-lg); position: relative;">
            <span class="close" onclick="closeUserModal()"
                style="position: absolute; top: 1rem; right: 1rem; font-size: 1.5rem; cursor: pointer;">&times;</span>
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div
                    style="width: 80px; height: 80px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem;">
                    <span id="modalInitials"></span>
                </div>
                <h2 id="modalName" style="margin: 0;"></h2>
                <span id="modalRole"
                    style="background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem;"></span>
            </div>

            <div style="display: grid; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">📍</span>
                    <div>
                        <small style="color: var(--text-secondary);">Location</small>
                        <div id="modalLocation"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">📧</span>
                    <div>
                        <small style="color: var(--text-secondary);">Email</small>
                        <div id="modalEmail"></div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">📞</span>
                    <div>
                        <small style="color: var(--text-secondary);">Phone</small>
                        <div id="modalPhone"></div>
                    </div>
                </div>
                <div style="background: #f9fafb; padding: 1rem; border-radius: var(--radius); margin-top: 1rem;">
                    <small style="color: var(--text-secondary);">Wallet Address</small>
                    <div id="modalWallet"
                        style="font-family: monospace; word-break: break-all; color: var(--text-primary);"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', loadUsers);

        async function loadUsers() {
            const role = document.getElementById('roleFilter').value;
            const sortBy = document.getElementById('sortBy').value;
            const grid = document.getElementById('userGrid');

            grid.innerHTML = '<p>Loading...</p>';

            try {
                const response = await fetch(`api/get_users.php?role=${role}&sort_by=${sortBy}`);
                const data = await response.json();

                if (data.success) {
                    grid.innerHTML = '';
                    data.users.forEach(user => {
                        const card = document.createElement('div');
                        card.className = 'user-card';
                        card.style = 'background: white; padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border-color); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;';
                        card.onmouseover = () => { card.style.transform = 'translateY(-2px)'; card.style.boxShadow = 'var(--shadow-md)'; };
                        card.onmouseout = () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = 'none'; };
                        card.onclick = () => openUserModal(user);

                        const initials = user.username.substring(0, 2).toUpperCase();

                        card.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <div style="width: 50px; height: 50px; background: var(--secondary-color); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${initials}</div>
                                <div>
                                    <h4 style="margin: 0; color: var(--text-primary);">${user.username}</h4>
                                    <small style="color: var(--text-secondary);">${user.role}</small>
                                </div>
                            </div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                📍 ${user.location || 'Unknown'}
                            </div>
                        `;
                        grid.appendChild(card);
                    });
                }
            } catch (e) {
                console.error(e);
                grid.innerHTML = '<p style="color: red;">Failed to load users.</p>';
            }
        }

        function openUserModal(user) {
            document.getElementById('modalName').innerText = user.username;
            document.getElementById('modalRole').innerText = user.role;
            document.getElementById('modalInitials').innerText = user.username.substring(0, 2).toUpperCase();
            document.getElementById('modalLocation').innerText = user.location || 'N/A';
            document.getElementById('modalEmail').innerText = user.email || 'N/A';
            document.getElementById('modalPhone').innerText = user.phone || 'N/A';
            document.getElementById('modalWallet').innerText = user.wallet_address || 'Not Connected';
            document.getElementById('userModal').style.display = 'block';
        }

        function closeUserModal() {
            document.getElementById('userModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function (event) {
            const modal = document.getElementById('userModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    </script>
</body>

</html>