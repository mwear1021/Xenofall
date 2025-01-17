from flask import Flask, jsonify, render_template, url_for, request, redirect, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for flashing messages

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Redirect here if not logged in

class User(UserMixin):
    def __init__(self, id, username, email, password_hash):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
    
    @staticmethod
    def get(user_id):
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user_data = cursor.fetchone()
        conn.close()
        if user_data:
            return User(user_data[0], user_data[1], user_data[2], user_data[3])
        return None

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# database initialization
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # create users table
    # password hash can't be unique in case of multiple users with same password
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL)
        ''')
    
    # create leaderboard table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)
            ''')
    
    conn.commit()
    conn.close()

init_db()

# Home route
@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

# game route
@app.route('/game')
def game():
    return render_template('index.html')


# Leaderboard route
@app.route('/leaderboard')
def leaderboard():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT users.username, leaderboard.score
        FROM leaderboard
        JOIN users ON leaderboard.user_id = users.id
        ORDER BY leaderboard.score DESC
    ''')
    leaderboard_data = cursor.fetchall()
    conn.close()
    return render_template('leaderboard.html', leaderboard=leaderboard_data)


# Sign-up route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        repeat_password = request.form['psw-repeat']

        # Validate passwords match
        if password != repeat_password:
            flash('Passwords do not match.', 'danger')
            return redirect(url_for('signup'))
        
        # hash password
        password_hash = generate_password_hash(password)

        # insert user into db
        try:
            conn = sqlite3.connect('database.db')
            cursor = conn.cursor()
            cursor.execute('''
                           INSERT INTO users (username, email, password_hash) 
                           VALUES (?, ?, ?)''', 
                           (username, email, password_hash)
                           )
            conn.commit()
            conn.close()

            flash('Sign-up successful! Please log in.', 'success')

            # Log the user in automatically after signing up
            conn = sqlite3.connect('database.db')
            cursor = conn.cursor()
            cursor.execute('SELECT id, username, email, password_hash FROM users WHERE email = ?', (email,))
            user_data = cursor.fetchone()
            conn.close()
            if user_data:
                user = User(user_data[0], user_data[1], user_data[2], user_data[3])
                login_user(user)

            return redirect(url_for('home'))
        
        except sqlite3.IntegrityError:
            flash('Username or email already exists.', 'danger')
            return redirect(url_for('signup'))

    return render_template('form.html')

# About route
@app.route('/about')
def about():
    return render_template('about.html')

# delete acct route
# Delete account route
@app.route('/delete_account', methods=['POST'])
@login_required
def delete_account():
    try:
        # Delete user from the users table
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM users WHERE id = ?', (current_user.id,))
        conn.commit()
        conn.close()

        # Log the user out after account deletion
        logout_user()
        flash('Your account has been deleted.', 'info')

        return redirect(url_for('home'))

    except Exception as e:
        print("Error:", e)
        flash('An error occurred while deleting your account.', 'danger')
        return redirect(url_for('home'))

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Check user credentials
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, password_hash FROM users WHERE email = ?', (email,))
        user_data = cursor.fetchone()
        conn.close()

        # Validate user_data and check password
        if user_data and check_password_hash(user_data[2], password):
            flash('Login successful!', 'success')
            user = User(user_data[0], user_data[1], email, user_data[2])
            login_user(user)  # Log the user in
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password.', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html')

#adding score to leaderboard
@app.route('/add_score', methods=['POST'])
def add_score():
    if not current_user.is_authenticated:
        return jsonify({"message": "User not logged in."}), 401

    data = request.get_json()
    score = data.get('score')

    if score is None:
        return jsonify({"message": "Invalid score."}), 400

    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

        # Insert the score into the leaderboard table for the logged-in user
        cursor.execute('INSERT INTO leaderboard (user_id, score) VALUES (?, ?)', (current_user.id, score))
        conn.commit()
        conn.close()

        return jsonify({"message": "Score added successfully!"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "An error occurred while saving your score."}), 500

@app.route('/logout')
def logout():
    logout_user()  # Logs out the user
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)
