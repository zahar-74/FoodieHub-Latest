const Review = require('../models/Review');

// POST /menu/:id/reviews (customer only)
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const menuItemId = req.params.id;

        if (!rating || !comment) {
            return res.status(400).json({ error: 'Rating and comment are required' });
        }

        const review = await Review.create({
            menuItem: menuItemId,
            user: req.user.id,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create review' });
    }
};

// GET /menu/:id/reviews (public — used by item.ejs to display reviews)
exports.getReviewsForItem = async (req, res) => {
    try {
        const reviews = await Review.find({ menuItem: req.params.id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch reviews' });
    }
};

// PUT /reviews/:id (edit — ownership check)
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You can only edit your own review' });
        }

        const { rating, comment } = req.body;
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update review' });
    }
};

// DELETE /reviews/:id (delete — ownership check)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own review' });
        }

        await review.deleteOne();
        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete review' });
    }
};

// DELETE /admin/reviews/:id (admin moderation — no ownership check)
exports.adminDeleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        await review.deleteOne();
        res.json({ message: 'Review deleted by admin' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete review' });
    }
};
// POST /menu/:id/reviews
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const menuItemId = req.params.id;

        // Validate rating
        if (!rating || !comment) {
            return res.status(400).json({ error: 'Rating and comment are required' });
        }
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if menu item exists
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        const review = await Review.create({
            menuItem: menuItemId,
            user: req.user.id,
            rating: ratingNum,
            comment
        });

        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create review' });
    }
};