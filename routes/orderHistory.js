const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controllers/orderHistoryController');
const { requireAuth } = require('../middleware/auth');

// Protect these routes with authentication
router.get('/orders', requireAuth, orderHistoryController.getOrdersJson);
router.get('/order-history', requireAuth, orderHistoryController.renderOrderHistoryPage);

module.exports = router;