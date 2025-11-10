# Troubleshooting Login Issues

## ✅ Setup Verified
- Database connection: ✅ Working
- Owner account exists: ✅ Found
- JWT_SECRET: ✅ Set
- Backend server: ✅ Running on port 5000

## 🔧 Steps to Fix Login

### 1. Restart Backend Server
The backend server needs to be restarted to pick up the latest code changes with improved error logging.

**Stop the current backend server:**
- Find the process: `netstat -ano | findstr ":5000"`
- Kill the process or press Ctrl+C in the terminal where it's running

**Start the backend server:**
```bash
cd Backend
npm run dev
```

### 2. Verify Frontend is Running
Make sure the frontend is running on port 5173:
```bash
cd frontend
npm run dev
```

### 3. Check Browser Console
1. Open http://localhost:5173
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Try to login
5. Check for any error messages

### 4. Check Backend Logs
When you try to login, you should see logs in the backend terminal:
- `Login attempt for email: owner@example.com`
- `User found: owner@example.com, role: owner`
- `Password verified for user: owner@example.com`
- `Login successful for user: owner@example.com`

If you see "Password mismatch", the password hash might be incorrect.

### 5. Test Login Directly
You can test the login API directly using curl or Postman:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"admin123"}'
```

### 6. Common Issues

#### Issue: "Invalid credentials"
- **Solution**: Verify the user exists: `node scripts/checkUsers.js`
- **Solution**: Recreate the user: `node scripts/createOwnerDirect.js owner@example.com admin123 Owner`

#### Issue: "Network Error" or CORS error
- **Solution**: Make sure backend is running on port 5000
- **Solution**: Check CORS configuration in `Backend/server.js`

#### Issue: "Server configuration error"
- **Solution**: Make sure JWT_SECRET is set in `.env` file

#### Issue: Database connection error
- **Solution**: Verify MySQL is running
- **Solution**: Check `.env` file has correct database credentials
- **Solution**: Test connection: `node scripts/verifySetup.js`

## 🔍 Debugging Steps

1. **Check if backend is receiving requests:**
   - Look for logs in backend terminal when you try to login
   - You should see: `POST /api/auth/login`

2. **Check browser network tab:**
   - Open Developer Tools → Network tab
   - Try to login
   - Look for the `/api/auth/login` request
   - Check the request/response details

3. **Verify credentials:**
   - Email: `owner@example.com`
   - Password: `admin123`
   - Make sure there are no extra spaces

4. **Clear browser cache:**
   - Clear localStorage: `localStorage.clear()` in browser console
   - Try logging in again

## 📞 Still Having Issues?

Run the verification script:
```bash
cd Backend
node scripts/verifySetup.js
```

This will check:
- Environment variables
- Database connection
- User account existence
- Table structure

