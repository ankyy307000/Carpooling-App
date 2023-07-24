const express = require("express");

const bparser = require("body-parser");
const session = require("express-session");
const mongoose = require('mongoose');

const signupr = require("./controllers/signupr");
const signupd = require("./controllers/signupd");
const login = require("./controllers/login");
const homer = require("./controllers/homer");
const homed = require("./controllers/homed");
 
 

mongoose.connect('mongodb+srv://tejpratapsingh545:vedVwozFYNSBy5xZ@cluster0.0fofbqg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs');
app.use(session({
    key: "user_sid",
    secret: "llsjs82nnsi02mal0k2%",
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static('./public'));
app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());

app.get("/", async (req, res) => {

    // if(req.session.username!==undefined)
    // {
    //     console.log(req.session.userType);
    //     if(req.session.userType==="Driver"){
    //         res.redirect("/homed");
    //     }else{
    //         res.redirect("/homer");
    //     }

    // }
    // else{
    //     res.render("index",{message:null});
    // }
    res.render("index", { message: null });

});

app.get("/signup", async (req, res) => {

    res.render("sign");
});


app.listen(3000, () => {
    console.log("listening to PORT 3000");
});

 
signupr(app);
signupd(app);
login(app);
homer(app);
homed(app);


