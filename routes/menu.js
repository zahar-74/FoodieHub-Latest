const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
// const { requireAuth, requireRole } = require('../middleware/auth'); // ← Uncomment after Marwan's Track 3 is merged

// Public routes (no authentication needed)
router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);

// Admin routes (protected — uncomment after auth is ready)
router.post('/admin/menu-items', /* requireAuth, requireRole('admin'), */ menuController.createMenuItem);
router.put('/admin/menu-items/:id', /* requireAuth, requireRole('admin'), */ menuController.updateMenuItem);
router.delete('/admin/menu-items/:id', /* requireAuth, requireRole('admin'), */ menuController.deleteMenuItem);

module.exports = router;