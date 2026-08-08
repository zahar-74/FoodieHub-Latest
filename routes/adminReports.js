const express = require('express');
const {
    requireAuth,
    requireRole
} = require('../middleware/auth');
const {
    getSalesReport,
    getDashboardStats,
    renderDashboard
} = require('../controllers/reportController');

const router = express.Router();

router.get(
    '/dashboard',
    requireAuth,
    requireRole('admin'),
    renderDashboard
);

router.get(
    '/reports/sales',
    requireAuth,
    requireRole('admin'),
    getSalesReport
);

router.get(
    '/reports/stats',
    requireAuth,
    requireRole('admin'),
    getDashboardStats
);

module.exports = router;