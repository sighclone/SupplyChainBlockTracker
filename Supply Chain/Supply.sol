// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainManagement {
    address public owner;

    enum Participant {
        Manufacturer,
        Supplier,
        Logistics,
        Customer
    }

    struct Product {
        string name;
        uint256 valueInINR;
        address currentOwner;
        Participant[] participants;
    }

    mapping(uint256 => Product) public products;    // ID
    uint256 public productCounter;

    event ProductCreated(
        uint256 indexed productId,
        string name,
        uint256 valueInINR,
        address currentOwner
    );
    event ProductTransferred(
        uint256 indexed productId,
        uint256 addedValueInINR,
        address previousOwner,
        address newOwner
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action!"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        productCounter = 0;
    }

    function createProduct(string memory name, uint256 quantity) public {
        uint256 productId = productCounter;
        products[productId] = Product(
            name,
            quantity,
            msg.sender,
            new Participant[](0)
        );
        products[productId].participants.push(Participant.Manufacturer);
        emit ProductCreated(productId, name, quantity, msg.sender);
        productCounter++;
    }

    function transferOwnership(uint256 productId, uint256 addedValueInINR, address newOwner) public {
        Product storage product = products[productId];
        require(
            product.currentOwner == msg.sender,
            "Only the current owner can transfer ownership"
        );

        if (msg.sender == owner) {
            product.participants.push(Participant.Supplier);
        } else if (newOwner == owner) {
            product.participants.push(Participant.Logistics);
        } else {
            product.participants.push(Participant.Customer);
        }

        product.currentOwner = newOwner;
        product.valueInINR = product.valueInINR + addedValueInINR;
        emit ProductTransferred(productId, addedValueInINR, msg.sender, newOwner);
    }

    function getProductInfo(uint256 productId) public view returns (string memory, uint256, address, Participant[] memory)    {
        Product storage product = products[productId];
        return (
            product.name,
            product.valueInINR, // limit qty to 1
            product.currentOwner,
            product.participants
        );
    }
}
