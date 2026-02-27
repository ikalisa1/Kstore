# Juakali Store Management System

[![GitHub Repository](https://img.shields.io/badge/GitHub-Kstore-181717?logo=github)](https://github.com/ikalisa1/Kstore)

A comprehensive store management application with dark theme. Track expenses, manage inventory, monitor product stock levels, and maintain detailed records with automatic backup functionality.

## Repository

- **GitHub**: https://github.com/ikalisa1/Kstore

## Features

- **Daily Expense Tracking**: Record and monitor all daily expenses by category
- **Product Management**: Manage product inventory with SKU, pricing, and supplier information
- **Stock Monitoring**: Automatic alerts for low stock items and stock level tracking
- **Inventory History**: Track all inventory transactions with timestamps
- **Analytics Dashboard**: View daily expenses, inventory value, and transaction history
- **Data Backup**: Automatic backup creation and management
- **User Authentication**: Secure login and user management with role-based access
- **Dark Theme**: Professional dark UI with cyan and warm accent colors

## Project Structure

```
juakali-app/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth and validation
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Main server file
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable components
    │   ├── services/        # API service
    │   ├── context/         # React context
    │   ├── styles/          # CSS files
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    └── .env.example
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```bash
   copy .env.example .env
   ```

4. Configure MongoDB URI in `.env`

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```bash
   copy .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses/daily/:date` - Get daily expenses
- `GET /api/expenses/range` - Get expenses by date range
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Products
- `GET /api/products` - Get all products
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory/history` - Get inventory history
- `POST /api/inventory/transaction` - Record transaction

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/monthly` - Get monthly analytics

### Backup
- `POST /api/backup/create` - Create backup
- `GET /api/backup/list` - List backups
- `GET /api/backup/download/:fileName` - Download backup

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 18
- React Router
- Axios
- Date-fns
- CSS3 with dark theme

## Color Scheme (Dark Theme)

- **Primary Dark**: #1a1a2e
- **Secondary Dark**: #16213e
- **Accent (Cyan)**: #00d4ff
- **Accent (Warm)**: #ff6b6b
- **Success (Green)**: #51cf66
- **Text Primary**: #e8e8e8
- **Text Secondary**: #b0b0b0

## Usage

1. **Create Account**: Register as a new user
2. **Add Products**: Create product listings with stock levels
3. **Record Expenses**: Log daily expenses by category
4. **Manage Inventory**: Track stock movements and updates
5. **Monitor Dashboard**: View real-time analytics and alerts
6. **Backup Data**: Create and download data backups

## Features in Detail

### Daily Expense Tracking
- Record expenses with amounts, categories, and payment methods
- View daily totals and historical data
- Filter by date ranges for detailed analysis

### Product Inventory
- Add products with SKU, pricing, and supplier info
- Set minimum and maximum stock thresholds
- Automatic alerts for low stock items
- Quick stock adjustment buttons

### Stock Monitoring
- Real-time inventory alerts
- Visual indicators for low stock
- Automatic stock level adjustments
- Complete transaction history

### Data Management
- Automatic backup creation
- Export functionality for data analysis
- Complete audit trail of all transactions

## Future Enhancements

- SMS/Email alerts for low stock
- Advanced analytics with charts
- Multi-location support
- Barcode scanning integration
- Mobile app version
- Supplier ordering automation

## License

MIT

## Support

For issues or questions, please contact the development team.
