const express = require('express')
const app = express()
const router = express.Router();
const x = require("body-parser")

app.set('view engine',"pug");
app.set('views','views')

app.use(x.urlencoded({extended:false}));


router.get("/",(req,res,next)=>{
    res.status(200).render("register")
})

router.post("/",(req,res,next)=>{
    var firstName = req.body.firstName.trim();
    var lastName =  req.body.lastName.trim();
    var userName =  req.body.userName.trim();
    var password =  req.body.password;
    var payload = req.body;
    if(firstName && lastName && userName && password){

    }
    else{
        payload.errorMessage = "Make sure each field has a valid input"
        res.status(200).render("register",payload);
    }
   
})


module.exports = router;