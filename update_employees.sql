-- Run this in Supabase SQL Editor to update employee names & add new employee

-- Change سهوليلا to سهيلة
UPDATE employees SET name = 'سهيلة' WHERE name = 'سهوليلا';

-- Add محمد (Operation) if not exists
INSERT INTO employees (name, department, job_title)
SELECT 'محمد', 'Operation', 'Operations'
WHERE NOT EXISTS (
  SELECT 1 FROM employees WHERE name = 'محمد' AND department = 'Operation'
);

-- Update company settings
UPDATE settings SET 
  company = 'Kaizen Adv. Agency',
  company_ar = 'كايزن للدعاية والإعلان'
WHERE id = 1;
