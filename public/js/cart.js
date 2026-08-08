/* ============================================
   OMAR HASSAN: CART.JS - Cart Logic + Badge
============================================ */

let cart = [];

function addToCart(menuItem, quantity = 1, customizations = '') {
    if (!menuItem) return;
    const existingItem = cart.find(item => item.menuItemId === menuItem.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            cartItemId: 'c' + Date.now(),
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: quantity,
            customizations: customizations || ''
        });
    }
    updateCartUI();
}

function removeFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
}

function updateQuantity(cartItemId, newQuantity) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }
    item.quantity = newQuantity;
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

async function renderOrderHistory() {
    const container = document.getElementById('order-history-list');
    if (!container) return;

    // Replace mock data with real API call
    // For demo, you might pass a customerId from session or use a default
    const customerId = sessionStorage.getItem('customerId') || '...'; // implement this
    const orders = await loadOrderHistory(customerId);

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
async function loadOrderHistory(customerId) {
    try {
        const response = await fetch(`/orders?customerId=${customerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch order history');
        }
        const orders = await response.json();
        return orders;
    } catch (err) {
        console.error('Error loading order history:', err);
        return [];
    }
}
async function reorder(orderId) {
    try {
        // Fetch the order details
        const response = await fetch(`/orders/${orderId}`);
        if (!response.ok) {
            alert('Order not found');
            return;
        }
        const order = await response.json();

        // Add each item to cart
        order.items.forEach(item => {
            // Find the menu item by ID from global store
            const menuItem = window.menuItems?.find(i => i._id === item.menuItem?._id);
            if (menuItem) {
                addToCart(menuItem, item.quantity, item.customizations || '');
            } else {
                console.warn('Menu item not found:', item.menuItem);
            }
        });

        alert('Items added to cart!');
        window.location.href = 'cart.html';
    } catch (err) {
        console.error(err);
        alert('Could not reorder');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartUI();
    renderOrderHistory();
});

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.reorder = reorder;