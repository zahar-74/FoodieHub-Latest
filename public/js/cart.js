/* ============================================
   OMAR HASSAN: CART.JS - Cart Logic + Badge
============================================ */

let cart = [];

// Load cart from localStorage on page load
function loadCart() {
    try {
        const stored = localStorage.getItem('cart');
        cart = stored ? JSON.parse(stored) : [];
    } catch (e) {
        cart = [];
    }
    // Ensure cart is always an array
    if (!Array.isArray(cart)) cart = [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Call loadCart on module load
loadCart();

function addToCart(menuItem, quantity = 1, customizations = '') {
    if (!menuItem) return;
    const existingItem = cart.find(item => item.menuItemId === menuItem._id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            cartItemId: 'c' + Date.now(),
            menuItemId: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: quantity,
            customizations: customizations || ''
        });
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart();
    updateCartUI();
}

function updateQuantity(cartItemId, newQuantity) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    // ✅ Handle NaN, empty, or invalid input
    const qty = parseInt(newQuantity);
    if (isNaN(qty) || qty < 1) {
        // If invalid, remove the item or reset to 1? We'll remove it.
        removeFromCart(cartItemId);
        return;
    }
    if (qty <= 0) {
        removeFromCart(cartItemId);
        return;
    }
    item.quantity = qty;
    saveCart();
    updateCartUI();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = 'Total: $0.00';
        return;
    }

    let html = '';
    let cartTotal = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        cartTotal += subtotal;
        html += `
            <div class="cart-item" data-id="${item.cartItemId}">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <input type="number" class="cart-item-qty" value="${item.quantity}" min="1"
                       onchange="updateQuantity('${item.cartItemId}', parseInt(this.value))">
                <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
                <button onclick="removeFromCart('${item.cartItemId}')">Remove</button>
                ${item.customizations ? `<p class="cart-item-custom">Custom: ${item.customizations}</p>` : ''}
            </div>
        `;
    });

    container.innerHTML = html;
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = `Total: $${cartTotal.toFixed(2)}`;
}

function updateCartUI() {
    updateCartBadge();
    renderCartItems();
}

// ===== ORDER HISTORY =====
async function loadOrderHistory() {
    try {
        const response = await fetch('/orders');
        if (!response.ok) throw new Error('Failed to fetch order history');
        return await response.json();
    } catch (err) {
        console.error('Error loading order history:', err);
        return [];
    }
}

async function renderOrderHistory() {
    const container = document.getElementById('order-history-list');
    if (!container) return;
    const orders = await loadOrderHistory();
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p>You have no past orders.</p>';
        return;
    }

    let html = '';
    orders.forEach(order => {
        html += `
            <div class="order-item">
                <h4>Order #${order._id.slice(-6)}</h4>
                <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
                <p>Status: ${order.status}</p>
                <p>Total: $${order.total?.toFixed(2) || '0.00'}</p>
                <button onclick="reorder('${order._id}')">Reorder</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

async function reorder(orderId) {
    try {
        const response = await fetch(`/orders/${orderId}`);
        if (!response.ok) {
            alert('Order not found');
            return;
        }
        const order = await response.json();

        order.items.forEach(item => {
            const menuItem = window.menuItems?.find(i => i._id === item.menuItem?._id);
            if (menuItem) {
                addToCart(menuItem, item.quantity, item.customizations || '');
            } else {
                console.warn('Menu item not found:', item.menuItem);
            }
        });

        alert('Items added to cart!');
        window.location.href = '/cart';
    } catch (err) {
        console.error(err);
        alert('Could not reorder');
    }
}

// ===== DOM INIT =====
document.addEventListener('DOMContentLoaded', function () {
    updateCartUI();
    renderOrderHistory();
});

// Expose functions globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.reorder = reorder;
window.renderOrderHistory = renderOrderHistory;