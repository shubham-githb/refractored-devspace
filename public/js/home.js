// will only run once the page DOM is ready .

// / A $( document ).ready() block.
$(document).ready(() => {
    $.get("/api/posts", results => {
        outputPosts(results, $(".postsContainer"));
    })
})

// Each time the page is loaded , show the history of all the posts and append it
function outputPosts(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}