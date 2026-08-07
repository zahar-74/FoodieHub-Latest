const Order = require('../models/Order');

// GET /orders?customerId=...  (JSON — used for reorder logic)
exports.getOrdersJson = async (req, res) => {
    try {
        const { customerId } = req.query;
        if (!customerId) {
            return res.status(400).json({ error: 'customerId query parameter is required' });
        }

        const orders = await Order.find({ customerId })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch order history' });
    }
};

// GET /order-history?customerId=...  (renders the page)
exports.renderOrderHistoryPage = async (req, res) => {
    try {
        const { customerId } = req.query;
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
