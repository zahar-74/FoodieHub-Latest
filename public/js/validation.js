/* ============================================
   MARWAN: VALIDATION.JS - All Form Validation
   (Now acts as the single source of truth for submissions)
============================================ */

function clearAllErrors() {
    const errorSpans = document.querySelectorAll('.error-message');
    errorSpans.forEach(el => el.textContent = '');
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

// --- LOGIN ---
function validateLogin() {
    clearAllErrors();
    let valid = true;

    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,6}$/; // ✅ fixed TLD length

    if (!email || !emailPattern.test(email.value)) {
        const error = document.getElementById('login-email-error');
        if (error) error.textContent = 'Please enter a valid email address.';
        if (email) email.classList.add('invalid');
        valid = false;
    }

    if (!password || password.value.length < 6) {
        const error = document.getElementById('login-password-error');
        if (error) error.textContent = 'Password must be at least 6 characters.';
        if (password) password.classList.add('invalid');
        valid = false;
    }

    return valid;
}

// --- REGISTER ---
function validateRegister() {
    clearAllErrors();
    let valid = true;

    const name = document.getElementById('register-name');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,6}$/; // ✅ fixed TLD length

    if (!name || name.value.trim() === '') {
        const error = document.getElementById('register-name-error');
        if (error) error.textContent = 'Full name is required.';
        if (name) name.classList.add('invalid');
        valid = false;
    }

    if (!email || !emailPattern.test(email.value)) {
        const error = document.getElementById('register-email-error');
        if (error) error.textContent = 'Please enter a valid email address.';
        if (email) email.classList.add('invalid');
        valid = false;
    }

    if (!password || password.value.length < 6) {
        const error = document.getElementById('register-password-error');
        if (error) error.textContent = 'Password must be at least 6 characters.';
        if (password) password.classList.add('invalid');
        valid = false;
    }

    return valid;
}

// --- CHECKOUT (validation + submission) ---
async function handleCheckout(e) {
    e.preventDefault();
    clearAllErrors();
    let valid = true;

    const address = document.getElementById('delivery-address');
    const scheduleTime = document.getElementById('schedule-time');

    if (!address || address.value.trim() === '') {
        const error = document.getElementById('delivery-address-error');
        if (error) error.textContent = 'Delivery address is required.';
        if (address) address.classList.add('invalid');
        valid = false;
    }

    if (scheduleTime && scheduleTime.value) {
        const selectedDate = new Date(scheduleTime.value);
        const now = new Date();
        if (selectedDate < now) {
            const error = document.getElementById('schedule-time-error');
            if (error) error.textContent = 'Please select a future date and time.';
            if (scheduleTime) scheduleTime.classList.add('invalid');
            valid = false;
        }
    }

    if (typeof cart !== 'undefined' && cart.length === 0) {
        const cartError = document.getElementById('cart-error');
        if (cartError) cartError.textContent = 'Your cart is empty.';
        valid = false;
    }

    if (!valid) return false;

    // --- Submit order ---
    const items = cart.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        customizations: item.customizations || ''
    }));

    const scheduledFor = document.getElementById('schedule-time').value || null;

    try {
        const response = await fetch('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ items, scheduledFor, deliveryAddress: address.value.trim() })
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Order failed');
            return;
        }

        const order = await response.json();
        cart = [];
        saveCart();
        updateCartUI();
        window.location.href = `/orders/${order._id}/track`;
    } catch (err) {
        console.error(err);
        alert('Could not place order. Please try again.');
    }
}

// --- ADMIN: ADD/EDIT MENU ITEM (validation + submission) ---
async function handleAddItem(e) {
    e.preventDefault();
    clearAllErrors();
    let valid = true;

    const name = document.getElementById('item-name');
    const description = document.getElementById('item-description');
    const price = document.getElementById('item-price');
    const stock = document.getElementById('item-stock');

    if (!name || name.value.trim() === '') {
        const error = document.getElementById('item-name-error');
        if (error) error.textContent = 'Item name is required.';
        if (name) name.classList.add('invalid');
        valid = false;
    }

    if (!description || description.value.trim() === '') {
        const error = document.getElementById('item-description-error');
        if (error) error.textContent = 'Description is required.';
        if (description) description.classList.add('invalid');
        valid = false;
    }

    if (!price || parseFloat(price.value) <= 0) {
        const error = document.getElementById('item-price-error');
        if (error) error.textContent = 'Please enter a valid price (greater than 0).';
        if (price) price.classList.add('invalid');
        valid = false;
    }

    if (!stock || parseInt(stock.value) < 0) {
        const error = document.getElementById('item-stock-error');
        if (error) error.textContent = 'Please enter a valid stock quantity (0 or more).';
        if (stock) stock.classList.add('invalid');
        valid = false;
    }

    if (!valid) return false;

    // --- Submit new item ---
    const newItem = {
        name: name.value.trim(),
        description: description.value.trim(),
        price: parseFloat(price.value),
        category: document.getElementById('item-category').value,
        available: true,
        dietaryTags: [],
        imageUrl: ''
    };

    try {
        const res = await fetch('/menu/admin/menu-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Could not add item');
            return;
        }

        alert('Item added successfully!');
        document.getElementById('add-item-form').reset();
        renderMenuTable();
        if (typeof loadMenuItems === 'function') loadMenuItems();
    } catch (err) {
        console.error(err);
        alert('Could not add item');
    }
}

// --- WIRE UP FORMS ---
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.onsubmit = validateLogin;

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.onsubmit = validateRegister;

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.onsubmit = handleCheckout; // ✅ now calls validation + submit

    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) addItemForm.onsubmit = handleAddItem; // ✅ now calls validation + submit
});