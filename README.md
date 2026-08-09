# FoodieHub – Full‑Stack Food Ordering Platform

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with:

MONGO_URL=mongodb://localhost:27017/foodiehub
JWT_SECRET=your-secret-key
PORT=3000

4. Start MongoDB locally.
5. Run `node scripts/seed.js` to seed the database with sample data.
6. Start the server with `npm start` or `npm run dev`.
7. Visit `http://localhost:3000`.

## Default Login

- Admin: `admin@foodiehub.com` / `password`
- Customer: `customer@foodiehub.com` / `password`

## Features

- Menu browsing with filtering
- Cart and checkout (with scheduling)
- Order tracking (real‑time polling)
- Admin dashboard with order and menu management
- Reviews and order history
