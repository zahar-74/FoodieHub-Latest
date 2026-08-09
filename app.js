require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { getCurrentUser } = require('./middleware/auth');

const app = express();

// ---- View engine ----
app.set('view engine', 'ejs');
app.set('views', './views');

// ---- Core middleware ----
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(getCurrentUser); // Populate req.user if token exists (for /me)
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
// ---- DB connection ----
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// ---- API Routes ----
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/menu', require('./routes/menu'));           // Track 1
app.use('/orders', require('./routes/orders'));       // Track 2
app.use('/', require('./routes/auth'));               // Track 3
app.use('/', require('./routes/adminUsers'));         // Track 3
app.use('/admin', require('./routes/adminOrders'));   // Track 4
app.use('/admin', require('./routes/adminReports'));  // Track 4
app.use('/', require('./routes/reviews'));            // Track 5
app.use('/', require('./routes/orderHistory'));       // Track 5

// ---- Views that are rendered as pages (client‑side data fetching) ----
app.get('/item', (req, res) => res.render('item'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/admin-menu-manage', (req, res) => res.render('admin-menu-manage'));
app.get('/checkout', (req, res) => res.render('checkout'));

// ---- Redirect /admin to dashboard ----
app.get('/admin', (req, res) => res.redirect('/admin/dashboard'));

// ---- Get current user role (for admin nav visibility) ----
app.get('/me', (req, res) => res.json({ role: req.user?.role || null }));
// ---- 404 handler ----
app.use((req, res) => {
    res.status(404).render('404');
});
// ---- Centralized error handler (MUST BE LAST) ----
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));