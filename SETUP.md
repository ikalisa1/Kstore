# Juakali Store - Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and add your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/juakali-store
# JWT_SECRET=your_secret_key_here

# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start the development server
npm start
```

Frontend will run on `http://localhost:3000`

## First Time Users

1. **Register**: Go to /register and create a new account
2. **Login**: Use your credentials to login
3. **Dashboard**: You'll see the main dashboard with stats
4. **Add Products**: Go to Products section and add your store products
5. **Record Expenses**: Track your daily expenses
6. **Monitor Inventory**: Track stock movements

## Database Setup

### MongoDB Local Installation
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use `mongodb://localhost:27017/juakali-store` in .env

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use in .env as `MONGODB_URI`

## Configuration

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/juakali-store
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify database name

### API Connection Error
- Backend must be running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Ensure CORS is enabled

### Port Already in Use
- Change PORT in backend .env
- Change port in frontend with `PORT=3001 npm start`

## Development

### Backend Development
- Modify routes in `src/routes/`
- Add models in `src/models/`
- Use `npm run dev` for hot reload with nodemon

### Frontend Development
- Modify pages in `src/pages/`
- Add components in `src/components/`
- React hot reload enabled by default

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use MongoDB Atlas
3. Deploy to Heroku, AWS, or similar
4. Update environment variables

### Frontend
1. Build: `npm run build`
2. Deploy static files to hosting
3. Update REACT_APP_API_URL to production API
4. Use CDN for assets

## Support

For detailed documentation, see README.md
