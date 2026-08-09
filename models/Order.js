const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            customizations: { type: String, default: '' }
        }
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'],
        default: 'Placed'
    },
    scheduledFor: { type: Date, default: null },
    deliveryAddress: { type: String, required: true }, // ✅ added
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);