const mongoose = require('mongoose');
const Order = require('../models/Order');

const orderStatuses = [
    'Placed',
    'Preparing',
    'Out for Delivery',
    'Delivered'
];

async function getOrders(req, res) {
    try {
        const { status } = req.query;

        const filter = {};

        if (status) {
            if (!orderStatuses.includes(status)) {
                return res.status(400).json({
                    error: 'Invalid order status'
                });
            }

            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate('customerId', 'name email')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        return res.status(200).render('admin-orders', {
            orders
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid order ID'
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        const currentIndex = orderStatuses.indexOf(order.status);

        if (currentIndex === -1) {
            return res.status(400).json({
                error: 'Invalid current order status'
            });
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({
                error: 'Delivered orders cannot be updated'
            });
        }

        order.status = orderStatuses[currentIndex + 1];
        await order.save();

        return res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

module.exports = {
    getOrders,
    updateOrderStatus
};