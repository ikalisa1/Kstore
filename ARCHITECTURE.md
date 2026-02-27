# Juakali Store - Architecture & Development Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Expenses    │  │  Products    │      │
│  │   Page       │  │   Page       │  │   Page       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Navbar  │  Auth Context  │  API Service             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Dark Theme Styling (CSS)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP/HTTPS)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes  │  Controllers  │  Middleware  │  Utils     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth Routes  │  Expense Routes  │  Product Routes  │   │
│  │  Inventory Routes  │  Analytics Routes  │  Backup    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            JWT Authentication Middleware             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Users        │  │ Expenses     │  │ Products     │      │
│  │ Collections  │  │ Collections  │  │ Collections  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Inventory    │  │ Backups      │                        │
│  │ Collections  │  │ Data Files   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/manager/staff),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  sku: String (unique),
  category: String,
  unitPrice: Number,
  quantity: Number,
  minStock: Number,
  maxStock: Number,
  supplier: String,
  description: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  date: Date,
  amount: Number,
  category: String,
  description: String,
  paymentMethod: String (cash/card/mobile),
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection
```javascript
{
  _id: ObjectId,
  product: ObjectId (ref: Product),
  quantity: Number,
  type: String (in/out/adjustment),
  reason: String,
  date: Date,
  notes: String,
  createdAt: Date
}
```

## File Structure Explanation

### Backend Files

**server.js** - Main server entry point
- Initializes Express app
- Sets up middleware
- Connects to MongoDB
- Defines routes
- Error handling

**models/** - Mongoose Schemas
- User.js - User authentication
- Product.js - Product inventory
- Expense.js - Expense tracking
- Inventory.js - Stock movements

**routes/** - API Endpoints
- auth.js - Login/Register/Profile
- expenses.js - CRUD for expenses
- products.js - CRUD for products
- inventory.js - Stock transactions
- analytics.js - Dashboard data
- backup.js - Data backup/restore

**middleware/** - Express Middleware
- auth.js - JWT verification
- Validates incoming requests

### Frontend Files

**pages/** - Full Page Components
- Login.js - Authentication page
- Register.js - Account creation
- Dashboard.js - Main dashboard
- Expenses.js - Expense management
- Products.js - Product catalog
- Inventory.js - Stock history

**components/** - Reusable Components
- Navbar.js - Navigation header

**services/** - API Integration
- api.js - Axios instance
- All API calls defined here

**context/** - React Context
- AuthContext.js - Auth state management

**styles/** - Stylesheets
- globals.css - Global styles
- Auth.css - Auth page styles
- Dashboard.css - Dashboard styles
- Expenses.css - Expenses page styles
- Products.css - Products page styles
- Inventory.css - Inventory page styles
- Navbar.css - Navigation styles

## API Flow Example

### Creating an Expense

```
Frontend                          Backend                    Database
   │                              │                           │
   ├─ User fills form ────────────┤                           │
   │                              │                           │
   ├─ Submit form ────────────────┤                           │
   │  POST /api/expenses          │                           │
   │  (with auth token)           │                           │
   │                              ├─ Verify JWT token         │
   │                              │                           │
   │                              ├─ Validate input           │
   │                              │                           │
   │                              ├─ Create Expense record ──┤
   │                              │                           │
   │                              │                    Save ──┤
   │                              │                    ──────┤
   │                              │<─── Expense saved        │
   │                              │                           │
   │<─── Return new expense ──────┤                           │
   │                              │                           │
   └─ Update UI ────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User submits login form
   Email: user@example.com
   Password: password123

2. Backend validates credentials
   - Hash submitted password
   - Compare with stored hash
   - If match:

3. Generate JWT token
   jwt.sign({ userId: user._id }, SECRET)
   Token expires in 7 days

4. Return token to frontend
   localStorage.setItem('token', token)

5. All subsequent requests include token
   Authorization: Bearer <token>

6. Middleware verifies token on each request
   jwt.verify(token, SECRET)

7. If valid, proceed with request
   If invalid, return 401 error
```

## Data Flow

### Creating a Product

```
Frontend Form Input
    ↓
Client-side Validation
    ↓
API Call: POST /api/products
    ↓
Backend Receives Request
    ↓
JWT Verification (Middleware)
    ↓
Input Validation
    ↓
Create Product Document
    ↓
Save to MongoDB
    ↓
Return Success + Product Data
    ↓
Update Frontend State
    ↓
Refresh Product List
```

### Recording Inventory Transaction

```
Frontend: User clicks + or - on product
    ↓
Get product ID and change amount
    ↓
Call: POST /api/inventory/transaction
    ↓
Backend Receives Request
    ↓
Find Product by ID
    ↓
Update Product Quantity
    ↓
Create Inventory Record
    ↓
Save Both to MongoDB
    ↓
Return Transaction Data
    ↓
Update Frontend
```

## Development Workflow

### Adding a New Feature

1. **Backend**
   - Create model in `models/` (if needed)
   - Add route in `routes/`
   - Implement logic in controller
   - Add auth middleware

2. **Frontend**
   - Add page in `pages/`
   - Create API service call
   - Add styling in `styles/`
   - Update routing in `App.js`

### Example: Adding "Revenue" Tracking

**Backend:**
```javascript
// 1. Create model: models/Revenue.js
const revenueSchema = new Schema({
  date: Date,
  amount: Number,
  source: String,
  // ...
});

// 2. Create route: routes/revenue.js
router.post('/', auth, async (req, res) => {
  // Save revenue
});

// 3. Add to server.js
app.use('/api/revenue', require('./routes/revenue'));
```

**Frontend:**
```javascript
// 1. Add API call in services/api.js
export const revenueAPI = {
  getRevenue: () => api.get('/revenue'),
  createRevenue: (data) => api.post('/revenue', data)
};

// 2. Create page: pages/Revenue.js
const Revenue = () => {
  // Component logic
};

// 3. Update App.js routes
<Route path="/revenue" element={<Revenue />} />

// 4. Add to Navbar
<a href="/revenue">Revenue</a>
```

## Performance Optimization

### Backend
- MongoDB indexing on frequently searched fields
- Pagination for large datasets
- Request validation to prevent bad data
- JWT for stateless authentication

### Frontend
- Component lazy loading
- CSS optimization
- API response caching
- Efficient state management

## Security Best Practices

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Environment variables for secrets
- CORS enabled for frontend origin only
- Input validation on both sides
- Secure error messages (no data leaks)

## Testing

### Backend Routes
```bash
# Test endpoints with Postman or curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Frontend Components
- React component testing ready
- Can be extended with Jest

## Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (production database)
- [ ] Set strong JWT_SECRET
- [ ] Update API_URL in frontend
- [ ] Enable CORS for production domain
- [ ] Use HTTPS in production
- [ ] Set up environment variables
- [ ] Test all features in staging
- [ ] Create database backups
- [ ] Set up monitoring/logging

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues
- Check MongoDB is running
- Verify connection string
- Check firewall settings
- Verify IP whitelist (Atlas)

### CORS Errors
- Ensure backend running
- Check REACT_APP_API_URL
- Verify CORS in server.js
- Check frontend port

## Next Steps

1. Install dependencies
2. Configure MongoDB
3. Start backend server
4. Start frontend server
5. Register test account
6. Add test data
7. Explore features
8. Customize as needed

## Additional Resources

- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- React: https://react.dev/
- Mongoose: https://mongoosejs.com/
