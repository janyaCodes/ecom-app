const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecomDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String
});

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    supplies: String,
    price: Number
});

// Define Cart Schema
const cartSchema = new mongoose.Schema({
    userId: String,
    items: [{ productId: String, name: String, price: Number }]
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

// Signup API
app.post('/user/signup', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    const user = new User({ name, email, mobile, password });
    await user.save();
    res.send('User registered successfully!');
});

// Login API
app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.send(user);
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// Get Products API
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// Add to Cart API
app.post('/cart', async (req, res) => {
    const { userId, productId, name, price } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }
    cart.items.push({ productId, name, price });
    await cart.save();
    res.send(cart);
});

// Get Cart API
app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    res.send(cart);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
