/* ============================================
   MARWAN: VALIDATION.JS - All Form Validation
   (Now uses inline errors and real form submission)
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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/;

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

    return valid; // If valid, form submits normally
}

// --- REGISTER ---
function validateRegister() {
    clearAllErrors();
    let valid = true;

    const name = document.getElementById('register-name');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/;

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

// --- CHECKOUT ---
function validateCheckout() {
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

    // Cart validation – check if cart is empty
    if (typeof cart !== 'undefined' && cart.length === 0) {
        const cartError = document.getElementById('cart-error');
        if (cartError) cartError.textContent = 'Your cart is empty. Add items before checkout.';
        valid = false;
    }

    return valid; // If valid, form submits normally
}

// --- ADMIN: ADD/EDIT MENU ITEM ---
function validateAddItem() {
    clearAllErrors();
    let valid = true;

    const name = document.getElementById('item-name');
    const price = document.getElementById('item-price');
    const stock = document.getElementById('item-stock');

    if (!name || name.value.trim() === '') {
        const error = document.getElementById('item-name-error');
        if (error) error.textContent = 'Item name is required.';
        if (name) name.classList.add('invalid');
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

    return valid;
}

// --- WIRE UP FORMS ---
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.onsubmit = validateLogin;

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.onsubmit = validateRegister;

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.onsubmit = validateCheckout;

    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) addItemForm.onsubmit = validateAddItem;

    // Also wire up admin menu edit form if it exists (for admin-menu-manage.ejs)
    const editItemForm = document.getElementById('edit-item-form');
    if (editItemForm) editItemForm.onsubmit = validateAddItem;
});