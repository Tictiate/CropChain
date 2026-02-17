// public/js/app.js

// --- SIMULATION MODE ---
const IS_SIMULATION = true;

// Mock Data Keys
const STORAGE_KEYS = {
    PRODUCTS: 'cc_products',
    USERS: 'cc_users',
    COUNT: 'cc_product_count'
};

// Mock Contract Class
class MockContract {
    constructor() {
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            // Seed Mock Products for Simulation if empty
            const initialProducts = {};
            // Use 6-digit IDs for better UX
            const seeds = [
                { id: "890123", name: 'Organic Wheat', origin: 'Punjab, India', qty: '500', qual: 'Grade A', price: '30.50', owner: 'farmer_test', stage: 0 },
                { id: "890124", name: 'Basmati Rice', origin: 'Haryana, India', qty: '200', qual: 'Premium', price: '85.00', owner: 'farmer_test', stage: 0 },
                { id: "890125", name: 'Tomatoes', origin: 'Nashik, Maharashtra', qty: '100', qual: 'Red Fresh', price: '40.00', owner: 'farmer_test', stage: 0 },
                { id: "890126", name: 'Cotton', origin: 'Gujarat, India', qty: '300', qual: 'Long Staple', price: '120.00', owner: 'farmer_test', stage: 0 },
                { id: "890127", name: 'Potatoes', origin: 'Agra, UP', qty: '150', qual: 'Large', price: '25.00', owner: 'farmer_test', stage: 0 }
            ];

            seeds.forEach((s) => {
                initialProducts[s.id] = {
                    id: s.id,
                    name: s.name, origin: s.origin,
                    quantity: s.qty, quality: s.qual,
                    expectedPrice: s.price,
                    currentOwner: "0xTestMock",
                    stage: s.stage,
                    locations: [s.origin],
                    timestamps: [Date.now()]
                };
            });

            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
            localStorage.setItem(STORAGE_KEYS.COUNT, "5");
        }

        if (!localStorage.getItem(STORAGE_KEYS.USERS)) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify({}));
    }

    async _simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, 800));
    }

    _getData(key) {
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    _setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    async registerUser(name, roleInt) {
        await this._simulateDelay();
        const users = this._getData(STORAGE_KEYS.USERS);
        // Map userAccount to role
        users[userAccount] = { name, role: roleInt, isRegistered: true };
        this._setData(STORAGE_KEYS.USERS, users);
        return { wait: async () => { } };
    }

    async users(addr) {
        const users = this._getData(STORAGE_KEYS.USERS);
        return users[addr] || { name: '', role: 0, isRegistered: false };
    }

    async addProduct(name, origin, quantity, quality, price, location, imageUrl) {
        await this._simulateDelay();
        const products = this._getData(STORAGE_KEYS.PRODUCTS);

        // Generate 6-digit ID
        let newId;
        do {
            newId = Math.floor(100000 + Math.random() * 900000).toString();
        } while (products[newId]);

        products[newId] = {
            id: newId,
            name, origin, quantity, quality, expectedPrice: price, location,
            imageUrl: imageUrl || '', // Store image URL
            currentOwner: userAccount,
            stage: 0, // Production
            locations: [location],
            timestamps: [Date.now()]
        };

        this._setData(STORAGE_KEYS.PRODUCTS, products);

        let count = parseInt(localStorage.getItem(STORAGE_KEYS.COUNT) || "0");
        localStorage.setItem(STORAGE_KEYS.COUNT, (count + 1).toString());

        return {
            wait: async () => { },
            // Simulation specific: return the ID so the UI can log it correctly
            mockId: newId
        };
    }

    async getProduct(id) {
        const products = this._getData(STORAGE_KEYS.PRODUCTS);
        if (!products[id]) throw new Error("Product not found");
        return products[id];
    }

    async getProductsByOwner(owner) {
        const products = this._getData(STORAGE_KEYS.PRODUCTS);

        // Return IDs of products where currentOwner == owner OR (if Admin/Distributor... logic?)
        // In local sim, also return the '0xTestMock' items so the farmer can see them if they used test credentials
        // Actually, 'farmer_test' is just a username, the wallet is random. 
        // But for simulation ease, if the user matches 'farmer_test', we let them see the seeded items.

        // We need to fetch the current username from the page if possible, or just rely on wallet.
        // In this simple sim, we return items owned by the userAccount OR items owned by "0xTestMock" (for demo purposes)

        return Object.values(products)
            .filter(p => p.currentOwner.toLowerCase() === owner.toLowerCase() || p.currentOwner === '0xTestMock')
            .map(p => p.id);
    }

    async updateProductStatus(id, newOwner, newStage, location) {
        await this._simulateDelay();
        const products = this._getData(STORAGE_KEYS.PRODUCTS);
        if (!products[id]) throw new Error("Product not found");

        const p = products[id];
        // If newOwner is provided, update it. Otherwise keep current.
        if (newOwner && newOwner.trim() !== "") p.currentOwner = newOwner;

        p.stage = newStage;
        p.locations.push(location);
        p.timestamps.push(Date.now());

        this._setData(STORAGE_KEYS.PRODUCTS, products);
        return { wait: async () => { } };
    }

    async productCount() {
        return localStorage.getItem(STORAGE_KEYS.COUNT) || "0";
    }
}

