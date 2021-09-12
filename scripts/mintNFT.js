require('dotenv').config();
const Web3 = require('web3');

const API_URL = process.env.INFURA_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY

const web3 = new Web3(API_URL);

const contract = require('../artifacts/contracts/TikTok.sol/TikTok.json');

const contractAddress = '0x5307ec49f8c53990981eB3bAb827b6579A015174';
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

    const transaction = {
        from: PUBLIC_KEY,
        to: contractAddress,
        gas: 620000,
        nonce: nonce,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }

    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
    web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, function(err, hash) {
        if (err) {
            console.log('err');
        } else {
            console.log('hash:', hash)
        }
    }).catch(err => {
        console.log('failed:', err);
    })
}
mintNFT('https://gateway.pinata.cloud/ipfs/QmZhy2ackQDUmJL3eWr9QzssrVRo3uL8zzipSDCJMzkefK')

