

const { ethers } = require("ethers");
const { parseEther, formatEther } = require('@ethersproject/units');
const UserContract = require('../../build/contracts/User.json');
const ethCrypto = require('eth-crypto');
const { request } = require("express");

const { initializeProvider, createIdentity } = require("./utils")


module.exports = (app) => {

    app.get("/signupr", (req, res) => {

        res.render("signupr", { message: null });

    });



    app.post("/signupr", async (req, res) => {
        const name = req.body.name;
        const phno = req.body.phno;
        const username = req.body.email;
        const password = req.body.password;
        const userType = 'Rider';
        const vehicle = "";
        const vehicleNo = "";
        // Creating identity
        var identity = await createIdentity();

        const publicKey = identity.publicKey;
        const privateKey = identity.privateKey;
        const newCompressed = ethCrypto.publicKey.compress(
            publicKey
        );
        identity.compressed = newCompressed;



        const contract = await initializeProvider();

        try {
            const user = await contract.set(name, username, phno, vehicle, vehicleNo, userType, password, privateKey);
        } catch (e) {
            console.log('error fetching my user in blockchain: ', e);
        }



        req.session.username = username;
        req.session.privateKey = privateKey;
        req.session.userType = userType;

        res.redirect("/homer");

    });

}