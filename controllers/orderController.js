const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// POST /orders
exports.createOrder = async (req, res, next) => {
    try {
        // ✅ Only one destructuring, includes deliveryAddress
        const { items, scheduledFor, deliveryAddress } = req.body;
        const customerId = req.user.id;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order must include at least one item' });
        }

        let scheduledDate = null;
        if (scheduledFor) {
            scheduledDate = new Date(scheduledFor);
            if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
                return res.status(400).json({ error: 'scheduledFor must be a valid future date' });
            }
        }

        const orderItems = [];
        let total = 0;

        for (const { menuItemId, quantity, customizations } of items) {
            if (!menuItemId || !mongoose.Types.ObjectId.isValid(menuItemId)) {
                return res.status(400).json({ error: 'Each item requires a valid menuItemId' });
            }
            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ error: 'Each item requires a quantity of at least 1' });
            }

            const menuItem = await MenuItem.findById(menuItemId);
            if (!menuItem || !menuItem.available) {
                return res.status(400).json({ error: `Menu item ${menuItemId} is not available` });
            }

            total += menuItem.price * quantity;

            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity,
                customizations: customizations || ''
            });
        }

        const order = await Order.create({
            customerId,
            items: orderItems,
            total: Math.round(total * 100) / 100,
            status: 'Placed',
            scheduledFor: scheduledDate,
            deliveryAddress: deliveryAddress
        });

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

// GET /orders/:id (with ownership check)
exports.getOrderById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = await Order.findById(req.params.id).populate('items.menuItem');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (req.user.role !== 'admin' && order.customerId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You do not have access to this order' });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
};

// GET /orders/:id/status (public – no auth needed for tracking)
exports.getOrderStatus = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = await Order.findById(req.params.id).select('status');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ id: order._id, status: order.status });
    } catch (err) {
        next(err);
    }
};

// GET /orders/:id/track (public – renders tracking page)
exports.renderOrderTrackingPage = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Order not found');
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.render('order-tracking', { orderId: order._id.toString() });
    } catch (err) {
        next(err);
    }
};

// GET /admin/api/orders (admin only – unused, kept for reference)
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('items.menuItem')
            .populate('customerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// PATCH /admin/api/orders/:id/status (admin only – unused, kept for reference)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
};