const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");


// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", (req, res, next) => {
    
    res.status(200).render("login");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;
    // Checking for the user details in the database
    if(req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername }
            ]
        })

        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("login", payload);
        });
        
        // Check if user is present
        if(user != null) {
            // password-hashing 
            var result = await bcrypt.compare(req.body.logPassword, user.password);


            // if auth completed redirect the user to the homepage
            if(result === true) {
                req.session.user = user;
                return res.redirect("/");
            }
        }
        // displaying payload message if auth fails
        payload.errorMessage = "Login credentials incorrect.";
        return res.status(200).render("login", payload);
    }
    
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");
})

module.exports = router;