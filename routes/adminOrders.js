const express = require('express');
const {
    requireAuth,
    requireRole
} = require('../middleware/auth');
const {
    getOrders,
    updateOrderStatus
} = require('../controllers/adminOrderController');

const router = express.Router();

router.get(
    '/orders',
    requireAuth,
    requireRole('admin'),
    getOrders
);

router.put(
    '/orders/:id/status',
    requireAuth,
    requireRole('admin'),
    updateOrderStatus
);

module.exports = router;