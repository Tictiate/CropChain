// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    
    enum Role { Admin, Farmer, Distributor, Retailer, Consumer }
    enum Stage { Production, Distribution, Retail, Sold }

    struct Product {
        uint id;
        string name;
        string origin;
        uint quantity;
        string quality;
        uint expectedPrice;
        address currentOwner;
        Stage stage;
        string[] locationHistory; // Stores location strings (lat,long) at each update
        uint[] timestampHistory;
    }

    struct User {
        string name;
        Role role;
        bool isRegistered;
    }

    mapping(address => User) public users;
    mapping(uint => Product) public products;
    uint public productCount = 0;

    event UserRegistered(address indexed user, string name, Role role);
    event ProductAdded(uint indexed id, string name, address indexed owner);
    event ProductStatusUpdated(uint indexed id, Stage newStage, address indexed newOwner, string location);

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }

    constructor() {
        // Register deployer as Admin (Role 0)
        users[msg.sender] = User("Admin", Role.Admin, true);
    }

    function registerUser(string memory _name, Role _role) public {
        require(!users[msg.sender].isRegistered, "Already registered");
        users[msg.sender] = User(_name, _role, true);
        emit UserRegistered(msg.sender, _name, _role);
    }

    function addProduct(
        string memory _name, 
        string memory _origin, 
        uint _quantity, 
        string memory _quality, 
        uint _expectedPrice, 
        string memory _location
    ) public onlyRegistered onlyRole(Role.Farmer) {
        productCount++;
        string[] memory initLocation = new string[](1);
        initLocation[0] = _location;
        
        uint[] memory initTimestamp = new uint[](1);
        initTimestamp[0] = block.timestamp;

        products[productCount] = Product(
            productCount,
            _name,
            _origin,
            _quantity,
            _quality,
            _expectedPrice,
            msg.sender,
            Stage.Production,
            initLocation,
            initTimestamp
        );

        emit ProductAdded(productCount, _name, msg.sender);
    }

    function updateProductStatus(uint _productId, address _newOwner, Stage _newStage, string memory _location) public onlyRegistered {
        Product storage p = products[_productId];
        require(p.currentOwner == msg.sender, "Not the owner");
        
        // Basic Checks for stage progression
        if (_newStage == Stage.Distribution) {
            require(users[_newOwner].role == Role.Distributor, "Receiver must be Distributor");
        } else if (_newStage == Stage.Retail) {
            require(users[_newOwner].role == Role.Retailer, "Receiver must be Retailer");
        } else if (_newStage == Stage.Sold) {
             require(users[_newOwner].role == Role.Consumer, "Receiver must be Consumer");
        }

        p.currentOwner = _newOwner;
        p.stage = _newStage;
        p.locationHistory.push(_location);
        p.timestampHistory.push(block.timestamp);

        emit ProductStatusUpdated(_productId, _newStage, _newOwner, _location);
    }

    function getProduct(uint _productId) public view returns (
        string memory name, 
        string memory origin, 
        uint quantity, 
        string memory quality, 
        uint expectedPrice, 
        address currentOwner, 
        Stage stage, 
        string[] memory locations, 
        uint[] memory timestamps
    ) {
        Product memory p = products[_productId];
        return (p.name, p.origin, p.quantity, p.quality, p.expectedPrice, p.currentOwner, p.stage, p.locationHistory, p.timestampHistory);
    }

    function getProductsByOwner(address _owner) public view returns (uint[] memory) {
        uint counter = 0;
        for (uint i = 1; i <= productCount; i++) {
            if (products[i].currentOwner == _owner) {
                counter++;
            }
        }
        
        uint[] memory result = new uint[](counter);
        uint index = 0;
        for (uint i = 1; i <= productCount; i++) {
            if (products[i].currentOwner == _owner) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }
}
