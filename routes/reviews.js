const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const {
    requireAuth,
    requireRole
} = require('../middleware/auth');

router.post(
    '/menu/:id/reviews',
    requireAuth,
    requireRole('customer'),
    reviewController.createReview
);

router.get(
    '/menu/:id/reviews',
    reviewController.getReviewsForItem
);

router.put(
    '/reviews/:id',
    requireAuth,
    reviewController.updateReview
);

router.delete(
    '/reviews/:id',
    requireAuth,
    reviewController.deleteReview
);

router.delete(
    '/admin/reviews/:id',
    requireAuth,
    requireRole('admin'),
    reviewController.adminDeleteReview
);

module.exports = router;
