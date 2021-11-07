const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database");
const session = require("express-session");

const server = app.listen(port, () => console.log("Server listening on port " + port));


// setting template engine
app.set("view engine", "pug");
app.set("views", "views");


app.use(bodyParser.urlencoded({ extended: false }));

// serve static files such as images, CSS files, and JavaScript files,
app.use(express.static(path.join(__dirname, "public")));


//  session and cookie-parser middleware in place
app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoute');
const logoutRoute = require('./routes/logout')

// Api routes
const postsApiRoute = require('./routes/api/posts');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout",logoutRoute)

app.use("/api/posts", postsApiRoute);

// it creates a new session for the user and assigns them a cookie. Next time the user comes, the cookie is checked and the page_view session variable is updated accordingly.
app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render("home", payload);
})