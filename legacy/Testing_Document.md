# Testing Document
**Project:** CropChain - Blockchain Supply Chain Simulation
**Phase:** System Testing and Validation

## 1. Overview
This document outlines the testing strategy, test cases, and validation results for the CropChain application. The application was tested using a combination of **Manual Testing** for the Graphical User Interface (GUI) and user flows, and **Automated Testing** for backend database integrity and API connections.

## 2. Automated Testing
An automated test suite was developed using PHP to validate the backend connections and core logic without requiring manual intervention.

### 2.1 How to Run Automated Tests
1. Open your terminal.
2. Navigate to the root directory of the `CropChain` project.
3. Run the following command:
   ```bash
   php tests/test_backend.php
   ```
4. The script will connect to the MySQL database and run a series of assertions, outputting `[PASS]` or `[FAIL]` for each test.

### 2.2 Automated Test Cases & Results

| Test ID | Description | Expected Outcome | Actual Result |
| :--- | :--- | :--- | :--- |
| **AT-01** | Database Connection | PDO successfully connects to MySQL without exceptions. | **PASS** |
| **AT-02** | Users Table Exists | Querying the `users` table returns a valid result set. | **PASS** |
| **AT-03** | Crop_logs Table Exists | Querying the `crop_logs` table returns a valid result set. | **PASS** |
| **AT-04** | Fetch Test User | The system can retrieve the user `farmer_test` and verify their role is `Farmer`. | **PASS** |
| **AT-05** | Directory API Query | The system can fetch multiple rows for the User Directory feature. | **PASS** |

---

## 3. Manual Testing
Manual testing was conducted to validate the frontend behavior, user interactions, and the simulated blockchain tracking logic. 

### 3.1 Test Environment
- **Browser**: Google Chrome / Safari / Firefox
- **Local Server**: PHP Built-in Server (`localhost:8000`)
- **Database**: MySQL Local Instance (`cropchain`)

### 3.2 Manual Test Cases & Execution

#### **Module: Authentication**
| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-01** | Successful Login | 1. Navigate to `/login.php`<br>2. Enter `farmer_test` and `password123`<br>3. Click Login | Redirects to `/dashboard.php` with Farmer UI loaded. | **PASS** |
| **MT-02** | Invalid Login | 1. Navigate to `/login.php`<br>2. Enter `wrong_user` and `wrong_pass`<br>3. Click Login | Displays "Invalid credentials" error message. | **PASS** |

#### **Module: Farmer Dashboard**
| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-03** | Log New Crop | 1. Login as Farmer<br>2. Fill out "Add New Crop" form<br>3. Click Submit | Crop is added to local simulation, QR code is generated, log saved to DB. | **PASS** |
| **MT-04** | Photo Upload | 1. In Add Crop form, select an image file<br>2. Submit form | Image is successfully saved in `/uploads/` and linked to the product ID. | **PASS** |

#### **Module: Distributor / Retailer Scanning**
| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-05** | Scan QR Code | 1. Login as Distributor<br>2. Click "Scan QR" on a generated code | Product details modal pops up displaying the product history. | **PASS** |
| **MT-06** | Update Status | 1. From scanned modal, click "Update Status to Distribution" | Blockchain history is appended, and new location coords are saved. | **PASS** |

#### **Module: Marketplace / Directory**
| Test ID | Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-07** | View Marketplace | 1. Navigate to `/marketplace.php` | Displays all logged crops pulled securely from the MySQL backend. | **PASS** |
| **MT-08** | View Directory | 1. Navigate to `/directory.php` | Displays a table of all registered users grouped by their roles. | **PASS** |

## 4. Conclusion
Both the frontend interface and backend MySQL database integration operate as expected. The automated test script confirms backend stability, while manual flow testing guarantees that the SDLC requirements for the blockchain simulation logic are met. The application is validated and ready for deployment.
