const username = "admin";

function renderPost(post, isNew=false) {
    const template = document.getElementById("post-template").content.cloneNode(true);
    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;
    template.querySelector(".post-title").innerText = post.title;

    if (isNew){
        document.getElementById("feed").prepend(template);
    } else {
        document.getElementById("feed").appendChild(template);
    }
}

async function submitPost() {
    const message = document.getElementById("postInput").value;
    try {
        const response = await fetch("/api/create/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                message,
                title,
            }),
        });
        if (response.ok) {
            renderPost({username, message, title}, true);
            document.getElementById("postInput").value = "";
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

    } catch (error) {
        console.error("Error:", error);
    }
};
