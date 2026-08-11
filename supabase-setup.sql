-- =============================================================
-- KAIZEN — Customer Follow-up System
-- Simple setup — NO Supabase Auth, NO emails.
-- Sales: tap your name • Admin: PIN 2010 (handled in app.js)
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to run more than once.
-- =============================================================

-- ============ 1) LEVELS ============
create table if not exists public.customer_levels (
  key        text primary key,
  name_ar    text not null,
  name_en    text not null,
  sort_order smallint default 0
);

insert into public.customer_levels (key, name_ar, name_en, sort_order)
values ('level_1','المستوى الأول','Level 1',1)  on conflict (key) do nothing;
insert into public.customer_levels (key, name_ar, name_en, sort_order)
values ('level_2','المستوى الثاني','Level 2',2) on conflict (key) do nothing;
insert into public.customer_levels (key, name_ar, name_en, sort_order)
values ('level_3','المستوى الثالث','Level 3',3) on conflict (key) do nothing;


-- ============ 2) EMPLOYEES ============
create table if not exists public.employees (
  id         uuid primary key default gen_random_uuid(),
  name_ar    text not null,
  name_en    text not null,
  role       text not null default 'sales',
  active     boolean not null default true,
  sort_order smallint default 0,
  created_at timestamptz default now()
);

-- unique name so re-running the script never duplicates rows
create unique index if not exists uq_employees_name_en on public.employees(name_en);

insert into public.employees (name_ar, name_en, role, sort_order)
values ('الإدارة','Admin','admin',0)   on conflict (name_en) do nothing;
insert into public.employees (name_ar, name_en, role, sort_order)
values ('مي','Mai','sales',1)          on conflict (name_en) do nothing;
insert into public.employees (name_ar, name_en, role, sort_order)
values ('سهيلة','Soheila','sales',2)   on conflict (name_en) do nothing;
insert into public.employees (name_ar, name_en, role, sort_order)
values ('رحمة','Rahma','sales',3)      on conflict (name_en) do nothing;


-- ============ 3) CUSTOMERS ============
create table if not exists public.customers (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text not null,
  phone            text not null,
  email            text,
  email_sent       boolean not null default false,
  call_completed   boolean not null default false,
  follow_up_result text not null default 'follow_up',
  customer_level   text,
  notes            text default '',
  employee_id      uuid not null references public.employees(id) on delete cascade,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_cus_emp     on public.customers(employee_id);
create index if not exists idx_cus_created on public.customers(created_at desc);


-- ============ 4) PERMISSIONS ============
alter table public.customer_levels enable row level security;
alter table public.employees       enable row level security;
alter table public.customers       enable row level security;

drop policy if exists lv_all  on public.customer_levels;
drop policy if exists emp_all on public.employees;
drop policy if exists cus_all on public.customers;

create policy lv_all  on public.customer_levels for all to anon, authenticated using (true) with check (true);
create policy emp_all on public.employees       for all to anon, authenticated using (true) with check (true);
create policy cus_all on public.customers       for all to anon, authenticated using (true) with check (true);

grant select, insert, update, delete on public.customer_levels to anon, authenticated;
grant select, insert, update, delete on public.employees       to anon, authenticated;
grant select, insert, update, delete on public.customers       to anon, authenticated;


-- ============ 5) REALTIME ============
alter table public.customers replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.customers;
exception when others then null;
end $$;

notify pgrst, 'reload schema';


-- ============ VERIFY ============
select name_ar, name_en, role, sort_order from public.employees order by sort_order;
