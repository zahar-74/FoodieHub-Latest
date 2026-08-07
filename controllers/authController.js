const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/;

function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
}

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (
            !name ||
            name.trim() === '' ||
            !email ||
            !emailPattern.test(email) ||
            !password ||
            password.length < 6
        ) {
            return res.status(400).json({
                error: 'Please provide a valid name, email, and password'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'Email is already registered'
            });
        }

        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'customer',
            active: true
        });

        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (
            !email ||
            !emailPattern.test(email) ||
            !password ||
            password.length < 6
        ) {
            return res.status(400).json({
                error: 'Please provide a valid email and password'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        if (!user.active) {
            return res.status(403).json({
                error: 'This account has been disabled'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const token = createToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Server error'
        });
    }
}

module.exports = {
    register,
    login
};