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
            "eth_accounts": {}
        }
    ]
});

const ChainId = await window.ethereum.request({ method: 'eth_chainId' });
const Accounts = await window.ethereum.request({ method: 'eth_accounts' });
const blockNum = await window.ethereum.request({ method: 'eth_blockNumber' });
window.ethereum.on('chainChanged', handleChainChanged);
var chainID = document.getElementById("chainID");
var accounts = document.getElementById("accounts");
var currentBlock = document.getElementById("currentBlock");
chainID.innerHTML += ChainId;
accounts.innerHTML += Accounts;
currentBlock.innerHTML += blockNum;
console.log("DOM Success");
function handleChainChanged(chainId) {
    // We recommend reloading the page, unless you must do otherwise.
    window.location.reload();
}

const contractAddress = '0xa242660786Dd9223843228A2EA6c3e21feF44Cd1';
const contractABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "getSomeValue",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

async function registerManufacturer() {
    var result = await window.ethereum.request({ method: 'eth_chainId' });
}


// Replace this with the actual address you're sending the transaction from
const fromAddress = '0xYourSenderAddress';

// Create a new contract instance
const contract = new window.ethereum.Contract(contractABI, contractAddress);

// Replace 'getSomeValue' with the name of the method you want to invoke
const methodName = 'getSomeValue';

// Call the method
const result = await contract.methods[methodName]().call({ from: fromAddress });

console.log('Smart contract method result:', result);
