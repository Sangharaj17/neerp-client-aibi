-- Create tbl_password_reset_otp table for password reset OTP functionality
-- Run this script on each tenant database

-- Drop table if exists (for clean reinstall)
-- DROP TABLE IF EXISTS tbl_password_reset_otp CASCADE;

CREATE TABLE IF NOT EXISTS tbl_password_reset_otp (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    invalidated BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_email ON tbl_password_reset_otp(email);

-- Verify table was created
SELECT 'Table tbl_password_reset_otp created successfully' AS status;

