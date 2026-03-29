# Fintech CRUD App - Backend

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally on 127.0.0.1:27017)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fintech_crud_app
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Running MongoDB

Make sure MongoDB is running locally:
```bash
mongod
```

## Seed Data

To populate the database with demo data:
```bash
npm run seed
```

This creates:
- Admin user (admin@example.com / Admin@123)
- Distributor user (distributor@example.com / Distributor@123)
- Retailer user (retailer@example.com / Retailer@123)
- Sample wallets with balances
- Sample transactions

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000/api`

## Demo Credentials

**Admin:**
- Email: admin@example.com
- Password: Admin@123

**Distributor:**
- Email: distributor@example.com
- Password: Distributor@123

**Retailer:**
- Email: retailer@example.com
- Password: Retailer@123

## API Documentation

All endpoints are prefixed with `/api`

### Authentication
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Users
- `POST /users/distributors` - Create distributor (admin)
- `GET /users/distributors` - Get all distributors (admin)
- `POST /users/retailers` - Create retailer (admin/distributor)
- `GET /users/retailers` - Get retailers (admin/distributor)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin)
- `PATCH /users/:id/status` - Update user status
- `PATCH /users/:id/assign-distributor` - Assign retailer to distributor (admin)

### Wallets
- `GET /wallets/my-wallet` - Get own wallet
- `GET /wallets/my-ledger` - Get own wallet ledger
- `GET /wallets/all` - Get all wallets (admin)
- `GET /wallets/ledger/:userId` - Get user ledger (admin)
- `POST /wallets/admin-adjust` - Adjust wallet balance (admin)
- `POST /wallets/transfer` - Transfer wallet balance (distributor)

### Transactions
- `POST /transactions` - Create transaction (retailer)
- `GET /transactions` - Get transactions (role-based)
- `GET /transactions/:id` - Get transaction by ID
- `PATCH /transactions/:id/status` - Update transaction status (admin)
- `DELETE /transactions/:id` - Delete transaction (admin)

### Profile
- `GET /profile/me` - Get profile
- `PUT /profile/me` - Update profile
- `PUT /profile/change-password` - Change password

### Dashboard
- `GET /dashboard/admin` - Admin dashboard (admin)
- `GET /dashboard/distributor` - Distributor dashboard (distributor)
- `GET /dashboard/retailer` - Retailer dashboard (retailer)
