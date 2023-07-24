
const fs = require("fs");


const { initializeProvider } = require("./utils")
const CurrentRide = require("../models/Auction");



module.exports = (app) => {
    app.get("/homed", async (req, res) => {

        if (req.session.username !== undefined) {

            if (req.session.userType === "Driver") {
                const findExisting = await CurrentRide.find({ 'bids.bidder': req.session.username });
                console.log(findExisting);

                if (findExisting.length === 0) {
                    const checkFinal = await CurrentRide.find({ finalBidder: req.session.username });
                    if (checkFinal.length === 0) {
                        const allRecords = await CurrentRide.find({});
                        res.render("homed", { rides: allRecords });
                    } else {
                        res.redirect("/finald");
                    }

                } else {
                    const currentBid = findExisting[0];
                    let value;
                    for (var i = 0; i < currentBid.bids.length; i++) {
                        if (bidder = req.session.username) {
                            value = currentBid.bids[i].value;
                        }

                    }
                    res.render("dbid", { from: currentBid.from, to: currentBid.to, value: value, status: "pending" });
                }


            } else {
                res.render("homer", {});
            }
        } else {
            res.redirect("/");
        }

    });
    app.post("/homed", async (req, res) => {
        const customerUsername = req.body.username;
        const value = req.body.value;
        const contract = await initializeProvider();
        const response = await contract.get(customerUsername)
        console.log(value, response);
        const bid = {
            value: value,
            bidder: req.session.username,
            vehicle: response['2'],
            vehicaleNo: response['3']
        }
        const insertValue = await CurrentRide.findOneAndUpdate({ username: customerUsername }, { $push: { bids: bid } });
        console.log(insertValue);
        res.redirect("/homed");
    });


    app.get("/finald", async (req, res) => {
        if (req.session.username !== undefined) {

            const contract = await initializeProvider();

            const response = await contract.get(req.session.username)
            const checkFinal=await CurrentRide.find({finalBidder:req.session.username});
            const passanger = await contract.get(checkFinal[0].username)
            console.log(passanger);
            const customer = {
                name: passanger['5'],
                phoneNumber: response['1'],
                to: checkFinal[0].to,
                from: checkFinal[0].from,
                value: checkFinal[0].finalValue,
                username: checkFinal[0].username
            }

            if (checkFinal[0].status === "MET") {
                res.render("finald", { result: customer, message: null });
            }
            else {
                res.render("finald", { result: customer, message: "done" });
            }
        } else {
            res.redirect("/");
        }

    });
    app.post("/finald", async (req, res) => {

        const contract = await initializeProvider();
        const username = req.body.username;
        const fare=req.body.value;
        const response = await contract.get(username)
        contract.setFinalBid(req.session.username, req.body.username)
        const deleteAuction = await CurrentRide.findOneAndDelete({ username: req.body.username });
        res.render("payed", { fare: fare, from: deleteAuction.from, to: deleteAuction.to });


    });


}