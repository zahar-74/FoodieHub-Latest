/* ============================================
   YASSIN: FETCH.JS - AJAX from menu.json
============================================ */

const API_BASE = '/';

async function loadMenuItems() {
    try {
        console.log('Fetching menu from:', API_BASE + 'data/menu.json');
        const response = await fetch(API_BASE + 'data/menu.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Menu loaded successfully from JSON:', data.length, 'items');

        // Store globally
        window.menuItems = data;

        // Call setMenuItems if available
        if (typeof setMenuItems === 'function') {
            setMenuItems(data);
        } else {
            console.warn('setMenuItems function not found');
        }

        // Render admin tables if on admin page
        if (typeof renderAdminTables === 'function') {
            renderAdminTables();
        }

        return data;
    } catch (error) {
        console.error('Error loading menu from JSON:', error);
        console.log('Using fallback hardcoded data...');

        const fallbackData = [
            {
                id: 'm1',
                name: 'Margherita Pizza',
                description: 'Classic tomato sauce with fresh mozzarella and basil.',
                price: 12.99,
                category: 'Pizza',
                dietaryTags: ['vegetarian'],
                imageUrl: '/public/images/m1-pizza.jpg',
                available: true
            },
            {
                id: 'm2',
                name: 'Caesar Salad',
                description: 'Crisp romaine lettuce, Caesar dressing, croutons, and shaved Parmesan.',
                price: 8.99,
                category: 'Salads',
                dietaryTags: ['vegetarian', 'gluten-free'],
                imageUrl: '/public/images/m2-salad.jpg',
                available: true
            },
            {
                id: 'm3',
                name: 'Classic Burger',
                description: 'Juicy beef patty with lettuce, tomato, onion, and our secret sauce.',
                price: 9.99,
                category: 'Burgers',
                dietaryTags: [],
                imageUrl: '/public/images/m3-burger.jpg',
                available: true
            },
            {
                id: 'm4',
                name: 'Spaghetti Carbonara',
                description: 'Creamy pasta with pancetta, egg yolk, and Pecorino Romano cheese.',
                price: 14.99,
                category: 'Pasta',
                dietaryTags: [],
                imageUrl: '/public/images/m4-pasta.jpg',
                available: true
            },
            {
                id: 'm5',
                name: 'Vegan Buddha Bowl',
                description: 'Quinoa, roasted vegetables, avocado, and tahini dressing.',
                price: 11.99,
                category: 'Salads',
                dietaryTags: ['vegan', 'gluten-free'],
                imageUrl: '/public/images/m5-bowl.jpg',
                available: true
            },
            {
                id: 'm6',
                name: 'Pepperoni Pizza',
                description: 'Classic tomato sauce, mozzarella, and spicy pepperoni.',
                price: 14.99,
                category: 'Pizza',
                dietaryTags: [],
                imageUrl: '/public/images/m6-pepperoni.jpg',
                available: true
            },
            {
                id: 'm7',
                name: 'Grilled Chicken Sandwich',
                description: 'Grilled chicken breast with avocado, bacon, and chipotle mayo.',
                price: 11.99,
                category: 'Burgers',
                dietaryTags: [],
                imageUrl: '/public/images/m7-chicken.jpg',
                available: true
            },
            {
                id: 'm8',
                name: 'Tiramisu',
                description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.',
                price: 6.99,
                category: 'Desserts',
                dietaryTags: ['vegetarian'],
                imageUrl: '/public/images/m8-tiramisu.jpg',
                available: true
            },
            {
                id: 'm9',
                name: 'Fresh Lemonade',
                description: 'Freshly squeezed lemonade with a hint of mint.',
                price: 3.99,
                category: 'Drinks',
                dietaryTags: ['vegan', 'gluten-free'],
                imageUrl: '/public/images/m9-lemonade.jpg',
                available: true
            },
            {
                id: 'm10',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with a gooey molten center.',
                price: 7.99,
                category: 'Desserts',
                dietaryTags: ['vegetarian'],
                imageUrl: '/public/images/m10-lava.jpg',
                available: true
            }
        ];

        window.menuItems = fallbackData;

        if (typeof setMenuItems === 'function') {
            setMenuItems(fallbackData);
        }

        if (typeof renderAdminTables === 'function') {
            renderAdminTables();
        }

        return fallbackData;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('fetch.js DOM loaded');

    if (document.getElementById('menu-grid')) {
        loadMenuItems();
    }

    if (document.getElementById('admin-menu-table')) {
        if (typeof window.menuItems !== 'undefined' && window.menuItems.length === 0) {
            loadMenuItems();
        } else {
            if (typeof renderAdminTables === 'function') {
                setTimeout(renderAdminTables, 100);
            }
        }
    }

    if (document.getElementById('cart-items')) {
        if (typeof updateCartUI === 'function') {
            setTimeout(updateCartUI, 50);
        }
    }

    if (document.getElementById('order-history-list')) {
        if (typeof renderOrderHistory === 'function') {
            setTimeout(renderOrderHistory, 50);
        }
    }

    if (document.getElementById('item-detail')) {
        console.log('fetch.js: item detail page detected');
        // If data is already loaded, render immediately
        if (window.menuItems && window.menuItems.length > 0) {
            if (typeof renderItemDetail === 'function') {
                setTimeout(renderItemDetail, 100);
            }
        } else {
            // Otherwise load data first
            loadMenuItems();
        }
    }
});