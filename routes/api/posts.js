const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

//  parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(bodyParser.urlencoded({ extended: false }));

// responding to the client request 
router.get("/", (req, res, next) => {
    // find() is used to find particular data from the MongoDB database.
    Post.find()
    // linking documents across the collections, allowing to have a schema for each item.
    .populate("postedBy")
    // sorting the post content in newest to old format
    .sort({ "createdAt": -1 })

    //HTTP Status 200 (OK) status code indicating that the request has been processed successfully on the server.
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})



// responds only to HTTP POST requests.
router.post("/", async (req, res, next) => {
    // checking id the body content is empty
    if (!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }


    // creating a postData object
    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }


    // create the database if it does not exist, and make a connection to it.
    Post.create(postData)
    .then(async newPost => {
        // populating in mongoose for populating the data inside the reference.
        newPost = await User.populate(newPost, { path: "postedBy" })

        
        // indicates that as a result of HTTP POST request, one or more new resources have been successfully created on the server.
        res.status(201).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


//  HTTP PUT requests to the specified path with the specified callback 
router.put("/:id/like", async (req, res, next) => {
    // getting the post id from the params
    var postId = req.params.id;
    // getting the user id from the session
    var userId = req.session.user._id;

    //  returns true if a string contains a specified string, otherwise false .
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    //using pull to remove an element from collection  if isLiked returns false and addToSet to add the element in Likes array 
    // adds a value to an array unless the value is already present
    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})


router.post("/:id/retweet", async (req, res, next) => {
    // return res.status(200).send("Its working")

    // return res.status(200).send("Working.....")
    

    // getting the post id from the params
    var postId = req.params.id;
    // getting the user id from the session
    var userId = req.session.user.id;

    //  returns true if a string contains a specified string, otherwise false .
    // try and delete retweet;

    var deletePost = await Post.findOneAndDelete({postedBy:userId , retweetData : postId}) 
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    //using pull to remove an element from collection  if isLiked returns false and addToSet to add the element in Likes array 
    // adds a value to an array unless the value is already present
    var option = deletePost != null ? "$pull" : "$addToSet";

    return res.status(200).send(option);

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})

module.exports = router;
