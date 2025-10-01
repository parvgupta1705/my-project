const mongoose = require('mongoose');

// Define variant structure without _id
const variantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 }
}, { _id: false });

// Define main product schema
const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    category: { 
        type: String, 
        required: true, 
        index: true 
    },
    description: { 
        type: String, 
        default: 'Detailed product description goes here.' 
    },
    variants: {
        type: [variantSchema],
        validate: {
            validator: arr => arr.length > 0,
            message: 'Each product should have at least one variant.'
        }
    }
}, { timestamps: true });

// Create and export model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;