require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MenuItem = require('../models/MenuItem');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB for seeding...');

        // Read the menu.json file
        const rawData = fs.readFileSync(path.join(__dirname, '../data/menu.json'));
        const menuItems = JSON.parse(rawData);

        // Fix image paths: /public/images/ → /images/
        const fixedItems = menuItems.map(item => ({
            ...item,
            imageUrl: item.imageUrl ? item.imageUrl.replace('/public/images/', '/images/') : ''
        }));

        // Clear existing data
        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared existing menu items');

        // Insert new data
        await MenuItem.insertMany(fixedItems);
        console.log(`✅ Seeded ${fixedItems.length} menu items successfully!`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();