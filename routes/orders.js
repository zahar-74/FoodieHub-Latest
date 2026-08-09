const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, orderController.createOrder);
router.get('/:id/track', orderController.renderOrderTrackingPage);
router.get('/:id/status', orderController.getOrderStatus);
router.get('/:id', requireAuth, orderController.getOrderById);  // ✅ Added requireAuth

module.exports = router;