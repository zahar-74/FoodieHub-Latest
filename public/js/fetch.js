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

        // Render admin tables if on admin page
        if (typeof renderAdminTables === 'function') {
            renderAdminTables();
        }

        return data;
    } catch (error) {
        console.error('Error loading menu from API:', error);
        alert('Could not load menu. Please refresh the page or try again later.');
        return [];
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