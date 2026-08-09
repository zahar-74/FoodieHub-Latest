/* ============================================
   OMAR: MENU.JS - Menu Rendering + Filtering
   + Item Detail Page Support
============================================ */

// Make menuItems globally accessible
let menuItems = [];
window.menuItems = [];

function getFoodEmoji(category) {
    const emojis = {
        'Pizza': '🍕',
        'Burgers': '🍔',
        'Salads': '🥗',
        'Drinks': '🥤',
        'Desserts': '🍰',
        'Pasta': '🍝'
    };
    return emojis[category] || '🍽️';
}

/**
 * Renders menu items to #menu-grid
 */
function renderMenu(items) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    if (!items || items.length === 0) {
        grid.innerHTML = '<p>No menu items found. Please try adjusting your filters.</p>';
        return;
    }

    let html = '';
    items.forEach(item => {
        html += `
            <div class="item-card" data-id="${item._id}">
                <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=Food'}"
                     alt="${item.name}"
                     class="item-image"
                     onclick="goToItem('${item._id}')"
                     onerror="this.src='https://via.placeholder.com/300x200?text=Food'">
                <div class="item-body">
                    <h3 class="item-name" onclick="goToItem('${item._id}')">${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-footer">
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" onclick="addToCartFromMenu('${item._id}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

/**
 * Navigate to item detail page
 */
function goToItem(itemId) {
    if (itemId) {
        sessionStorage.setItem('selectedItemId', itemId);
        window.location.href = '/item';
    }
}

/**
 * Add to cart from menu page
 */
function addToCartFromMenu(itemId) {
    if (typeof addToCart === 'function') {
        const items = window.menuItems || menuItems || [];
        const item = items.find(i => i._id === itemId);
        if (item) {
            addToCart(item, 1, '');
            alert(`${item.name} added to cart!`);
        } else {
            alert('Item not found');
        }
    } else {
        alert('Cart functionality not available');
    }
}

/**
 * Renders single item detail on item page
 */
function renderItemDetail() {
    console.log('renderItemDetail called');

    // Try multiple sources for menu items
    let items = [];
    if (menuItems && menuItems.length > 0) {
        items = menuItems;
    } else if (window.menuItems && window.menuItems.length > 0) {
        items = window.menuItems;
    }

    if (!items || items.length === 0) {
        console.log('No menu items found. Retrying in 500ms...');
        setTimeout(renderItemDetail, 500);
        return;
    }

    // Get the item ID from sessionStorage
    const itemId = sessionStorage.getItem('selectedItemId');
    if (!itemId) {
        document.getElementById('item-name').textContent = 'No item selected';
        return;
    }

    // Find the item
    const item = items.find(i => i._id === itemId);
    if (!item) {
        document.getElementById('item-name').textContent = 'Item not found';
        return;
    }

    // Populate the page
    const imageEl = document.getElementById('item-image');
    if (imageEl) {
        if (item.imageUrl) {
            imageEl.src = item.imageUrl;
            imageEl.alt = item.name;
            imageEl.onerror = function () {
                this.outerHTML = `<div style="display:flex; align-items:center; justify-content:center; background:#ffe79a; height:200px; font-size:4rem; border-radius:8px 8px 0 0;">${getFoodEmoji(item.category)}</div>`;
            };
        } else {
            imageEl.outerHTML = `<div style="display:flex; align-items:center; justify-content:center; background:#ffe79a; height:200px; font-size:4rem; border-radius:8px 8px 0 0;">${getFoodEmoji(item.category)}</div>`;
        }
    }

    const nameEl = document.getElementById('item-name');
    if (nameEl) nameEl.textContent = item.name;

    const descEl = document.getElementById('item-description');
    if (descEl) descEl.textContent = item.description;

    const priceEl = document.getElementById('item-price');
    if (priceEl) priceEl.textContent = `$${item.price.toFixed(2)}`;

    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.onclick = function () {
            const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
            const customizations = document.getElementById('item-customizations').value || '';
            if (typeof addToCart === 'function') {
                addToCart(item, quantity, customizations);
            }
            alert(`${item.name} added to cart!`);
            window.location.href = '/cart';
        };
    }

    console.log('Item detail rendered successfully!');
}

/**
 * Filters menu items based on category, price, and diet
 */
function filterMenu() {
    const category = document.getElementById('category-filter')?.value || 'all';
    const maxPrice = parseFloat(document.getElementById('price-filter')?.value) || Infinity;
    const diet = document.getElementById('diet-filter')?.value || 'all';

    let filtered = [...menuItems];

    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    if (maxPrice > 0) {
        filtered = filtered.filter(item => item.price <= maxPrice);
    }
    if (diet !== 'all') {
        filtered = filtered.filter(item => item.dietaryTags && item.dietaryTags.includes(diet));
    }

    renderMenu(filtered);
}

/**
 * Initializes filter event listeners
 */
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const dietFilter = document.getElementById('diet-filter');

    if (categoryFilter) categoryFilter.addEventListener('change', filterMenu);
    if (priceFilter) {
        priceFilter.addEventListener('input', function () {
            const value = document.getElementById('price-filter-value');
            if (value) value.textContent = '$' + this.value;
            filterMenu();
        });
    }
    if (dietFilter) dietFilter.addEventListener('change', filterMenu);
}

/**
 * Receives data from fetch.js and renders the menu
 */
function setMenuItems(items) {
    console.log('setMenuItems called with', items?.length || 0, 'items');
    menuItems = items || [];
    window.menuItems = menuItems;
    renderMenu(menuItems);
    setupFilters();

    if (document.getElementById('item-detail')) {
        setTimeout(renderItemDetail, 100);
    }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('menu.js DOM loaded');

    if (document.getElementById('item-detail')) {
        setTimeout(renderItemDetail, 300);
    } else if (menuItems && menuItems.length > 0) {
        renderMenu(menuItems);
        setupFilters();
    }
});

// Listen for storage changes
window.addEventListener('storage', function (e) {
    if (e.key === 'selectedItemId' && document.getElementById('item-detail')) {
        renderItemDetail();
    }
});

// Export for global use
window.goToItem = goToItem;
window.filterMenu = filterMenu;
window.setMenuItems = setMenuItems;
window.renderItemDetail = renderItemDetail;
window.addToCartFromMenu = addToCartFromMenu;