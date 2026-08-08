/* ============================================
   ADMIN.JS - Admin Dashboard & Orders (Real API)
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

// ===== ADMIN ORDERS =====
async function renderAdminTables() {
    try {
        const response = await fetch('/admin/orders');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const orders = await response.json();

        const ordersTable = document.getElementById('admin-orders-table');
        if (ordersTable) {
            const tbody = ordersTable.querySelector('tbody');
            if (tbody) {
                let html = '';
                orders.forEach(order => {
                    html += `
                        <tr>
                            <td>#${order._id.slice(-6)}</td>
                            <td>${order.customerId?.name || 'Unknown'}</td>
                            <td>${order.items.length}</td>
                            <td>$${order.total?.toFixed(2) || '0.00'}</td>
                            <td><span class="status-badge status-${order.status?.replace(/ /g, '-').toLowerCase() || 'placed'}">${order.status || 'Placed'}</span></td>
                            <td>
                                <button class="action-btn update-status" onclick="updateOrderStatus('${order._id}')">Update</button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            }
        }

        // Update dashboard stats
        const totalOrders = document.getElementById('total-orders');
        const totalRevenue = document.getElementById('total-revenue');
        const pendingOrders = document.getElementById('pending-orders');
        if (totalOrders) totalOrders.textContent = orders.length;
        if (totalRevenue) {
            const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
            totalRevenue.textContent = `$${revenue.toFixed(2)}`;
        }
        if (pendingOrders) {
            const pending = orders.filter(o => o.status !== 'Delivered');
            pendingOrders.textContent = pending.length;
        }
    } catch (err) {
        console.error('Error loading orders:', err);
        alert('Could not load orders. Please refresh.');
    }
}

async function updateOrderStatus(orderId) {
    try {
        // Get current status from the table or ask user
        const newStatus = prompt('Enter new status (Placed, Preparing, Out for Delivery, Delivered):');
        if (!newStatus) return;
        const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
        if (!validStatuses.includes(newStatus)) {
            alert('Invalid status. Please use: ' + validStatuses.join(', '));
            return;
        }

        const response = await fetch(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Could not update order status');
            return;
        }

        window.location.reload();
    } catch (err) {
        console.error(err);
        alert('Could not update order status');
    }
}

// ===== ADMIN MENU MANAGEMENT =====
async function renderMenuTable() {
    const menuTable = document.getElementById('admin-menu-table');
    if (!menuTable) return;

    try {
        const response = await fetch('/menu');
        if (!response.ok) {
            throw new Error('Failed to fetch menu');
        }
        const items = await response.json();

        const tbody = menuTable.querySelector('tbody');
        if (!tbody) return;

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No menu items found.</td></tr>';
            return;
        }

        let html = '';
        items.forEach(item => {
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.category || 'Uncategorized'}</td>
                    <td>$${item.price?.toFixed(2) || '0.00'}</td>
                    <td>${item.available ? '✅ Available' : '❌ Unavailable'}</td>
                    <td>
                        <button class="action-btn edit" onclick="editMenuItem('${item._id}')">Edit</button>
                        <button class="action-btn delete" onclick="deleteMenuItem('${item._id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (err) {
        console.error('Error loading menu:', err);
        alert('Could not load menu. Please refresh.');
    }
}

async function editMenuItem(itemId) {
    try {
        // Fetch current item data
        const response = await fetch(`/menu/${itemId}`);
        if (!response.ok) {
            alert('Item not found');
            return;
        }
        const item = await response.json();

        // Prompt for new values
        const newName = prompt('Edit item name:', item.name) || item.name;
        const newDesc = prompt('Edit item description:', item.description) || item.description;
        const newPrice = parseFloat(prompt('Edit item price:', item.price)) || item.price;
        const newCategory = prompt('Edit item category:', item.category) || item.category;
        const newAvailable = confirm('Is this item available? Click OK for Yes, Cancel for No.');

        const updatedItem = {
            name: newName,
            description: newDesc,
            price: newPrice,
            category: newCategory,
            available: newAvailable,
            dietaryTags: item.dietaryTags || [],
            imageUrl: item.imageUrl || ''
        };

        const updateResponse = await fetch(`/admin/menu-items/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
        });

        if (!updateResponse.ok) {
            const data = await updateResponse.json();
            alert(data.error || 'Update failed');
            return;
        }

        alert('Item updated successfully!');
        renderMenuTable();
        // Also update the main menu if fetch.js is used
        if (typeof loadMenuItems === 'function') loadMenuItems();
    } catch (err) {
        console.error(err);
        alert('Could not edit item');
    }
}

async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
        const response = await fetch(`/admin/menu-items/${itemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Delete failed');
            return;
        }

        alert('Item deleted successfully!');
        renderMenuTable();
        if (typeof loadMenuItems === 'function') loadMenuItems();
    } catch (err) {
        console.error(err);
        alert('Could not delete item');
    }
}

// ===== ORDER TRACKING POLLING (REAL) =====
let trackingInterval = null;

function startTracking(orderId) {
    const statusText = document.getElementById('status-text');
    const steps = document.querySelectorAll('.step');
    if (!statusText) return;

    // Function to fetch current status
    async function fetchStatus() {
        try {
            const response = await fetch(`/orders/${orderId}/status`);
            if (!response.ok) {
                throw new Error('Failed to fetch status');
            }
            const data = await response.json();
            const currentStatus = data.status || 'Placed';

            // Update text and stepper
            statusText.textContent = currentStatus;
            const statuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
            const idx = statuses.indexOf(currentStatus);
            if (idx !== -1) {
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

            // Stop polling when delivered
            if (currentStatus === 'Delivered') {
                clearInterval(trackingInterval);
                trackingInterval = null;
            }
        } catch (err) {
            console.error('Error fetching status:', err);
        }
    }

    // Poll every 3 seconds
    fetchStatus(); // initial fetch
    trackingInterval = setInterval(fetchStatus, 3000);
}

// ===== DOM INIT =====
document.addEventListener('DOMContentLoaded', function () {
    toggleAdminLinks();
    renderMenuTable();

    // If on tracking page, start polling
    const statusText = document.getElementById('status-text');
    if (statusText) {
        // Get orderId from URL or hidden input
        const orderId = window.location.pathname.split('/').pop(); // e.g., /track/123 -> 123
        if (orderId && orderId !== 'track') {
            startTracking(orderId);
        } else {
            statusText.textContent = 'No order ID found';
        }
    }
});