const Order = require('../models/Order');
const Review = require('../models/Review');

const orderStatuses = [
    'Placed',
    'Preparing',
    'Out for Delivery',
    'Delivered'
];

async function getDashboardStats(req, res) {
    try {
        const orders = await Order.find();
        const reviews = await Review.find();

        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            order => order.status !== 'Delivered'
        ).length;

        const revenue = orders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
        );

        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        return res.status(200).json({
            totalOrders,
            pendingOrders,
            revenue,
            totalReviews: reviews.length,
            averageRating
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

async function renderDashboard(req, res) {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name email')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        const reviews = await Review.find();

        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            order => order.status !== 'Delivered'
        ).length;

        const revenue = orders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
        );

        const averageRating = reviews.length > 0
            ? reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            ) / reviews.length
            : 0;

        const recentOrders = orders.slice(0, 5);

        return res.status(200).render('admin-dashboard', {
            stats: {
                totalOrders,
                pendingOrders,
                revenue,
                totalReviews: reviews.length,
                averageRating
            },
            recentOrders
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

async function getSalesReport(req, res) {
    try {
        const { startDate, endDate, status } = req.query;

        const filter = {};

        if (status) {
            if (!orderStatuses.includes(status)) {
                return res.status(400).json({
                    error: 'Invalid order status'
                });
            }

            filter.status = status;
        }

        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                const start = new Date(startDate);

                if (isNaN(start.getTime())) {
                    return res.status(400).json({
                        error: 'Invalid start date'
                    });
                }

                filter.createdAt.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);

                if (isNaN(end.getTime())) {
                    return res.status(400).json({
                        error: 'Invalid end date'
                    });
                }

                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }

        const orders = await Order.find(filter)
            .populate('customerId', 'name email')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        const totalRevenue = orders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
        );

        return res.status(200).json({
            totalOrders: orders.length,
            totalRevenue,
            orders
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

module.exports = {
    getSalesReport,
    getDashboardStats,
    renderDashboard
};