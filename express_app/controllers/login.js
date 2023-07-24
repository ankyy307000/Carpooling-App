
//const abi=require("../family_tree_details").abi;
// const address=require("../family_tree_details").address;



require("dotenv").config();
const Profiles = require('../models/Profiles');
const { initializeProvider } = require("./utils")

module.exports = (app) => {

    app.get("/login", async (req, res) => {


        res.render("login", { message: null });


    });

    app.post("/login", async (req, res) => {

        const username = req.body.email;
        const password = req.body.password;
        const contract = await initializeProvider();
        const response = await contract.get(username)




        if (response['5'] !== "") {
            console.log(response);
            if (password === response['6']) {
                req.session.username = username;
                req.session.privateKey = response['0'];
                req.session.userType = response['4'];

                console.log(req.session);
                if (response['4'] === "Driver") {
                    res.redirect("/homed");
                } else {
                    res.redirect("/homer");
                }
            } else {

                res.render("index", { message: "invalid credentials" });
            }

        } else {
            res.render("index", { message: "No such user" });
        }



    });

    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err)
                console.log(err);
        });
        res.redirect("/")
    });

}
