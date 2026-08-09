require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB for seeding...');

        // ---- Seed Menu Items ----
        const rawData = fs.readFileSync(path.join(__dirname, '../data/menu.json'));
        const menuItems = JSON.parse(rawData);

        // Fix image paths: /public/images/ → /images/
        const fixedItems = menuItems.map(item => ({
            ...item,
            imageUrl: item.imageUrl ? item.imageUrl.replace('/public/images/', '/images/') : ''
        }));

        await MenuItem.deleteMany({});
        await MenuItem.insertMany(fixedItems);
        console.log(`✅ Seeded ${fixedItems.length} menu items`);

        // ---- Seed Demo Users ----
        // Clear existing users (optional – only if you want clean state)
        await User.deleteMany({});

        // Admin user
        const adminPassword = await bcrypt.hash('password', 8);
        await User.create({
            name: 'Admin User',
            email: 'admin@foodiehub.com',
            password: adminPassword,
            role: 'admin',
            active: true
        });
        console.log('✅ Created admin user: admin@foodiehub.com / password');

        // Customer user
        const customerPassword = await bcrypt.hash('password', 8);
        await User.create({
            name: 'Test Customer',
            email: 'customer@foodiehub.com',
            password: customerPassword,
            role: 'customer',
            active: true
        });
        console.log('✅ Created customer user: customer@foodiehub.com / password');

        await mongoose.disconnect();
        console.log('✅ Seeding complete!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();