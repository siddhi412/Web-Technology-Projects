const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
let products = [
{ id: 1, name: "Wireless Mouse", category: "Accessories",
price: 799, quantity: 50, description: "Ergonomic optical mouse" },
{ id: 2, name: "Mechanical Keyboard", category: "Accessories",
price: 2499, quantity: 20, description: "RGB backlit keyboard" }
];
app.get('/api/products', (req, res) => {
res.json(products);
});
app.post('/api/products', (req, res) => {
const { name, category, price, quantity, description } =
req.body;
if (!name || !category || price === undefined || quantity ===
undefined) {
return res.status(400).json({ error: 'Name, category, price, and quantity are required fields.' });
}
const newProduct = {
id: Date.now(),
name: String(name).trim(),
category: String(category).trim(),
price: Number(price),
quantity: Number(quantity),
description: description ? String(description).trim() : ''
};
products.unshift(newProduct);
res.status(201).json({ message: 'Product added successfully.',
id: newProduct.id });
});
app.put('/api/products/:id', (req, res) => {
const productId = Number(req.params.id);
const { name, category, price, quantity, description } =
req.body;
const productIndex = products.findIndex(p => p.id ===
productId);
if (productIndex === -1) {
return res.status(404).json({ error: 'Product not found.'
});
}
products[productIndex] = {
id: productId,
name: String(name).trim(),
category: String(category).trim(),
price: Number(price),
quantity: Number(quantity),
description: description ? String(description).trim() : ''
};
res.json({ message: 'Product updated successfully.' });
});
app.delete('/api/products/:id', (req, res) => {
const productId = Number(req.params.id);
const initialLength = products.length;
products = products.filter(p => p.id !== productId);
if (products.length === initialLength) {
return res.status(404).json({ error: 'Product not found.'
});
}
res.json({ message: 'Product deleted successfully.' });
});
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
