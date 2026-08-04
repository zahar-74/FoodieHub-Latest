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
            <div class="item-card" data-id="${item.id}">
                <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=Food'}" 
                     alt="${item.name}" 
                     class="item-image"
                     onclick="goToItem('${item.id}')"
                     onerror="this.src='https://via.placeholder.com/300x200?text=Food'">
                <div class="item-body">
                    <h3 class="item-name" onclick="goToItem('${item.id}')">${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-footer">
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
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
        window.location.href = 'item.html';
    }
}

/**
 * Renders single item detail on item.html page
 * FIXED: Better data loading and error handling
 */
function renderItemDetail() {
    console.log('renderItemDetail called');
    console.log('menuItems:', menuItems);
    console.log('window.menuItems:', window.menuItems);

    // Try multiple sources for menu items
    let items = [];

    // Try local menuItems first
    if (menuItems && menuItems.length > 0) {
        items = menuItems;
    }
    // Try window.menuItems second
    else if (window.menuItems && window.menuItems.length > 0) {
        items = window.menuItems;
    }

    console.log('Using items:', items);

    if (!items || items.length === 0) {
        console.log('No menu items found. Retrying in 500ms...');
        setTimeout(renderItemDetail, 500);
        return;
    }

    // Get the item ID from sessionStorage
    const itemId = sessionStorage.getItem('selectedItemId');
    console.log('Selected item ID:', itemId);

    if (!itemId) {
        document.getElementById('item-name').textContent = 'No item selected';
        console.log('No item ID found in sessionStorage');
        return;
    }

    // Find the item
    const item = items.find(i => i.id === itemId);
    console.log('Found item:', item);

    if (!item) {
        document.getElementById('item-name').textContent = 'Item not found';
        console.log('Item with ID ' + itemId + ' not found');
        return;
    }

    // Populate the page
    console.log('Populating item detail for:', item.name);

    // Image
    const imageEl = document.getElementById('item-image');
    if (imageEl) {
        const imageUrl = item.imageUrl || '';
        if (imageUrl) {
            imageEl.src = imageUrl;
            imageEl.alt = item.name;
            imageEl.onerror = function () {
                console.log('Image failed to load, showing emoji fallback');
                this.outerHTML = `<div style="display:flex; align-items:center; justify-content:center; background:#ffe79a; height:200px; font-size:4rem; border-radius:8px 8px 0 0;">${getFoodEmoji(item.category)}</div>`;
            };
        } else {
            // No image URL, show emoji directly
            imageEl.outerHTML = `<div style="display:flex; align-items:center; justify-content:center; background:#ffe79a; height:200px; font-size:4rem; border-radius:8px 8px 0 0;">${getFoodEmoji(item.category)}</div>`;
        }
    }

    // Name
    const nameEl = document.getElementById('item-name');
    if (nameEl) nameEl.textContent = item.name;

    // Description
    const descEl = document.getElementById('item-description');
    if (descEl) descEl.textContent = item.description;

    // Price
    const priceEl = document.getElementById('item-price');
    if (priceEl) priceEl.textContent = `$${item.price.toFixed(2)}`;

    // Add to Cart button
    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.onclick = function () {
            const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
            const customizations = document.getElementById('item-customizations').value || '';
            if (typeof addToCart === 'function') {
                addToCart(item, quantity, customizations);
            }
            alert(`${item.name} added to cart!`);
            window.location.href = 'cart.html';
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

    console.log('Filtering - Category:', category, 'Max Price:', maxPrice, 'Diet:', diet);

    let filtered = [...menuItems];

    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
        console.log('After category filter:', filtered.length, 'items');
    }
    if (!isNaN(maxPrice) && maxPrice > 0) {
        filtered = filtered.filter(item => item.price <= maxPrice);
        console.log('After price filter:', filtered.length, 'items');
    }
    if (diet !== 'all') {
        filtered = filtered.filter(item => item.dietaryTags && item.dietaryTags.includes(diet));
        console.log('After diet filter:', filtered.length, 'items');
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
    console.log('setMenuItems called with', items.length, 'items');
    menuItems = items;
    window.menuItems = items;
    renderMenu(menuItems);
    setupFilters();

    // If we're on item detail page, render it
    if (document.getElementById('item-detail')) {
        console.log('On item detail page, rendering...');
        setTimeout(renderItemDetail, 100);
    }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, menuItems length:', menuItems.length);

    if (document.getElementById('item-detail')) {
        console.log('Item detail page detected');
        // Wait a bit for data to load
        setTimeout(renderItemDetail, 300);
    } else if (menuItems && menuItems.length > 0) {
        renderMenu(menuItems);
        setupFilters();
    }
});

// Also listen for sessionStorage changes (when returning to page)
window.addEventListener('storage', function (e) {
    if (e.key === 'selectedItemId' && document.getElementById('item-detail')) {
        console.log('Storage event: selectedItemId changed');
        renderItemDetail();
    }
});