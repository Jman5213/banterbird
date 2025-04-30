from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import json

app = Flask(__name__)
app.secret_key = 'banterbird'


@app.route('/')
def index():
    return render_template("index.html", title="Home", username=session.get('username', ''))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Simple validation
        if not username or not password:
            return render_template("login.html", title="Login", error="Please enter both username and password")
        
        # In a real app, you would validate against a database
        # For now, we'll just accept any non-empty values
        session['username'] = username
        return redirect(url_for('index'))
    
    return render_template("login.html", title="Login")


@app.route('/api/posts')
def get_posts():
    with open('posts.json', 'r') as f:
        posts = json.load(f)
    return jsonify(posts)


@app.route('/api/create/post', methods=['POST'])
def create_post():
    if 'username' not in session:
        return jsonify({"status": "error", "message": "Not logged in"}), 401
    
    new_post = request.get_json()
    # Use the username from the session instead of trusting the client
    new_post['username'] = session['username']
    
    with open('posts.json', 'r') as f:
        posts = json.load(f)
    posts.insert(0, new_post)
    with open('posts.json', 'w') as f:
        json.dump(posts, f, indent=4)
    return jsonify({"status": "success"}), 200


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/user/<username>')
def user_profile(username):
    # In a real app, you would fetch user data from a database
    # For now, we'll just pass the username to the template
    return render_template("user.html", title=f"Profile - {username}", username=username, 
                          profile_user=username)



if __name__ == '__main__':
    app.run(debug=True)
