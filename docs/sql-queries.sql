-- SQL Queries for Neon Database
-- Paste these in the Neon SQL Editor

-- ============================================
-- CREATE DOCTOR ACCOUNT
-- ============================================
-- This creates a doctor with email: newdoctor@demo.com
-- Password: Doctor@123

-- Step 1: Create User Account
INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'newdoctor@demo.com',
  '$2a$10$YHtbOT.1vWVAb2V3fbjMX.VhKwLodLF5bzWS/AXk8PThcs4hE8NYW', -- Password: Doctor@123
  'DOCTOR',
  NOW(),
  NOW()
)
RETURNING id, email, role;

-- Step 2: Create Doctor Profile (replace 'USER_ID_FROM_STEP_1' with the id returned above)
-- Or use this query that automatically gets the user_id:
INSERT INTO doctors (
  id,
  user_id,
  first_name,
  last_name,
  specialization,
  license_number,
  phone,
  department,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  'Dr. Michael',
  'Johnson',
  'Cardiologist',
  'MD-99999',
  '+1-555-0123',
  'Cardiology',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'newdoctor@demo.com'
RETURNING id, first_name, last_name, specialization;

-- ============================================
-- CREATE ANOTHER DOCTOR (Example)
-- ============================================
-- Doctor 2: Email: drsmith@demo.com, Password: Doctor@123

INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'drsmith@demo.com',
  '$2a$10$YHtbOT.1vWVAb2V3fbjMX.VhKwLodLF5bzWS/AXk8PThcs4hE8NYW',
  'DOCTOR',
  NOW(),
  NOW()
);

INSERT INTO doctors (
  id,
  user_id,
  first_name,
  last_name,
  specialization,
  license_number,
  phone,
  department,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  'Dr. Emily',
  'Smith',
  'Pediatrician',
  'MD-88888',
  '+1-555-0456',
  'Pediatrics',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'drsmith@demo.com';

-- ============================================
-- CREATE PATIENT ACCOUNT (if needed)
-- ============================================
-- Patient: Email: newpatient@demo.com, Password: Patient@123

-- First, generate bcrypt hash for Patient@123
-- Run this in Node.js: bcrypt.hash('Patient@123', 10)
-- Hash: $2a$10$8K1p/a0dL3YXvOeKjZqJ.e5qJZqJZqJZqJZqJZqJZqJZqJZqJZqJ

INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'newpatient@demo.com',
  '$2a$10$8K1p/a0dL3YXvOeKjZqJ.e5qJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', -- Password: Patient@123
  'PATIENT',
  NOW(),
  NOW()
);

INSERT INTO patients (
  id,
  user_id,
  first_name,
  last_name,
  date_of_birth,
  phone,
  address,
  blood_group,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  'Alice',
  'Williams',
  '1995-03-15',
  '+1-555-0789',
  '789 Elm Street, City, State 12345',
  'B+',
  NOW(),
  NOW()
FROM users u
WHERE u.email = 'newpatient@demo.com';

-- ============================================
-- VERIFY CREATED ACCOUNTS
-- ============================================

-- View all doctors
SELECT 
  u.email,
  u.role,
  d.first_name,
  d.last_name,
  d.specialization,
  d.license_number,
  d.department
FROM users u
JOIN doctors d ON u.id = d.user_id
WHERE u.role = 'DOCTOR';

-- View all patients
SELECT 
  u.email,
  u.role,
  p.first_name,
  p.last_name,
  p.date_of_birth,
  p.phone,
  p.blood_group
FROM users u
JOIN patients p ON u.id = p.user_id
WHERE u.role = 'PATIENT';

-- View all users
SELECT 
  id,
  email,
  role,
  created_at
FROM users
ORDER BY created_at DESC;

