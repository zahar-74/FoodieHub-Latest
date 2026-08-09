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
            return res.status(400).render('register', {
                error: 'Please provide a valid name, email, and password (min 6 chars)'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).render('register', {
                error: 'Email is already registered'
            });
        }

        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'customer',
            active: true
        });

        // ✅ Redirect to login page on success
        return res.redirect('/login');
    } catch (err) {
        console.error(err);
        return res.status(500).render('register', {
            error: 'Server error. Please try again later.'
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
            return res.status(400).render('login', {
                error: 'Please provide a valid email and password'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password');

        if (!user) {
            return res.status(401).render('login', {
                error: 'Invalid email or password'
            });
        }

        if (!user.active) {
            return res.status(403).render('login', {
                error: 'This account has been disabled'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).render('login', {
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

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).render('login', {
            error: 'Server error. Please try again later.'
        });
    }
}

module.exports = {
    register,
    login
};