/* ============================================
   MAZEN: ADMIN.JS - Admin Dashboard & Orders
============================================ */

let currentUser = { role: 'customer' };

function toggleAdminLinks() {
    const adminElements = document.querySelectorAll('.admin-only');
    const isAdmin = currentUser.role === 'admin';
    adminElements.forEach(el => {
        if (isAdmin) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

window.toggleUserRole = function () {
    currentUser.role = currentUser.role === 'customer' ? 'admin' : 'customer';
    toggleAdminLinks();
    renderAdminTables();
    renderMenuTable();
    console.log('Current role:', currentUser.role);
};

function renderAdminTables() {
    const mockOrders = [
        { id: 'o1', customer: 'John Doe', items: 3, total: 24.97, status: 'Placed' },
        { id: 'o2', customer: 'Jane Smith', items: 2, total: 16.98, status: 'Preparing' },
        { id: 'o3', customer: 'Bob Wilson', items: 1, total: 9.99, status: 'Out for Delivery' },
        { id: 'o4', customer: 'Alice Brown', items: 4, total: 35.96, status: 'Delivered' }
    ];

    const ordersTable = document.getElementById('admin-orders-table');
    if (ordersTable) {
        const tbody = ordersTable.querySelector('tbody');
        if (tbody) {
            let html = '';
            mockOrders.forEach(order => {
                html += `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.items}</td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td><span class="status-badge status-${order.status.replace(/ /g, '-').toLowerCase()}">${order.status}</span></td>
                        <td>
                            <button class="action-btn update-status" onclick="updateOrderStatus('${order.id}')">Update</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }
    }

    const totalOrders = document.getElementById('total-orders');
    const totalRevenue = document.getElementById('total-revenue');
    const pendingOrders = document.getElementById('pending-orders');
    if (totalOrders) totalOrders.textContent = mockOrders.length;
    if (totalRevenue) {
        const revenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
        totalRevenue.textContent = `$${revenue.toFixed(2)}`;
    }
    if (pendingOrders) {
        const pending = mockOrders.filter(o => o.status !== 'Delivered');
        pendingOrders.textContent = pending.length;
    }
}

function updateOrderStatus(orderId) {
    const statuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentStatus = prompt(`Enter new status for order #${orderId}:\n${statuses.join(', ')}`);
    if (currentStatus && statuses.includes(currentStatus)) {
        alert(`Order #${orderId} updated to "${currentStatus}" (Demo mode)`);
        renderAdminTables();
    }
}

function renderMenuTable() {
    const menuTable = document.getElementById('admin-menu-table');
    if (!menuTable) return;

    const items = window.menuItems || menuItems || [];
    const tbody = menuTable.querySelector('tbody');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No menu items found.</td></tr>';
        return;
    }

    let html = '';
    items.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.available ? '✅ Available' : '❌ Unavailable'}</td>
                <td>
                    <button class="action-btn edit" onclick="editMenuItem('${item.id}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteMenuItem('${item.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function editMenuItem(itemId) {
    const items = window.menuItems || menuItems || [];
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const newName = prompt('Edit item name:', item.name);
    if (newName) {
        item.name = newName;
        const newPrice = prompt('Edit item price:', item.price);
        if (newPrice) {
            item.price = parseFloat(newPrice);
            renderMenuTable();
            if (typeof renderMenu === 'function') renderMenu(items);
            alert('Item updated!');
        }
    }
}

function deleteMenuItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        const items = window.menuItems || menuItems || [];
        const index = items.findIndex(i => i.id === itemId);
        if (index !== -1) {
            items.splice(index, 1);
            window.menuItems = items;
            renderMenuTable();
            if (typeof renderMenu === 'function') renderMenu(items);
            alert('Item deleted!');
        }
    }
}

function startTracking() {
    const statusText = document.getElementById('status-text');
    const steps = document.querySelectorAll('.step');
    if (!statusText) return;

    const statuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    let index = 0;
    statusText.textContent = statuses[0];

    function updateStepper(idx) {
        steps.forEach((step, i) => {
            if (i <= idx) {
                step.classList.add('active');
                step.classList.remove('inactive');
            } else {
                step.classList.remove('active');
                step.classList.add('inactive');
            }
        });
    }

    function nextStatus() {
        index++;
        if (index < statuses.length) {
            statusText.textContent = statuses[index];
            updateStepper(index);
            const nextDelay = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
            setTimeout(nextStatus, nextDelay);
        } else {
            statusText.textContent = '✅ Order Delivered!';
        }
    }

    const firstDelay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    setTimeout(nextStatus, firstDelay);
}

document.addEventListener('DOMContentLoaded', function () {
    toggleAdminLinks();
    renderAdminTables();
    renderMenuTable();

    if (document.getElementById('status-text')) {
        startTracking();
    }
});