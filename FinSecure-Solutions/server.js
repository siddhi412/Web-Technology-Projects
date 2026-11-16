const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
    session({
        secret: "your-super-secret-key-change-this", // Change this in production!
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
);

// Serve static frontend files (assumes HTML/CSS/JS are in a 'public' folder or root directory)
app.use(express.static(path.join(__dirname)));

// Setup SQLite Database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Error opening database", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);
    }
});

// ==================== API ROUTES ====================

// 1. REGISTER
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    try {
        // Hash password with salt rounds = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Secure database query using placeholders (?) to prevent SQL Injection
        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(query, [username, hashedPassword], function (err) {
            if (err) {
                return res.status(400).json({ message: "Username already exists or invalid input." });
            }
            res.json({ message: "Registration successful! You can now sign in." });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

// 2. LOGIN
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Compare submitted password with stored hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Save user session
        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({ message: "Login successful!" });
    });
});

// 3. DASHBOARD (Protected Route)
app.get("/api/dashboard", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    res.json({
        user: {
            username: req.session.username
        }
    });
});

// 4. COMMENT / XSS TEST ROUTE
app.post("/api/comment", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ message: "Comment cannot be empty." });
    }

    // In a real application, you might sanitize or store this. 
    // Returning it safely lets the frontend use textContent to avoid XSS.
    res.json({
        message: "Input processed securely.",
        comment: comment
    });
});

// 5. LOGOUT
app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out." });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Signed out successfully." });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});