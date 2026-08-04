require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ---- View engine ----
app.set('view engine', 'ejs');
app.set('views', './views');

// ---- Core middleware ----
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- DB connection ----
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// ---- Routes (will be uncommented as each track is added) ----
app.get('/', (req, res) => {
    res.render('index');
});
// app.use('/menu', require('./routes/menu'));           // Track 1
// app.use('/orders', require('./routes/orders'));       // Track 2
// app.use('/', require('./routes/auth'));               // Track 3
// app.use('/admin', require('./routes/adminOrders'));   // Track 4
// app.use('/', require('./routes/reviews'));            // Track 5

// ---- Centralized error handler (MUST BE LAST) ----
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));