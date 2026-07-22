-- Initial schema for a blank Supabase project.
-- Supabase Auth owns login credentials in auth.users. This migration creates
-- normalized public application tables linked back to auth.users.

begin;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

do $$
begin
  create type public.agent_member_role as enum ('owner', 'admin', 'member');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.lead_status as enum ('new', 'contacted', 'qualified', 'archived');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  timezone text not null default 'Australia/Perth',
  locale text not null default 'en-AU',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (full_name is null or char_length(full_name) <= 160),
  constraint profiles_phone_length check (phone is null or char_length(phone) <= 40)
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  legal_name text,
  business_name text,
  abn text,
  license_number text,
  website_url text,
  primary_email extensions.citext,
  primary_phone text,
  timezone text not null default 'Australia/Perth',
  locale text not null default 'en-AU',
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agents_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint agents_display_name_length check (char_length(display_name) between 1 and 160),
  constraint agents_primary_phone_length check (primary_phone is null or char_length(primary_phone) <= 40)
);

create table if not exists public.agent_members (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.agent_member_role not null default 'member',
  invited_by uuid references public.profiles(id) on delete set null,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (agent_id, user_id)
);

create table if not exists public.agent_addresses (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  label text not null default 'office',
  line1 text,
  line2 text,
  suburb text,
  state text,
  postcode text,
  country text not null default 'AU',
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_branding (
  agent_id uuid primary key references public.agents(id) on delete cascade,
  logo_url text,
  favicon_url text,
  primary_color text not null default '#0089b0',
  secondary_color text,
  theme text not null default 'light',
  show_branding boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agent_branding_theme_check check (theme in ('light', 'dark', 'system')),
  constraint agent_branding_primary_color_check check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint agent_branding_secondary_color_check check (secondary_color is null or secondary_color ~ '^#[0-9A-Fa-f]{6}$')
);

create table if not exists public.agent_public_profiles (
  agent_id uuid primary key references public.agents(id) on delete cascade,
  headline text,
  bio text,
  service_area text,
  google_place_id text,
  google_profile_url text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_forms (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  name text not null default 'Contact form',
  is_active boolean not null default true,
  success_message text not null default 'Your message has been sent. We will get back to you shortly.',
  notification_email extensions.citext,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.contact_forms(id) on delete cascade,
  field_key text not null,
  label text not null,
  field_type text not null default 'text',
  is_required boolean not null default false,
  sort_order integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (form_id, field_key),
  constraint contact_form_fields_key_format check (field_key ~ '^[a-z][a-z0-9_]*$'),
  constraint contact_form_fields_type_check check (field_type in ('text', 'email', 'tel', 'textarea', 'select', 'checkbox'))
);

create table if not exists public.calendar_configs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  name text not null default 'Discovery call',
  calendar_url text,
  booking_url text,
  duration_minutes integer not null default 30,
  timezone text not null default 'Australia/Perth',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_configs_duration_check check (duration_minutes > 0 and duration_minutes <= 480)
);

create table if not exists public.widget_builds (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  widget_type text not null,
  build_key text not null unique,
  version text,
  loader_version text,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint widget_builds_type_check check (widget_type in ('contact', 'calendar', 'google_reviews', 'calculator', 'custom')),
  constraint widget_builds_key_format check (build_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  form_id uuid references public.contact_forms(id) on delete set null,
  status public.lead_status not null default 'new',
  full_name text,
  email extensions.citext,
  phone text,
  message text,
  source_url text,
  referrer text,
  user_agent text,
  ip_hash text,
  raw_fields jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_agent_members_user_id on public.agent_members(user_id);
create index if not exists idx_agent_members_agent_id on public.agent_members(agent_id);
create index if not exists idx_contact_forms_agent_id on public.contact_forms(agent_id);
create index if not exists idx_calendar_configs_agent_id on public.calendar_configs(agent_id);
create index if not exists idx_widget_builds_agent_id on public.widget_builds(agent_id);
create index if not exists idx_widget_builds_lookup on public.widget_builds(agent_id, widget_type, is_active);
create index if not exists idx_leads_agent_id_created_at on public.leads(agent_id, created_at desc);
create index if not exists idx_leads_email on public.leads(email);
create index if not exists idx_leads_status on public.leads(status);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    nullif(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), ''),
    nullif(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger agents_set_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

create trigger agent_members_set_updated_at
  before update on public.agent_members
  for each row execute function public.set_updated_at();

create trigger agent_addresses_set_updated_at
  before update on public.agent_addresses
  for each row execute function public.set_updated_at();

create trigger agent_branding_set_updated_at
  before update on public.agent_branding
  for each row execute function public.set_updated_at();

create trigger agent_public_profiles_set_updated_at
  before update on public.agent_public_profiles
  for each row execute function public.set_updated_at();

create trigger contact_forms_set_updated_at
  before update on public.contact_forms
  for each row execute function public.set_updated_at();

create trigger contact_form_fields_set_updated_at
  before update on public.contact_form_fields
  for each row execute function public.set_updated_at();

create trigger calendar_configs_set_updated_at
  before update on public.calendar_configs
  for each row execute function public.set_updated_at();

create trigger widget_builds_set_updated_at
  before update on public.widget_builds
  for each row execute function public.set_updated_at();

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.agent_members enable row level security;
alter table public.agent_addresses enable row level security;
alter table public.agent_branding enable row level security;
alter table public.agent_public_profiles enable row level security;
alter table public.contact_forms enable row level security;
alter table public.contact_form_fields enable row level security;
alter table public.calendar_configs enable row level security;
alter table public.widget_builds enable row level security;
alter table public.leads enable row level security;

create or replace function public.is_agent_member(target_agent_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agent_members am
    where am.agent_id = target_agent_id
      and am.user_id = auth.uid()
  );
$$;

create or replace function public.is_agent_admin(target_agent_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agent_members am
    where am.agent_id = target_agent_id
      and am.user_id = auth.uid()
      and am.role in ('owner', 'admin')
  );
$$;
create or replace function public.can_submit_lead(target_agent_id uuid, target_form_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agents a
    left join public.contact_forms cf
      on cf.agent_id = a.id
      and cf.id = target_form_id
      and cf.is_active = true
    where a.id = target_agent_id
      and a.is_active = true
      and (target_form_id is null or cf.id is not null)
  );
$$;

create policy "Profiles are readable by owner"
  on public.profiles for select
  using (id = auth.uid());

create policy "Profiles are updateable by owner"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Agents are readable by members"
  on public.agents for select
  using (public.is_agent_member(id));

create policy "Agents can be inserted by authenticated users"
  on public.agents for insert
  with check (auth.uid() is not null and created_by = auth.uid());

create policy "Agents are updateable by admins"
  on public.agents for update
  using (public.is_agent_admin(id))
  with check (public.is_agent_admin(id));

create policy "Agent members are readable by same agent members"
  on public.agent_members for select
  using (public.is_agent_member(agent_id));

create policy "Agent members are insertable by admins"
  on public.agent_members for insert
  with check (public.is_agent_admin(agent_id));

create policy "Agent members are updateable by admins"
  on public.agent_members for update
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Agent members are deleteable by admins"
  on public.agent_members for delete
  using (public.is_agent_admin(agent_id));

create policy "Agent addresses are readable by members"
  on public.agent_addresses for select
  using (public.is_agent_member(agent_id));

create policy "Agent addresses are writable by admins"
  on public.agent_addresses for all
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Agent branding is readable by members"
  on public.agent_branding for select
  using (public.is_agent_member(agent_id));

create policy "Agent branding is writable by admins"
  on public.agent_branding for all
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Agent public profiles are readable by members"
  on public.agent_public_profiles for select
  using (public.is_agent_member(agent_id));

create policy "Agent public profiles are writable by admins"
  on public.agent_public_profiles for all
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Contact forms are readable by members"
  on public.contact_forms for select
  using (public.is_agent_member(agent_id));

create policy "Contact forms are writable by admins"
  on public.contact_forms for all
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Contact form fields are readable by form agent members"
  on public.contact_form_fields for select
  using (
    exists (
      select 1
      from public.contact_forms cf
      where cf.id = contact_form_fields.form_id
        and public.is_agent_member(cf.agent_id)
    )
  );

create policy "Contact form fields are writable by form agent admins"
  on public.contact_form_fields for all
  using (
    exists (
      select 1
      from public.contact_forms cf
      where cf.id = contact_form_fields.form_id
        and public.is_agent_admin(cf.agent_id)
    )
  )
  with check (
    exists (
      select 1
      from public.contact_forms cf
      where cf.id = contact_form_fields.form_id
        and public.is_agent_admin(cf.agent_id)
    )
  );

create policy "Calendar configs are readable by members"
  on public.calendar_configs for select
  using (public.is_agent_member(agent_id));

create policy "Calendar configs are writable by admins"
  on public.calendar_configs for all
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Widget builds are readable by members"
  on public.widget_builds for select
  using (public.is_agent_member(agent_id));

create policy "Widget builds are writable by admins"
  on public.widget_builds for all
  using (public.is_agent_admin(agent_id))
  with check (public.is_agent_admin(agent_id));

create policy "Leads are readable by members"
  on public.leads for select
  using (public.is_agent_member(agent_id));

create policy "Leads are insertable by public clients"
  on public.leads for insert
  with check (public.can_submit_lead(agent_id, form_id));

create policy "Leads are updateable by members"
  on public.leads for update
  using (public.is_agent_member(agent_id))
  with check (public.is_agent_member(agent_id));

create or replace function public.create_agent_for_current_user(
  agent_slug text,
  agent_display_name text,
  agent_business_name text default null,
  agent_primary_email text default null,
  agent_primary_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_agent_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.profiles (id)
  values (auth.uid())
  on conflict (id) do nothing;

  insert into public.agents (
    slug,
    display_name,
    business_name,
    primary_email,
    primary_phone,
    created_by
  )
  values (
    agent_slug,
    agent_display_name,
    agent_business_name,
    agent_primary_email,
    agent_primary_phone,
    auth.uid()
  )
  returning id into new_agent_id;

  insert into public.agent_members (agent_id, user_id, role)
  values (new_agent_id, auth.uid(), 'owner');

  insert into public.agent_branding (agent_id)
  values (new_agent_id);

  return new_agent_id;
end;
$$;

create or replace view public.agent_directory as
select
  a.id,
  a.slug,
  a.display_name,
  a.business_name,
  a.website_url,
  a.primary_email,
  a.primary_phone,
  a.timezone,
  a.locale,
  a.is_active,
  b.logo_url,
  b.primary_color,
  b.theme,
  p.headline,
  p.service_area,
  p.google_place_id
from public.agents a
left join public.agent_branding b on b.agent_id = a.id
left join public.agent_public_profiles p on p.agent_id = a.id
where a.is_active = true;

commit;
