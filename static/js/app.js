// Get username from the server-rendered data
const loggedIn = document.getElementById("userLoggedIn") ? 
               document.getElementById("userLoggedIn").dataset.username : null;

function renderPost(post, isNew=false) {
    const template = document.getElementById("post-template").content.cloneNode(true);
    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;
    template.querySelector(".post-title").innerText = post.title;
    const usernameLink = template.querySelector(".usernameLink");
    if (usernameLink) {
        usernameLink.href = "/user/" + post.username;
    }

    if (isNew){
        document.getElementById("feed").prepend(template);
    } else {
        document.getElementById("feed").appendChild(template);
    }
}

async function submitPost() {
    const message = document.getElementById("postInput").value;
    const title = document.getElementById("titleInput").value;
    try {
        const response = await fetch("/api/create/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                title
            }),
        });
        if (response.ok) {
            const data = await response.json();
            renderPost({
                username: loggedIn, 
                message, 
                title
            }, true);
            document.getElementById("postInput").value = "";
            document.getElementById("titleInput").value = "";
        } else if (response.status === 401) {
            // Handle not logged in
            alert("You must be logged in to post");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("⚠️ Error! ⚠️ ", error);
    }
}

window.onload = async () => {
    try {
        const response = await fetch("/api/posts");
        const posts = await response.json();
        document.getElementById("feed").innerHTML = "";
        posts.forEach(post => {
            renderPost(post);
        });

        if (document.location.pathname === "/") {
            if (loggedIn) {
                document.getElementById("loginOrOut").innerHTML = "Logout";
                document.getElementById("loginOrOut").href = "/logout";
                if (document.getElementById("username")) {
                    document.getElementById("username").innerHTML = "@" + loggedIn;
                }
            } else {
                document.getElementById("loginOrOut").innerHTML = "Login";
                document.getElementById("loginOrOut").href = "/login";
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
};