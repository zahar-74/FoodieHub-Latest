const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    dietaryTags: { type: [String], default: [] },
    imageUrl: { type: String, default: '' },
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);