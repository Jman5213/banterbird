from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/api/posts')
def get_posts():
    with open('posts.json', 'r') as f:
        posts = json.load(f)
    return jsonify(posts)


@app.route('/api/create/post', methods=['POST'])
def create_post():
    new_post = request.get_json()
    with open('posts.json', 'r') as f:
        posts = json.load(f)
    posts.insert(0, new_post)
    with open('posts.json', 'w') as f:
        json.dump(posts, f, indent=4)
    return jsonify({"status": "success"}), 201


if __name__ == '__main__':
    app.run(debug=True)
