const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database")
const session = require("express-session")

// mongoose.connect("mongodb+srv://admin:Sk@961969@twitterclonecluster.a8lzi.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority")
// .then(()=>{
    // console.log("Database connection successfull");
// })
// .catch((err)=>{
    // console.log("database not connection successfull"+ err);
// })

// mongoose.connect("mongodb://shubham:20lZu5uATfqqr7uc@clusterog-shard-00-00.h0ilj.mongodb.net:27017,clusterog-shard-00-01.h0ilj.mongodb.net:27017,clusterog-shard-00-02.h0ilj.mongodb.net:27017/shubham?ssl=true&replicaSet=atlas-yoi750-shard-0&authSource=admin&retryWrites=true&w=majority")
// .then(()=>{
//     console.log("DB DONE")
// })
// .catch((err)=>{
//     console.log("DB NOT DONE" + err);
// })


const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    // cookie: { secure: true }
  }))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoute');
const logoutRoute = require('./routes/logout')

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn : req.session.user
    }

    res.status(200).render("home", payload);
})