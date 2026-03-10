<?php
// public/api/get_users.php
header('Content-Type: application/json');
require_once '../db.php';

try {
    $role = $_GET['role'] ?? 'All';
    $sortBy = $_GET['sort_by'] ?? 'name'; // name, role, location

    $query = "SELECT id, username, role, email, phone, location, wallet_address FROM users";
    $params = [];

    // Filter by Role
    if ($role !== 'All') {
        $query .= " WHERE role = ?";
        $params[] = $role;
    }

    // Sort
    switch ($sortBy) {
        case 'role':
            $query .= " ORDER BY role ASC";
            break;
        case 'location':
            $query .= " ORDER BY location ASC";
            break;
        case 'name':
        default:
            $query .= " ORDER BY username ASC";
            break;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'users' => $users]);

}
catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>