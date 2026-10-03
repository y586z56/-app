create extension if not exists pgcrypto;

create type public.app_role as enum ('admin','worker');
create type public.order_status as enum ('new','production','cutting','ready','delivery','completed','cancelled');

create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade,full_name text not null default '',email text not null default '',role public.app_role not null default 'worker',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.customers (id uuid primary key default gen_random_uuid(),name text not null,phone text default '',email text default '',customer_type text default 'לקוח פרטי',notes text default '',created_at timestamptz not null default now(),created_by uuid references public.profiles(id));
create table if not exists public.inventory (id uuid primary key default gen_random_uuid(),name text not null,category text default 'לוחות',quantity numeric not null default 0,unit text not null default 'יח׳',min_quantity numeric not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.orders (id uuid primary key default gen_random_uuid(),order_number bigint generated always as identity unique,customer_id uuid references public.customers(id) on delete set null,product text not null,amount numeric not null default 0,status public.order_status not null default 'new',notes text default '',created_at timestamptz not null default now(),updated_at timestamptz not null default now(),created_by uuid references public.profiles(id));
create table if not exists public.order_items (id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,inventory_id uuid references public.inventory(id) on delete set null,description text not null,quantity numeric not null default 1,unit_price numeric not null default 0);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin') $$;

alter table public.profiles enable row level security; alter table public.customers enable row level security; alter table public.inventory enable row level security; alter table public.orders enable row level security; alter table public.order_items enable row level security;

drop policy if exists "profiles own read" on public.profiles; create policy "profiles own read" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
drop policy if exists "profiles own update" on public.profiles; create policy "profiles own update" on public.profiles for update to authenticated using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());

drop policy if exists "staff customers read" on public.customers; create policy "staff customers read" on public.customers for select to authenticated using (true);
drop policy if exists "staff customers insert" on public.customers; create policy "staff customers insert" on public.customers for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "staff customers update" on public.customers; create policy "staff customers update" on public.customers for update to authenticated using (public.is_admin() or created_by=auth.uid()) with check (public.is_admin() or created_by=auth.uid());
drop policy if exists "admin customers delete" on public.customers; create policy "admin customers delete" on public.customers for delete to authenticated using (public.is_admin());

drop policy if exists "staff inventory read" on public.inventory; create policy "staff inventory read" on public.inventory for select to authenticated using (true);
drop policy if exists "admin inventory write" on public.inventory; create policy "admin inventory write" on public.inventory for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "staff orders read" on public.orders; create policy "staff orders read" on public.orders for select to authenticated using (true);
drop policy if exists "staff orders insert" on public.orders; create policy "staff orders insert" on public.orders for insert to authenticated with check (auth.uid() is not null);
drop policy if exists "staff orders update" on public.orders; create policy "staff orders update" on public.orders for update to authenticated using (public.is_admin() or created_by=auth.uid()) with check (public.is_admin() or created_by=auth.uid());
drop policy if exists "admin orders delete" on public.orders; create policy "admin orders delete" on public.orders for delete to authenticated using (public.is_admin());

drop policy if exists "staff order items read" on public.order_items; create policy "staff order items read" on public.order_items for select to authenticated using (true);
drop policy if exists "staff order items write" on public.order_items; create policy "staff order items write" on public.order_items for all to authenticated using (public.is_admin() or exists(select 1 from public.orders o where o.id=order_id and o.created_by=auth.uid())) with check (public.is_admin() or exists(select 1 from public.orders o where o.id=order_id and o.created_by=auth.uid()));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,full_name,email,role)
 values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',''),coalesce(new.email,''),case when not exists(select 1 from public.profiles) then 'admin'::public.app_role else 'worker'::public.app_role end)
 on conflict(id) do update set full_name=excluded.full_name,email=excluded.email;
 return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.inventory(name,category,quantity,min_quantity)
select * from (values ('שיש קלקטה','לוחות',18,5),('גרניט שחור','לוחות',7,5),('קררה איטלקי','לוחות',23,5),('דקטון','לוחות',4,5),('פורצלן לבן','לוחות',31,5),('קוורץ אפור','לוחות',12,5)) v(name,category,quantity,min_quantity)
where not exists(select 1 from public.inventory);
grant select,insert,update,delete on public.customers,public.inventory,public.orders,public.order_items,public.profiles to authenticated;