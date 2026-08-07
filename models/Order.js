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
            quantity: Number,
            customizations: String
        }
    ],
    total: Number,
    status: {
        type: String,
        enum: ['pending', 'preparing', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
