const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'medicare-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Initialize SQLite Database
const db = new sqlite3.Database('./medical_store.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

// Create Tables & Seed Initial Medicines
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        medicine_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL
    )`);

    // Add default medicines if table is empty
    db.get("SELECT COUNT(*) AS count FROM medicines", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO medicines (name, category, price, stock) VALUES (?, ?, ?, ?)");
            stmt.run("Paracetamol 500mg", "Fever & Pain", 30, 100);
            stmt.run("Cetirizine 10mg", "Allergy", 45, 80);
            stmt.run("Vitamin C Tablets", "Supplements", 120, 50);
            stmt.run("First Aid Bandages", "First Aid", 60, 40);
            stmt.finalize();
        }
    });
});

// --- REST API ROUTES ---

// 1. Get all medicines (with optional search)
app.get('/api/medicines', (req, res) => {
    const search = req.query.search ? `%${req.query.search}%` : '%';
    db.all("SELECT * FROM medicines WHERE name LIKE ? OR category LIKE ?", [search, search], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Place a customer order (updates stock safely)
app.post('/api/orders', (req, res) => {
    const { customer_name, medicine_id, quantity } = req.body;
    if (!customer_name || !medicine_id || quantity <= 0) {
        return res.status(400).json({ error: "Please provide valid order details." });
    }

    db.get("SELECT * FROM medicines WHERE id = ?", [medicine_id], (err, med) => {
        if (!med) return res.status(404).json({ error: "Medicine not found." });
        if (med.stock < quantity) return res.status(400).json({ error: "Not enough stock available!" });

        const total = med.price * quantity;
        db.run("UPDATE medicines SET stock = stock - ? WHERE id = ?", [quantity, medicine_id]);
        db.run(
            "INSERT INTO orders (customer_name, medicine_name, quantity, total_price) VALUES (?, ?, ?, ?)",
            [customer_name, med.name, quantity, total],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: `Order placed! Total bill: Rs. ${total}` });
            }
        );
    });
});

// 3. Admin Login (Security & Session Management)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid credentials (Use admin / admin123)" });
    }
});

app.get('/api/auth-status', (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// 4. Add Medicine (Protected Admin Route)
app.post('/api/medicines', (req, res) => {
    if (!req.session.isAdmin) return res.status(403).json({ error: "Unauthorized" });
    const { name, category, price, stock } = req.body;
    if (!name || !category || price <= 0 || stock < 0) {
        return res.status(400).json({ error: "Invalid medicine details." });
    }

    db.run(
        "INSERT INTO medicines (name, category, price, stock) VALUES (?, ?, ?, ?)",
        [name, category, price, stock],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Medicine added successfully!" });
        }
    );
});

// 5. Delete Medicine (Protected Admin Route)
app.delete('/api/medicines/:id', (req, res) => {
    if (!req.session.isAdmin) return res.status(403).json({ error: "Unauthorized" });
    db.run("DELETE FROM medicines WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Medicine removed." });
    });
});

app.listen(PORT, () => {
    console.log(`MediCare Pharmacy running at http://localhost:${PORT}`);
});