
const express = require('express');
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Product data
let products = [
    {
        id: 1,
        title: "Wireless Headphones",
        price: 1999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
    },
    {
        id: 2,
        title: "Running Shoes",
        price: 2499,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"
    },
    {
        id: 3,
        title: "Smart Watch",
        price: 3499,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
    }
];

// GET Request - Display all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST Request - Add new product
app.post('/api/products', (req, res) => {

    const { title, price, category, image } = req.body;

    if (!title || !price || !category) {
        return res.status(400).json({
            error: "Please fill all required fields."
        });
    }

    const newProduct = {
        id: products.length + 1,
        title: title,
        price: Number(price),
        category: category,
        image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully!",
        product: newProduct
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
