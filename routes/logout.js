const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');



app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    if(req.session){
        // Once Logged Out destroy the session and redirect the user to the loginPage
        req.session.destroy(()=>{
            res.redirect("/login")
        })
    }
})


module.exports = router;