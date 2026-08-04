FoodieHub - Data Contract 

🚨 READ THIS BEFORE YOU WRITE ANY CODE

This document is the !! single source of truth !! for all data shapes in the FoodieHub project. Every HTML page, every JavaScript function, and every JSON file must use these exact field names. If you invent your own field names, the project will break.

📦 Menu Item Object

js
{
    "id": "m1",                     // string (unique identifier)

    "name": "Margherita Pizza",      // string

    "description": "Classic tomato sauce with fresh mozzarella and basil.",  // string

    "price": 12.99,                  // number (price in dollars)

    "category": "Pizza",             // string: "Pizza" | "Burgers" | 
    
    "Salads" | "Drinks" | "Desserts" | "Pasta"

    "dietaryTags": ["vegetarian"],   // array of strings: "vegetarian" | 
    
    "vegan" | "gluten-free"

    "imageUrl": "images/pizza.jpg",  // string (path to image)

    "available": true                // boolean (true = in stock, false = sold out)

}
{
    "cartItemId": "c1",             // string (unique cart item ID)
    "menuItemId": "m1",             // string (references the menu item)
    "name": "Margherita Pizza",      // string (copy from menu item)
    "price": 8.99,                  // number (copy from menu item)
    "quantity": 2,                  // number (how many of this item)
    "customizations": "extra cheese, no basil"  // string (plain text)
}
{
    "id": "u1",                     // string (unique user ID)
    "name": "Test Customer",        // string
    "email": "test@foodiehub.com",  // string
    "role": "customer"              // string: "customer" | "admin"
}
{
    "id": "o1",                     // string (unique order ID)
    "customerId": "u1",             // string (references the user)
    "items": [                      // array of cart items
        {
            "menuItemId": "m1",
            "name": "Margherita Pizza",
            "price": 8.99,
            "quantity": 2,
            "customizations": "extra cheese"
        }
    ],
    "status": "Placed",             // string: "Placed" | "Preparing" | "Out for Delivery" | "Delivered"
    "scheduledFor": null,           // null OR ISO datetime string (e.g., "2026-07-25T14:30:00")
    "total": 17.98,                 // number (sum of all item subtotals)
    "placedAt": "2026-07-24T10:00:00" // ISO datetime string
}

🆔 Shared Container IDs (HTML + JS)
ID	Found on Page	Used By (JS)
#menu-grid	index.html	menu.js
#category-filter	index.html	menu.js
#price-filter	index.html	menu.js
#diet-filter	index.html	menu.js
#cart-items	cart.html	cart.js
#cart-total	cart.html	cart.js
#cart-badge	every page	cart.js
#schedule-time	cart.html	validation.js
#status-stepper	order-tracking.html	admin.js
#status-text	order-tracking.html	admin.js
#login-form	login.html	validation.js
#register-form	register.html	validation.js
#admin-orders-table	admin-orders.html	admin.js
#admin-menu-table	admin-menu-manage.html	admin.js
.admin-only	every page (class)	admin.js
#order-history-list	order-history.html	cart.js

📁 Folder Structure

FoodieHub/
├── index.html
├── item.html
├── cart.html
├── order-tracking.html
├── login.html
├── register.html
├── admin-dashboard.html
├── admin-orders.html
├── admin-menu-manage.html
├── order-history.html
├── CONTRACT.md          ← YOU ARE HERE
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── menu.js          ← Omar (Leader)
│   ├── cart.js          ← Omar Hassan
│   ├── validation.js    ← Marwan
│   ├── admin.js         ← Mazen
│   └── fetch.js         ← Yassin
└── data/
    └── menu.json

    🚨 Golden Rules
Never hardcode data in HTML — all dynamic content goes in empty containers.

Use exact field names from this contract — no itemName, it's name.

All IDs must match — if HTML uses #menu-grid, JS must use #menu-grid.

If you need a new field, ping the group first — don't invent silently.



