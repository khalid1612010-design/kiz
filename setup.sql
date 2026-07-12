-- ============================================
-- KAIZEN Operations — Supabase Database Setup
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text,
  job_title text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 3. SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id int PRIMARY KEY DEFAULT 1,
  password text DEFAULT '2010',
  company text DEFAULT 'KAIZEN Printing',
  company_ar text DEFAULT 'كايزن للطباعة',
  seq int DEFAULT 0,
  default_dept text DEFAULT 'Sales'
);

-- 4. TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  department text,
  employee_id uuid REFERENCES employees(id),
  description text,
  quantity int DEFAULT 1,
  priority text DEFAULT 'medium',
  status text DEFAULT 'waiting',
  notes text DEFAULT '',
  created_by text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  due_date date DEFAULT CURRENT_DATE,
  archived boolean DEFAULT false
);

-- 5. TASK HISTORY
CREATE TABLE IF NOT EXISTS task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id text,
  action text,
  extra text DEFAULT '',
  actor text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- 6. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id uuid,
  title text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_department ON tasks(department);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_archived ON tasks(archived);
CREATE INDEX IF NOT EXISTS idx_tasks_task_id ON tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_history_task_id ON task_history(task_id);
CREATE INDEX IF NOT EXISTS idx_notif_emp ON notifications(emp_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES (allow anon access for internal app)
-- ============================================
DO $$ BEGIN
  CREATE POLICY anon_all_departments ON departments FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY anon_all_employees ON employees FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY anon_all_settings ON settings FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY anon_all_tasks ON tasks FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY anon_all_history ON task_history FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY anon_all_notifs ON notifications FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- SEED DATA — Departments
-- ============================================
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Designer'),
  ('Operation'),
  ('Accounting'),
  ('CEO Assistant')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED DATA — Employees
-- ============================================
INSERT INTO employees (name, department, job_title) VALUES
  ('محمد علي', 'Accounting', 'Accountant'),
  ('يوسف', 'Operation', 'Operations'),
  ('محمد', 'Operation', 'Operations'),
  ('مهاب', 'Designer', 'Designer'),
  ('سهيلة', 'Sales', 'Sales'),
  ('رحما', 'Sales', 'Sales'),
  ('Mai', 'Sales', 'Sales'),
  ('Alaa', 'CEO Assistant', 'CEO Assistant');

-- ============================================
-- SEED DATA — Settings
-- ============================================
INSERT INTO settings (id, password, company, company_ar, seq, default_dept)
VALUES (1, '2010', 'Kaizen Adv. Agency', 'كايزن للدعاية والإعلان', 0, 'Sales')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE employees;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- DONE! Reload the KAIZEN app page.
-- ============================================
