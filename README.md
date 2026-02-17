# 🌾 CropChain: Blockchain Supply Chain Simulation

A web-based supply chain management system designed to track agricultural produce from farm to retail. This project simulates blockchain functionality using local storage to demonstrate decentralized tracking without gas fees or wallet requirements.

## ✨ Key Features

-   **Role-Based Dashboards:** Specialized views for Farmers, Distributors, Retailers, and Consumers.
-   **📸 Photo Integration:** Farmers can capture and upload real photos of their produce directly from the dashboard.
-   **📲 QR Code System:** automatically generates unique QR codes for each product. Distributors and Retailers can scan these codes to instantly fetch product history and update status.
-   **📍 Location Tracking:** Logs geographic coordinates at each stage of the supply chain (Farm -> Distribution -> Retail).
-   **Admin Control:** An Admin dashboard with toggles to simulate and view the interface from any stakeholder's perspective.
-   **Simulation Mode:** A robust `MockContract` class in JavaScript intercepts blockchain calls, allowing full feature testing without a deployed smart contract.

## 🚀 Getting Started

### Prerequisites
-   **PHP** (7.4 or higher) for the backend API.
-   A modern web browser with JavaScript enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/CropChain.git
    cd CropChain
    ```

2.  **Start the Local Server:**
    Run the built-in PHP server pointing to the `public` directory:
    ```bash
    php -S localhost:8000 -t public
    ```

3.  **Initialize Data:**
    Open your browser and visit:
    [http://localhost:8000/seed.php](http://localhost:8000/seed.php)
    
    *This script populates the database with test users and clears the local storage simulation data for a fresh start.*

4.  **Launch the App:**
    Go to [http://localhost:8000](http://localhost:8000)

## 🔑 Test Credentials

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer_test` | `password123` | Add crops, upload photos, view inventory QR codes. |
| **Distributor** | `dist_test` | `password123` | Scan QRs, update status to "Distribution", update location. |
| **Retailer** | `retail_test` | `password123` | Scan QRs, mark items as "Retail" or "Sold". |
| **Consumer** | `consumer_test` | `password123` | View product history and provenance. |
| **Admin** | `admin` | `admin123` | Access all views via toggle buttons. |

## 🛠️ Technology Stack

-   **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript (Vanilla + Mock Ethers.js)
-   **Backend:** PHP (Native)
-   **Database:** SQLite (Lightweight, file-based)
-   **Libraries:** 
    -   `qrcode.js` (Generation)
    -   `html5-qrcode` (Scanning)
    -   `ethers.js` (Blockchain interaction logic)

## 📂 Project Structure

```
CropChain/
├── database/
│   └── database.sqlite    # SQLite database file (User data & Logs)
├── public/
│   ├── api/               # PHP Endpoints (Login, Upload, Logging)
│   ├── css/               # Styling
│   ├── js/                # Application Logic (MockContract & UI)
│   ├── uploads/           # Stored images
│   ├── index.php          # Landing Page
│   ├── dashboard.php      # Main App Interface
│   └── ...
└── README.md
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
