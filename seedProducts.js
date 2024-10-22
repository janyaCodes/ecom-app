const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecomDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    supplies: String,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

// Products to seed
const products = [
    { name: 'Laptop', supplies: 'Electronics', price: 500 },
    { name: 'Smartphone', supplies: 'Electronics', price: 300 },
    { name: 'Headphones', supplies: 'Accessories', price: 100 },
    { name: 'Refrigerator', supplies: 'Home Appliances', price: 800 },
    { name: 'Blender', supplies: 'Kitchen Appliances', price: 60 },
    { name: 'Dj Headset', supplies: 'Music', price: 7000 }
];

// Save products to database
Product.insertMany(products)
    .then(() => {
        console.log('Products added to collection');
        mongoose.connection.close();
    })
    .catch(err => {
        console.log('Error seeding products: ', err);
        mongoose.connection.close();
    });