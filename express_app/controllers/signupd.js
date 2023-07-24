


const session = require("express-session");
var mongoose = require('mongoose');
// const cookie=require("cookie-parser");


const { createIdentity, initializeProvider } = require("./utils");
const ethCrypto = require('eth-crypto');





module.exports = (app) => {

    app.get("/signupd", (req, res) => {

        res.render("signupd", { message: null });

    });

    app.post("/signupd", async (req, res) => {
        var name = req.body.name;
        var phno = req.body.phno;
        var username = req.body.email;
        var password = req.body.password;
        var vehicle = req.body.vehicle;
        var vehicleNo = req.body.vehicle_num;
        var userType = 'Driver';

        // Creating identity
        var identity = await createIdentity();

        console.log(identity);
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
            console.log('error setting  data in blockchain: ', e);
        }






        // --------------------------------------------------------------------------------------------------

        req.session.username = username;
        req.session.privateKey = privateKey;
        req.session.userType = userType;
        res.redirect("/homed");

    });


}