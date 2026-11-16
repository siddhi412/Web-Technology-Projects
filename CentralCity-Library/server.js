const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
secret: 'library-secret-key-12345',
resave: false,
saveUninitialized: false,
cookie: { maxAge: 600000 }
}));
const PREDEFINED_USER = {
username: "student",
password: "password123"
};
function requireAuth(req, res, next) {
if (req.session && req.session.isAuthenticated) {
return next();
}
res.redirect('/login.html?error=Please log in to access the dashboard.');
}
app.post('/api/login', (req, res) => {
const { username, password } = req.body;
if (!username || !password) {
return res.status(400).json(
    { error: "Username and password are required." });
}
if (username === PREDEFINED_USER.username && password ===
PREDEFINED_USER.password) {
req.session.isAuthenticated = true;
req.session.username = username;
return res.json({ message: "Login successful", redirect:
"/dashboard.html" });
}
res.status(401).json({ error: "Invalid username or password."
});
});
app.get('/api/check-session', (req, res) => {
if (req.session && req.session.isAuthenticated) {
return res.json({ isAuthenticated: true, username:
req.session.username });
}
res.json({ isAuthenticated: false });
});
app.get('/api/logout', (req, res) => {
req.session.destroy(err => { if (err) {
return res.status(500).json(
    { error: "Could not log out." });
}
res.clearCookie('connect.sid');
res.json({ message: "Logged out successfully", redirect:
"/login.html" });
});
});
app.get('/dashboard.html', requireAuth, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});