// // import Web3 from 'web3';

// window.addEventListener('load', async () => {
//     // Wait for loading completion to avoid race conditions with web3 injection timing.
//      if (window.ethereum) {
//        const web3 = new Web3(window.ethereum);
//        try {
//          // Request account access if needed
//          await window.ethereum.enable();
//          // Accounts now exposed
//          return web3;
//        } catch (error) {
//          console.error(error);
//        }
//      }
//      // Legacy dapp browsers...
//      else if (window.web3) {
//        // Use MetaMask/Mist's provider.
//        const web3 = window.web3;
//        console.log('Injected web3 detected.');
//        return web3;
//      }
//      // Fallback to localhost; use dev console port by default...
//      else {
//        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
//        const web3 = new Web3(provider);
//        console.log('No web3 instance injected, using Local web3.');
//        return web3;
//      }
//    });

// // const web3 = new Web3('HTTP://127.0.0.1:7545');
// web3.eth.getBlock('latest').then(console.log);

await window.ethereum.request({
    "method": "wallet_requestPermissions",
    "params": [
        {
            "eth_accounts": {},
        },
    ]
});

const ChainId = await window.ethereum.request({ method: 'eth_chainId' });
const uAccs = await window.ethereum.request({ method: 'eth_accounts' });
const blockNum = await window.ethereum.request({ method: 'eth_blockNumber' });

var chainID = document.getElementById("chainID");
var accounts = document.getElementById("userAcc");
var currentBlock = document.getElementById("currentBlock");

chainID.innerHTML += ChainId;
accounts.innerText += uAccs;
console.log(uAccs);
currentBlock.innerHTML += blockNum;

console.log("DOM Success");

window.ethereum.on('chainChanged', handleChainChanged);
function handleChainChanged(chainId) {
    // We recommend reloading the page, unless you must do otherwise.
    window.location.reload();
}

const abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            }
        ],
        "name": "createMan",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "desc",
                "type": "string"
            },
            {
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "addProd",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "percentCharged",
                "type": "uint256"
            }
        ],
        "name": "createSupplier",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "desc",
                "type": "string"
            }
        ],
        "name": "createRetailer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "prodID",
                "type": "uint256"
            },
            {
                "name": "supplyID",
                "type": "uint256"
            },
            {
                "name": "retailPrice",
                "type": "uint256"
            }
        ],
        "name": "retBuyProd",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "prodID",
                "type": "uint256"
            }
        ],
        "name": "buy",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAllProducts",
        "outputs": [
            {
                "type": "prod[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAllSuppliers",
        "outputs": [
            {
                "type": "supplier[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]


const contractAddress = '0xe235c2165F9E2EB38e9e71Ea1e14D0C06Bd0BCa8';
const fromAddress = await window.ethereum.request({ method: 'eth_accounts' });
const methodName = 'createMan';
let manName = document.getElementById('manu').value;
// let manName = "TEST";
console.log(manName.toString());
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

// CREATE MANUFACTURER
document.getElementById('createManBtn').addEventListener('click', async () => {
    console.log("Pressed");
    try {
        const tx = await contract[methodName](manName);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
    } catch (error) {
        console.error("Error:", error);
    }
});

//ADD A PRODUCT ONTO NETWORK
document.getElementById('addProdBtn').addEventListener('click', async () => {
    console.log("Pressed");
    try {
        // Get the product details from the input fields
        const prodName = document.getElementById('prodName').value;
        const prodDesc = document.getElementById('prodDesc').value;
        const prodPrice = document.getElementById('prodPrice').value;

        // Convert product price to a BigNumber for transaction
        const priceBN = ethers.utils.parseUnits(prodPrice, 'ether');

        // Create a transaction to invoke the 'addProd' function
        const tx = await contract.addProd(prodName, prodDesc, priceBN);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Log a message upon successful transaction confirmation
        console.log("Transaction confirmed");
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error:", error);
    }
});

// SHOW LIST OF PRODUCTS
document.getElementById('prodListBtn').addEventListener('click', async () => {
    console.log("Fetching products...");

    // Call the contract's `getAllProducts` function
    const products = await contract.getAllProducts();

    // Clear the existing product list
    document.getElementById('prodList').innerHTML = '';

    // Create list items for each product
    for (const product of products) {
        const productItem = document.createElement('li');
        productItem.textContent = `Product ID: ${product.productId}, Name: ${product.productName}, Price: ${ethers.utils.formatUnits(product.productPrice, 'ether')} ETH`;
        document.getElementById('prodList').appendChild(productItem);
    }
});
