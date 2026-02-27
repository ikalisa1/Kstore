# 🚀 GET STARTED IN 5 MINUTES

Your Juakali Store Management System is ready! Follow these simple steps:

## Step 1: Open Two Terminals

### Terminal 1 - Backend
```bash
cd "c:\Users\Kalivan\Juakali app\backend"
npm install
```

### Terminal 2 - Frontend
```bash
cd "c:\Users\Kalivan\Juakali app\frontend"
npm install
```

## Step 2: Configure Backend

In the backend folder, create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/juakali-store
JWT_SECRET=your_super_secret_key_here_change_this
NODE_ENV=development
```

## Step 3: Configure Frontend

In the frontend folder, create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Step 4: Start Backend

In Terminal 1 (backend folder):

```bash
npm run dev
```

You should see: `Server running on port 5000`

## Step 5: Start Frontend

In Terminal 2 (frontend folder):

```bash
npm start
```

Browser will automatically open to: http://localhost:3000

## Step 6: Create Your Account

1. Click "Register" on the login page
2. Fill in your details:
   - Name: Your Name
   - Email: your@email.com
   - Password: (at least 6 characters)
3. Click "Register"
4. You'll be logged in automatically!

## Step 7: Start Using

### Add Your First Product
1. Go to "Products" in the navbar
2. Click "Add Product"
3. Fill in details:
   - Product Name: "Rice" (example)
   - SKU: "SKU001"
   - Category: "General"
   - Unit Price: "50"
   - Initial Quantity: "100"
   - Min Stock: "10"
   - Max Stock: "500"
4. Click "Save Product"

### Record Your First Expense
1. Go to "Expenses"
2. Click "Add Expense"
3. Fill in:
   - Amount: "1000"
   - Category: "supplies"
   - Description: "Bought stock items"
   - Payment Method: "cash"
4. Click "Save Expense"

### Check Your Dashboard
1. Go to "Dashboard"
2. See your today's expenses
3. See low stock items
4. See total inventory value
5. See recent transactions

### Monitor Inventory
1. Go to "Products"
2. Click "+" to add stock
3. Click "-" to remove stock
4. Go to "Inventory" to see history

## 🎨 That's It!

Your store management system is now running with:
- ✅ Daily expense tracking
- ✅ Product inventory management
- ✅ Stock monitoring with alerts
- ✅ Complete transaction history
- ✅ Analytics dashboard
- ✅ Data backup capability

## 📱 Features Overview

| Feature | Where | What It Does |
|---------|-------|--------------|
| Dashboard | Home page | See stats, expenses, stock alerts |
| Expenses | Expenses tab | Track daily spending by category |
| Products | Products tab | Manage your product catalog |
| Inventory | Inventory tab | View all stock movements |
| Backup | Dashboard button | Create data backups |

## 🆘 Troubleshooting

### "Port 5000 is already in use"
```bash
# Find what's using port 5000
netstat -ano | findstr :5000
# Kill it (replace PID with number)
taskkill /PID <PID> /F
# Then try npm run dev again
```

### "Cannot connect to MongoDB"
1. Make sure MongoDB is installed
2. Start MongoDB service
3. Use correct connection string in .env
4. Or use MongoDB Atlas (cloud):
   - Create account at mongodb.com/cloud/atlas
   - Get connection string
   - Paste in MONGODB_URI

### "Frontend won't load"
1. Backend must be running first
2. Check REACT_APP_API_URL in .env
3. Check backend is on port 5000
4. Clear browser cache and refresh

## 💡 Tips

- Change dark theme colors in `frontend/src/styles/globals.css`
- Add more expense categories in `Expenses.js`
- Customize product categories as needed
- Create multiple user accounts for staff

## 📚 Documentation

For more details, check:
- `README.md` - Full documentation
- `SETUP.md` - Detailed setup
- `ARCHITECTURE.md` - Technical details
- `START_HERE.md` - This file

---

**Ready to go?** Follow steps 1-7 above and you're done! 🎉
