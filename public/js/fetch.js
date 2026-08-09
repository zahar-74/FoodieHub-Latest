/* ============================================
   FETCH.JS - AJAX from real backend API
============================================ */

const API_BASE = '/';

async function loadMenuItems() {
    try {
        console.log('Fetching menu from API:', API_BASE + 'menu');
        const response = await fetch(API_BASE + 'menu');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Menu loaded successfully from API:', data.length, 'items');

        // Store globally
        window.menuItems = data;

        // Call setMenuItems if available
        if (typeof setMenuItems === 'function') {
            setMenuItems(data);
        } else {
            console.warn('setMenuItems function not found');
        }

        // ✅ Render admin menu table ONLY if the admin-menu-table exists
        if (document.getElementById('admin-menu-table')) {
            if (typeof renderMenuTable === 'function') {
                renderMenuTable();  // ✅ Fixed: now calls renderMenuTable (not renderAdminTables)
            } else {
                console.warn('renderMenuTable function not found');
            }
        }

        return data;
    } catch (error) {
        console.error('Error loading menu from API:', error);
        // Only show alert if we're on a page that needs menu (not admin pages)
        if (document.getElementById('menu-grid')) {
            alert('Could not load menu. Please refresh the page or try again later.');
        }
        return [];
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('fetch.js DOM loaded');

    if (document.getElementById('menu-grid')) {
        loadMenuItems();
    }

    if (document.getElementById('admin-menu-table')) {
        // If we already have menu items, render the table; otherwise load them first
        if (window.menuItems && window.menuItems.length > 0) {
            if (typeof renderMenuTable === 'function') {
                renderMenuTable();
            }
        } else {
            loadMenuItems();
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