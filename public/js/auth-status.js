// auth-status.js – handles nav visibility and user info

async function updateNav() {
    try {
        const res = await fetch('/me');
        const data = await res.json();
        const isLoggedIn = data.role !== null && data.role !== undefined;

        const loginItem = document.getElementById('nav-login-item');
        const registerItem = document.getElementById('nav-register-item');
        const logoutItem = document.getElementById('nav-logout-item');

        if (loginItem) loginItem.style.display = isLoggedIn ? 'none' : 'inline-block';
        if (registerItem) registerItem.style.display = isLoggedIn ? 'none' : 'inline-block';
        if (logoutItem) logoutItem.style.display = isLoggedIn ? 'inline-block' : 'none';

        // Store role for other uses (optional)
        if (data.role) {
            sessionStorage.setItem('userRole', data.role);
        } else {
            sessionStorage.removeItem('userRole');
        }
    } catch (err) {
        console.error('Error fetching user status:', err);
        // Default to logged out
        const loginItem = document.getElementById('nav-login-item');
        const registerItem = document.getElementById('nav-register-item');
        const logoutItem = document.getElementById('nav-logout-item');
        if (loginItem) loginItem.style.display = 'inline-block';
        if (registerItem) registerItem.style.display = 'inline-block';
        if (logoutItem) logoutItem.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateNav();
});