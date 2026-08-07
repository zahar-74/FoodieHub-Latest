const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controllers/orderHistoryController');

router.get('/orders', orderHistoryController.getOrdersJson);
router.get('/order-history', orderHistoryController.renderOrderHistoryPage);

module.exports = router;
