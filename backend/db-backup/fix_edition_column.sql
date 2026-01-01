-- FIX for "column edition cannot be cast automatically to type integer"
-- Run this in your PostgreSQL database tool (pgAdmin, etc.)

BEGIN;

-- 1. Alter the column type safely
ALTER TABLE tbl_quotation_main 
ALTER COLUMN edition TYPE integer 
USING edition::integer;

COMMIT;
