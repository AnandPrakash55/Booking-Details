-- Migration script to change seat_no to amount in bookings table
-- Run this if you have an existing database with seat_no column

USE booking_db;

-- Add the new amount column
ALTER TABLE bookings ADD COLUMN amount DECIMAL(10,2) NULL;

-- Copy data from seat_no to amount (if you want to preserve existing data)
-- UPDATE bookings SET amount = seat_no WHERE amount IS NULL;

-- Drop the old seat_no column
ALTER TABLE bookings DROP COLUMN seat_no;

-- Make amount NOT NULL (uncomment if you want to enforce it)
-- ALTER TABLE bookings MODIFY COLUMN amount DECIMAL(10,2) NOT NULL;

