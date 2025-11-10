# Backend Setup Instructions

## Prerequisites
- MySQL Server installed and running
- Node.js installed

## ⚠️ IMPORTANT: Why Login Doesn't Work

**The database doesn't exist yet!** You need to create it first before you can login.

## Setup Steps

### Option 1: Quick Setup (Recommended)

1. **Update `.env` file** with your MySQL password (if you have one):
   ```
   DB_PASSWORD=your_mysql_password
   ```

2. **Run the setup script** (it will prompt for MySQL password if needed):
   ```bash
   node scripts/setupDatabase.js
   ```

3. **Create owner account**:
   ```bash
   node scripts/createOwnerDirect.js owner@example.com admin123 Owner
   ```

### Option 2: Manual SQL Setup

1. **Update `.env` file** with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=booking_db
   JWT_SECRET=your-secret-key-change-this
   PORT=5000
   ```

2. **Run SQL file** in MySQL:
   ```bash
   mysql -u root -p < scripts/init.sql
   ```
   Or open MySQL and run the SQL commands from `scripts/init.sql`

3. **Create owner account**:
   ```bash
   node scripts/createOwnerDirect.js owner@example.com admin123 Owner
   ```

### Option 3: Using MySQL Workbench or phpMyAdmin

1. Create database: `booking_db`
2. Run the SQL from `scripts/init.sql`
3. Create owner using: `node scripts/createOwnerDirect.js owner@example.com admin123 Owner`

### 4. Start the Server
```bash
npm run dev
# or
npm start
```

## Login as Owner

After creating the owner account, you can login at:
- Frontend: http://localhost:5173
- Email: `owner@example.com` (or the email you used)
- Password: `admin123` (or the password you used)

## Troubleshooting

### "Unknown database 'booking_db'"
- The database doesn't exist. Run `node scripts/setupDatabase.js` or create it manually.

### "Access denied for user 'root'@'localhost'"
- Update `DB_PASSWORD` in `.env` file with your MySQL root password.

### "No users found"
- Create an owner account using: `node scripts/createOwnerDirect.js [email] [password] [name]`

### Check if users exist
```bash
node scripts/checkUsers.js
```

## API Endpoints

- `POST /api/auth/login` - Login (public)
- `POST /api/auth/register` - Register new user (requires owner token)
- `GET /api/auth/me` - Get current user info
- `POST /api/buses` - Add bus (owner only)
- `GET /api/buses` - Get all buses
- `POST /api/bookings` - Add booking (owner only)
- `GET /api/bookings?date=YYYY-MM-DD` - Get bookings by date

