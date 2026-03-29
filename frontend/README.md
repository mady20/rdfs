# VestaPay Frontend

React-based frontend for VestaPay internal finance platform. Complete role-based access control and real-time dashboard.

## Setup Instructions

### Prerequisites
- Node.js 14+ installed
- Backend API running on `http://localhost:5000/api`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── assets/                 # Stylesheets
│   └── styles/            # CSS files (variables, global, layout, forms, tables, dashboard)
├── api/                   # API client
│   └── axios.js          # Axios instance with interceptors
├── components/           # React components
│   ├── common/           # Reusable UI components (Button, Input, Select, Card, Table, Modal, etc.)
│   └── layout/           # Layout components (Sidebar, Header, PageLayout)
├── context/              # React Context
│   └── AuthContext.js   # Authentication state management
├── pages/                # Page components
│   ├── auth/            # Authentication pages (LoginPage)
│   ├── admin/           # Admin dashboard pages (6 pages)
│   ├── distributor/     # Distributor pages (4 pages)
│   ├── retailer/        # Retailer pages (4 pages)
│   └── profile/         # Profile pages (ProfilePage, ChangePasswordPage)
├── utils/               # Utility functions and constants
│   ├── constants.js     # Enums and constants
│   └── helpers.js       # Helper functions
├── App.js              # Main App component
├── AppRoutes.js       # Route definitions
└── index.js           # React entry point
```

## Key Features

- **Role-Based Access Control**: Admin, Distributor, and Retailer roles with specific permissions
- **Authentication**: JWT-based authentication with automatic token refresh
- **Dashboard**: Role-specific dashboards with key metrics
- **User Management**: Create, edit, and manage users (Admin only)
- **Wallet Management**: Wallet balance tracking and transactions (Admin CRUD)
- **Transactions**: Create and manage transactions with status tracking
- **Ledger History**: Complete audit trail of all wallet transactions
- **Profile Management**: Update personal information and change password
- **Retailer Transfer**: Distributor can transfer wallet balance to retailers

## Admin Pages
- **Dashboard**: Overview with total users, distributors, retailers, and wallet balance
- **Distributors**: Create, edit, delete, and toggle status of distributors
- **Retailers**: Create, edit, delete, assign to distributor, and toggle status
- **User Form**: Reusable form for creating/editing distributors and retailers
- **Wallet Management**: View all wallets, adjust balance, view ledger history
- **Transaction Management**: Filter by type/status, update status, delete transactions

## Distributor Pages
- **Dashboard**: Personal wallet balance and recent retailer transactions
- **My Retailers**: Manage assigned retailers (create, edit, toggle status)
- **Wallet**: View balance, transfer to retailers, view ledger
- **Transactions**: View all retailer transactions with filters

## Retailer Pages
- **Dashboard**: Personal wallet balance and recent transactions
- **Wallet**: View balance and ledger history
- **Transactions**: Create, filter, and view transactions
- **Create Transaction**: Create new transaction with optional wallet deduction

## Profile Pages
- **Profile**: Edit personal information (name, phone, address)
- **Change Password**: Update account password

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from create-react-app

## Dependencies

- react: 18.2.0
- react-router-dom: 6.16.0
- axios: 1.4.0

## Backend Configuration

The frontend expects the backend API at:
```
http://localhost:5000/api
```

This is configured in `src/api/axios.js`

## Demo Credentials

### Admin
- Email: admin@vestapay.com
- Password: admin123

### Distributor
- Email: distributor@vestapay.com
- Password: distributor123

### Retailer
- Email: retailer@vestapay.com
- Password: retailer123

## Design System

- **Primary Color**: #3525cd (Indigo)
- **Sidebar**: 280px fixed left navigation
- **Header**: Sticky top with backdrop blur
- **Spacing**: 4px to 32px scale using CSS variables
- **Typography**: Plus Jakarta Sans (headlines), Inter (body)
- **Components**: Card-based layout with hover effects

## Notes

- All API requests automatically attach JWT token from localStorage
- Unauthenticated requests redirect to login page
- All timestamps are formatted as "DD Mon YYYY HH:MM"
- All amounts are formatted as currency (₹XX.XX)
- Role-based sidebar menu updates dynamically based on user role
- Page layout includes sidebar and header for authenticated users
- Login page is public and shows demo credentials

## Role-Based Navigation

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/distributors` - Manage distributors
- `/admin/retailers` - Manage retailers
- `/admin/wallets` - Manage wallets
- `/admin/transactions` - Manage transactions
- `/profile` - View/edit profile
- `/change-password` - Change password

### Distributor Routes
- `/distributor/dashboard` - Dashboard
- `/distributor/retailers` - Manage retailers
- `/distributor/wallet` - View wallet & transfer
- `/distributor/transactions` - View transactions
- `/profile` - View/edit profile
- `/change-password` - Change password

### Retailer Routes
- `/retailer/dashboard` - Dashboard
- `/retailer/wallet` - View wallet
- `/retailer/transactions` - View transactions
- `/retailer/transactions/create` - Create transaction
- `/profile` - View/edit profile
- `/change-password` - Change password

## Features

- Role-based authentication (Admin, Distributor, Retailer)
- User management (CRUD)
- Wallet management with ledger tracking
- Transaction creation and viewing
- Profile management
- Responsive admin panel UI
- Role-based authorization
