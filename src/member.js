import { Web3, HttpProvider } from 'web3';

const web3 = new Web3('HTTP://127.0.0.1:7545');
web3.eth.getBlock('latest').then(console.log);