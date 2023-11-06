// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Strings.sol";

contract supply {

    address payable public admin;

    constructor() {
        admin = payable(msg.sender);
    }

    struct prod {
        uint256 ID;
        string name;
        string desc;
        uint256 price;
        address manufacturer;
        address supplier;
        bool isSupplier;
        address retailer;
        bool isRetailer;
        // address currentlyHeldBy;
        bool isSold;
    }

    struct man {
        string name;
        // mapping(uint256 => prod) prodList;
        uint256 numOfProdsMade;
        bool isMan;
    }

    mapping(address => man) public mapMan;
    mapping(uint256 => prod) public prodList;
    uint256 public prodCount=0;

    function createMan(string calldata name) public {
        require(!mapMan[msg.sender].isMan, "Manufacturer already exists!");
        man storage m = mapMan[msg.sender];
        m.name = name;
        m.numOfProdsMade = 0;
        m.isMan = true;

        // p.prodList[0] = prod("NoID", "placeholder", "noDesc", 0);
        // mapMan[msg.sender] = man(name, prod(), 0, true);
    }

    function addProd(
        string calldata name,
        string calldata desc,
        uint256 price
    ) public {
        require(mapMan[msg.sender].isMan, "User is not a manufacturer");
        uint256 prodID = mapMan[msg.sender].numOfProdsMade;
        // string(abi.encodePacked(msg.sender))
        uint256 ID = prodID;
        // mapMan[msg.sender].prodList[prodID] = (prod(ID, name, desc, price));
        prodList[prodCount] = prod(ID, name, desc, price, msg.sender, admin, false, admin, false, false);
        prodCount++;
        mapMan[msg.sender].numOfProdsMade++;
    }

    struct supplier {
        address addr;
        string name;
        uint256 percentCharged;
        bool isSup;
    }

    uint256 public supplyCount = 0;
    mapping(address => supplier) public mapSup;
    mapping(uint256 => supplier) public supList;

    function createSupplier(string calldata name, uint256 percentCharged) public {
        require(!mapSup[msg.sender].isSup, "Supplier already exists!");
        supplier memory s = supplier(msg.sender, name, percentCharged, true);
        mapSup[msg.sender]=s;
        supList[supplyCount]=s;
        supplyCount++;
    }

    struct retailer{
        string name;
        string desc;
        mapping(uint256 => prod) prodList;
        uint256 heldCount;
        bool isRet;
    }

    mapping(address => retailer) public mapRet;
    mapping(uint256 => prod) public isWithRetailer;
    uint256 public retailedProdCount = 0;

    function createRetailer(string calldata name, string calldata desc) public {
        require(!mapRet[msg.sender].isRet, "Retailer already exists!");
        retailer storage p = mapRet[msg.sender];
        p.name = name;
        p.desc = desc;
        p.heldCount = 1;
        p.isRet = true;

        p.prodList[0] = prod(0, "DUM", "DUM", 0, admin, admin, false, admin, false, false);
    }

    function retBuyProd(uint256 prodID, uint256 supplyID, uint256 retailPrice) public payable {
        require(!prodList[prodID].isSold, "Product already sold to a customer!");
        require(mapRet[msg.sender].isRet, "Only retialer can perform this action!");

        prod storage product = prodList[prodID];
        supplier storage sup = supList[supplyID];

        uint256 priceForRetailer = product.price + (product.price * sup.percentCharged/100);
        require(priceForRetailer <= msg.value, "Insufficient wallet balance!");
        payable(product.manufacturer).transfer(product.price);
        payable(sup.addr).transfer((product.price * sup.percentCharged/100));
        product.supplier=sup.addr;
        product.isSupplier=true;
        product.retailer=msg.sender;
        product.isRetailer=true;
        // product.currentltyHeldBy = product.retailer;
        product.price=retailPrice;
        isWithRetailer[retailedProdCount] = product;
        retailedProdCount++;
    }

    function buy(uint prodID) public payable {
        prod storage product = isWithRetailer[prodID];
        require(!prodList[prodID].isSold, "Product already sold to a customer!");
        require(product.price <= msg.value, "Insufficient wallet balance!");
        payable(product.retailer).transfer(product.price);
        product.isSold = true;
    }

}
