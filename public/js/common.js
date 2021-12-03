// Using jquery keyup method . 
// It triggers the keyup event, or attaches a function to run when a keyup event occurs.
$("#postTextarea").keyup(event => {
    // returns DOM element triggering the event
    var textbox = $(event.target);
    // trim() method removes whitespace from both sides of a string. 
    var value = textbox.val().trim();
    // getting element by id
    var submitButton = $("#submitPostButton");

    if(submitButton.length == 0) return alert("No submit button found");
    // if the value is null.Then do not activate the post button
    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }
    // else if there are contents found in the textbox, fire up the post button
    submitButton.prop("disabled", false);
})

//This will get execute when the button is clicked
$("#submitPostButton").click(() => {
    // returns DOM element triggering the event
    var button = $(event.target);
    var textbox = $("#postTextarea");
    // creating a data objext 
    var data = {
        content: textbox.val()
    }

    //The $.post() method loads data from the server using a HTTP POST request.
    // sending post request to REST API for fetching posts.
    $.post("/api/posts", data, postData => {
        // triggering function to create post content and to append it on the page
        var html = createPostHtml(postData);
        // inserts the specified content as the first child of each element in the jQuery collection
        $(".postsContainer").prepend(html);
        //empty the values in textbox 
        textbox.val("");
        //disable the button
        button.prop("disabled", true);
    })
})

// this
$(document).on("click", ".likeButton", (event) => {
    // returns DOM element triggering the event
    var button = $(event.target);
    //triggering the function which will return the id of the particular post
    var postId = getPostIdFromElement(button);
    
    if(postId === undefined) return;
    // Sending PUT request to REST API for updaing the value of the like array
    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (post1) => {
            
            button.find("span").text(post1.likes.length || ""); 
            


        }
    })

})

$(document).on("click", ".retweetButton ", (event) => {
    // returns DOM element triggering the event
    var button = $(event.target);
    //triggering the function which will return the id of the particular post
    var postId = getPostIdFromElement(button);
    
    if(postId === undefined) return;
    // Sending PUT request to REST API for updaing the value of the like array
    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: (post1) => {
            console.log(post1);
            // button.find("span").text(post1.likes.length || ""); 
        }
    })

})


function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Post id undefined");

    return postId;
}

// Function to create Html Post
function createPostHtml(postData) {
    

    var postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object not populated");
    }
    // displaying the author name 
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    // displaying time stamp
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    // creating html for appending the content 
    return `<div class='post' data-id='${postData._id}'>

                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='retweetButton'>
                                <button>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button class='likeButton'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}


// Function to show time difference from the time of post creation
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
