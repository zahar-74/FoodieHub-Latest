const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, requireCustomer, requireAdmin } = require('../middleware/auth');

router.post('/menu/:id/reviews', protect, requireCustomer, reviewController.createReview);
router.get('/menu/:id/reviews', reviewController.getReviewsForItem);
router.put('/reviews/:id', protect, reviewController.updateReview);
router.delete('/reviews/:id', protect, reviewController.deleteReview);
router.delete('/admin/reviews/:id', protect, requireAdmin, reviewController.adminDeleteReview);

module.exports = router;
