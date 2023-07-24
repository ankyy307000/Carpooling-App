const ethCrypto=require('eth-crypto');
const { ethers } = require("ethers");
const { parseEther, formatEther } = require('@ethersproject/units');
 
const UserContract = require('../../build/contracts/User.json');
const UserContractAddress = '0xf7DEf1BA3230E5b45F1aD735B0f1d5591b0C62f4';

async function  createIdentity (){
    var identity=ethCrypto.createIdentity();

    return identity;
}

async function initializeProvider() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = provider.getSigner();
    return new ethers.Contract(UserContractAddress, UserContract.abi, signer);
}

module.exports= {initializeProvider,createIdentity};