// Global Variables
let provider, signer, contract, userAccount;
const contractAddress = "0xSIMULATION";

async function init() {
    console.log("Initializing App... Simulation Mode:", IS_SIMULATION);

    // Check if we have an account in localStorage (simulated login)
    userAccount = "0x" + (window.ethereum?.selectedAddress || "User" + Math.floor(Math.random() * 1000));

    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            userAccount = await signer.getAddress();
        } catch (e) { console.log("MetaMask not connected, using mock account"); }
    }

    if (!user.isRegistered) {
        document.getElementById('registrationSection').style.display = 'block';
    } else {
        // If registered and in sim, hide the big wallet block to clean up UI
        const walletSec = document.getElementById('walletSection');
        if (walletSec) walletSec.style.display = 'none';
    }
}

// Load Inventory if on farmer page
if (document.getElementById('farmerInventory')) loadInventory();
}

// Register Logic
async function registerOnChain() {
    try {
        const response = await fetch('api/get_profile.php');
        const data = await response.json();

        const roleMap = {
            'Admin': 0, 'Farmer': 1, 'Distributor': 2, 'Retailer': 3, 'Consumer': 4
        };

        const roleInt = roleMap[data.role];

        const tx = await contract.registerUser(data.username, roleInt);
        document.getElementById('statusMessage').style.display = 'block';
        document.getElementById('statusMessage').innerText = "Registration txn sent...";
        await tx.wait();
        document.getElementById('statusMessage').innerText = "Registered successfully on Blockchain!";
        document.getElementById('registrationSection').style.display = 'none';

        setTimeout(() => location.reload(), 2000);

    } catch (err) {
        console.error(err);
        document.getElementById('statusMessage').style.display = 'block';
        document.getElementById('statusMessage').innerText = "Error registering: " + err.message;
    }
}

// Geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const loc = position.coords.latitude + ", " + position.coords.longitude;
    if (document.getElementById('location')) document.getElementById('location').value = loc;
    if (document.getElementById('updateLocation')) document.getElementById('updateLocation').value = loc;
}

function getUpdateLocation() {
    getLocation();
}

function showError(error) {
    alert("Geolocation error: " + error.message);
}

// Add Product
const addProductForm = document.getElementById('addCropForm');
if (addProductForm) {
    // Image Preview logic
    document.getElementById('cropImage').addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.querySelector('#imagePreview img');
                img.src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('cropName').value;
        const origin = document.getElementById('origin').value;
        const quantity = document.getElementById('quantity').value;
        const quality = document.getElementById('quality').value;
        const price = document.getElementById('price').value;
        const location = document.getElementById('location').value;
        const imageFile = document.getElementById('cropImage').files[0];

        let imageUrl = "";

        try {
            document.getElementById('statusMessage').style.display = 'block';
            document.getElementById('statusMessage').innerText = "Processing...";

            // Upload Image first if exists
            if (imageFile) {
                document.getElementById('statusMessage').innerText = "Uploading Image...";
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('api/upload_image.php', {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();

                if (uploadData.success) {
                    imageUrl = uploadData.url;
                } else {
                    throw new Error("Image Upload Failed: " + uploadData.message);
                }
            }

            const tx = await contract.addProduct(name, origin, quantity, quality, price, location, imageUrl);
            document.getElementById('statusMessage').innerText = "Transaction sent! Waiting for confirmation...";

            await tx.wait();
            document.getElementById('statusMessage').innerText = "Product Added Successfully!";

            // Sync with backend (optional for market display)
            // Use tx.mockId from our simulation to ensure DB and LocalStorage match
            const pId = tx.mockId || (await contract.productCount()).toString();

            await fetch('api/log_crop.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: pId,
                    name, quality, quantity, expected_price: price, location, currency: 'INR'
                })
            });

            loadInventory();

            // Clear Form
            e.target.reset();
            document.getElementById('imagePreview').style.display = 'none';
            document.querySelector('#imagePreview img').src = "";

        } catch (err) {
            console.error(err);
            document.getElementById('statusMessage').style.display = 'block';
            document.getElementById('statusMessage').innerText = "Error: " + err.message;
        }
    });
}

