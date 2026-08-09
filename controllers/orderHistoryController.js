const Order = require('../models/Order');

// GET /orders (JSON – uses authenticated user)
exports.getOrdersJson = async (req, res) => {
    try {
        // Use the logged-in user's ID from the JWT
        const customerId = req.user.id;
        const orders = await Order.find({ customerId })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch order history' });
    }
};

// GET /order-history (renders the page) – pass customerId from req.user
exports.renderOrderHistoryPage = async (req, res) => {
    try {
        const customerId = req.user ? req.user.id : null;
        let orders = [];
        if (customerId) {
            orders = await Order.find({ customerId })
                .populate('items.menuItem')
                .sort({ createdAt: -1 });
        }
        res.render('order-history', { orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Could not load order history');
    }
};