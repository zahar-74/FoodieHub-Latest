const MenuItem = require('../models/MenuItem');

// GET /menu?category=Pizza&maxPrice=15&diet=vegetarian
exports.getAllMenuItems = async (req, res, next) => {
    try {
        const filter = { available: true };

        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        if (req.query.maxPrice) {
            filter.price = { $lte: parseFloat(req.query.maxPrice) };
        }
        if (req.query.diet && req.query.diet !== 'all') {
            filter.dietaryTags = req.query.diet;
        }

        const items = await MenuItem.find(filter);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

// GET /menu/:id
exports.getMenuItemById = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
};

// POST /admin/menu-items
exports.createMenuItem = async (req, res, next) => {
    try {
        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newItem = await MenuItem.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        next(err);
    }
};

// PUT /admin/menu-items/:id
exports.updateMenuItem = async (req, res, next) => {
    try {
        const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE /admin/menu-items/:id
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const deleted = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

// GET /menu/:id
exports.getMenuItemById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
};