// Load Inventory
async function loadInventory() {
    const list = document.getElementById('farmerInventory');
    if (!list) return;
    list.innerHTML = "Loading...";

    try {
        const productIds = await contract.getProductsByOwner(userAccount);
        list.innerHTML = "";

        if (productIds.length === 0) {
            list.innerHTML = "No products found.";
            return;
        }

        const ul = document.createElement('ul');
        for (let i = 0; i < productIds.length; i++) {
            const id = productIds[i];
            const p = await contract.getProduct(id);
            const stages = ["Production", "Distribution", "Retail", "Sold"];
            const stageName = stages[p.stage] || "Unknown";

            const li = document.createElement('li');

            // Image Tag
            let imgTag = p.imageUrl ? `<img src="${p.imageUrl}" style="max-height:80px; border-radius:4px; margin-top:5px; display:block;">` : '';

            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div>
                        <strong>${p.name}</strong> (ID: ${id})<br>
                        Status: <span style="background:#def7ec; color:#03543f; padding:2px 6px; border-radius:4px;">${stageName}</span><br>
                        Quality: ${p.quality}<br>
                        Price: ₹${p.expectedPrice}<br>
                        Current Loc: ${p.locations[p.locations.length - 1]}
                        ${imgTag}
                    </div>
                    <div id="qr-${id}" style="margin-left:10px;"></div>
                </div>
                <hr>`;
            ul.appendChild(li);

            // Generate QR Code
            setTimeout(() => {
                const qrContainer = document.getElementById(`qr-${id}`);
                if (qrContainer && typeof QRCode !== 'undefined') {
                    qrContainer.innerHTML = ""; // Clear previous if any
                    new QRCode(qrContainer, {
                        text: id.toString(),
                        width: 80,
                        height: 80,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                } else if (!qrContainer) {
                    console.error("QR Container not found for ID:", id);
                } else {
                    console.error("QRCode library not loaded.");
                    qrContainer.innerHTML = "QR Error";
                }
            }, 300); // Increased timeout slightly to ensure DOM render
        }
        list.appendChild(ul);
    } catch (err) {
        console.error(err);
        list.innerHTML = "Error loading inventory.";
    }
}

// Search Product
async function fetchProductDetails() {
    const id = document.getElementById('productId').value;
    if (!id) return alert("Please enter an ID");

    try {
        const p = await contract.getProduct(id);
        document.getElementById('productDetails').style.display = 'block';

        const stages = ["Production", "Distribution", "Retail", "Sold"];

        document.getElementById('pName').innerText = p.name;
        document.getElementById('pStage').innerText = stages[p.stage];
        // Shorten owner address for display
        const shortOwner = p.currentOwner.length > 10 ? p.currentOwner.substring(0, 8) + "..." : p.currentOwner;
        document.getElementById('pOwner').innerText = shortOwner;

        // Show Image
        const imgEl = document.getElementById('pImage');
        if (p.imageUrl) {
            imgEl.src = p.imageUrl;
            imgEl.style.display = 'inline-block';
        } else {
            imgEl.style.display = 'none';
        }
    } catch (err) {
        alert("Product not found. (Check ID or Simulation Data)");
        console.error(err);
    }
}

// Update Product
const updateForm = document.getElementById('updateProductForm');
if (updateForm) {
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('productId').value;
        const newOwner = document.getElementById('newOwner').value;
        const newStage = document.getElementById('newStage').value;
        const location = document.getElementById('updateLocation').value;

        try {
            const tx = await contract.updateProductStatus(id, newOwner, newStage, location);
            document.getElementById('statusMessage').style.display = 'block';
            document.getElementById('statusMessage').innerText = "Update sent! Waiting...";
            await tx.wait();
            document.getElementById('statusMessage').innerText = "Updated Successfully!";
            fetchProductDetails(); // refresh
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    });
}

// QR Scanner Logic
let html5QrcodeScanner;

function toggleScanner() {
    const reader = document.getElementById('reader');
    if (reader.style.display === 'none') {
        reader.style.display = 'block';
        startScanner();
        document.getElementById('scanBtn').innerText = "❌ Stop Scanner";
    } else {
        stopScanner();
    }
}

function startScanner() {
    html5QrcodeScanner = new Html5Qrcode("reader");
    html5QrcodeScanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
            // Handle Success
            console.log(`Code matched = ${decodedText}`, decodedResult);
            document.getElementById('productId').value = decodedText;
            stopScanner();
            fetchProductDetails();
        },
        (errorMessage) => {
            // Check for parse errors (ignore for now)
        }
    ).catch(err => {
        console.error("Unable to start scanning.", err);
    });
}

function stopScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop().then(() => {
            document.getElementById('reader').style.display = 'none';
            document.getElementById('scanBtn').innerText = "📸 Scan QR Code";
        }).catch(err => {
            console.error("Failed to stop.", err);
        });
    } else {
        document.getElementById('reader').style.display = 'none';
        document.getElementById('scanBtn').innerText = "📸 Scan QR Code";
    }
}

window.addEventListener('load', init);
