/* ============================================
   MARWAN: VALIDATION.JS - All Form Validation
============================================ */

function clearAllErrors() {
    const errorSpans = document.querySelectorAll('.error-message');
    errorSpans.forEach(el => el.textContent = '');
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

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

    return valid;
}

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

function validateCheckout() {
    clearAllErrors();
    let valid = true;
    const address = document.getElementById('delivery-address');
    const scheduleTime = document.getElementById('schedule-time');

    if (!address || address.value.trim() === '') {
        alert('Please enter a delivery address.');
        valid = false;
    }

    if (scheduleTime && scheduleTime.value) {
        const selectedDate = new Date(scheduleTime.value);
        const now = new Date();
        if (selectedDate < now) {
            alert('Please select a future date and time for scheduling.');
            valid = false;
        }
    }

    if (typeof cart !== 'undefined' && cart.length === 0) {
    alert('Your cart is empty.');
    valid = false;
}

    if (valid) {
        alert('Order placed successfully! (Demo mode)');
        if (typeof cart !== 'undefined') {
            cart = [];
            if (typeof updateCartUI === 'function') updateCartUI();
        }
        window.location.href = 'order-tracking.html';
    }

    return valid;
}

function validateAddItem() {
    clearAllErrors();
    let valid = true;
    const name = document.getElementById('item-name');
    const price = document.getElementById('item-price');
    const stock = document.getElementById('item-stock');

    if (!name || name.value.trim() === '') {
        alert('Item name is required.');
        valid = false;
    }

    if (!price || parseFloat(price.value) <= 0) {
        alert('Please enter a valid price (greater than 0).');
        valid = false;
    }

    if (!stock || parseInt(stock.value) < 0) {
        alert('Please enter a valid stock quantity (0 or more).');
        valid = false;
    }

    if (valid) {
        alert('Item added to menu! (Demo mode)');
        if (typeof loadMenuItems === 'function') {
            loadMenuItems();
        }
        document.getElementById('add-item-form').reset();
    }

    return valid;
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.onsubmit = validateLogin;

    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.onsubmit = validateRegister;

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.onsubmit = validateCheckout;

    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) addItemForm.onsubmit = validateAddItem;
});