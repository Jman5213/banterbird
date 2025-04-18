from flask import Flask, render_template, jsonify
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


if __name__ == '__main__':
    app.run(debug=True)
