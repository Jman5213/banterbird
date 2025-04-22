const username = "admin";

function renderPost(post) {
    const template = document.getElementById("post-template").content.cloneNode(true);
    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;
    document.getElementById("feed").appendChild(template);
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
            }),
        });
        document.getElementById("postInput").value = "";
        loadAndDisplayPosts();
    } catch {
        console.error("⚠️ Error! ⚠️ ", error);
    }
}

async function loadAndDisplayPosts() {
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

window.onload = loadAndDisplayPosts;