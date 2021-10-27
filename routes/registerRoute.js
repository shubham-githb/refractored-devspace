const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register");
})


router.post("/", async (req, res, next) => {

    //getting firstname of the user
    var firstName = req.body.firstName.trim();
      //getting Lastname of the user
    var lastName = req.body.lastName.trim();
      //getting username of the user
    var username = req.body.username.trim();
      //getting email of the user
    var email = req.body.email.trim();
      //getting password of the user
    var password = req.body.password;

    var payload = req.body;


    if(firstName && lastName && username && email && password) {
        // find one document according to the condition. If multiple documents match the condition, then return the first document satisfying the condition
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("register", payload);
        });

        if(user == null) {
            // No user found
            var data = req.body;
            // password hashing
            data.password = await bcrypt.hash(password, 10);
            //create User
            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "Email already in use.";
            }
            else {
                payload.errorMessage = "Username already in use.";
            }
            res.status(200).render("register", payload);
        }
    }
    else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("register", payload);
    }
})

module.exports = router;