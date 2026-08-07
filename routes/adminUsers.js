const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const {
    requireAuth,
    requireRole
} = require('../middleware/auth');

const router = express.Router();

router.put(
    '/admin/users/:id/status',
    requireAuth,
    requireRole('admin'),
    async function (req, res) {
        try {
            const { id } = req.params;
            const { active } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID'
                });
            }

            if (typeof active !== 'boolean') {
                return res.status(400).json({
                    error: 'The active field must be true or false'
                });
            }

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            if (user.role !== 'customer') {
                return res.status(403).json({
                    error: 'Only customer accounts can be enabled or disabled'
                });
            }

            user.active = active;
            await user.save();

            return res.status(200).json({
                message: active
                    ? 'Customer account enabled successfully'
                    : 'Customer account disabled successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    active: user.active
                }
            });
        } catch (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Server error'
            });
        }
    }
);

module.exports = router;