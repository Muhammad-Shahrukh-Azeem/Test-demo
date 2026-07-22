-- Seed data for local/testing use.
-- Login:
--   Email: test@example.com
--   Password: aaaaaa
--
-- Supabase Auth signs in with email/password, so "Test" is stored as the
-- profile display name and test@example.com is the login identifier.

begin;

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@example.com',
  extensions.crypt('aaaaaa', extensions.gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Test"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object(
    'sub', '11111111-1111-1111-1111-111111111111',
    'email', 'test@example.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now()
)
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.profiles (
  id,
  full_name,
  phone,
  timezone,
  locale
)
values (
  '11111111-1111-1111-1111-111111111111',
  'Test',
  '0478 496 697',
  'Australia/Perth',
  'en-AU'
)
on conflict (id) do update
set
  full_name = excluded.full_name,
  phone = excluded.phone,
  timezone = excluded.timezone,
  locale = excluded.locale,
  updated_at = now();

insert into public.agents (
  id,
  slug,
  display_name,
  legal_name,
  business_name,
  abn,
  license_number,
  website_url,
  primary_email,
  primary_phone,
  timezone,
  locale,
  is_active,
  created_by
)
values (
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  'dv-buyers-agency',
  'DV Buyers Agency',
  'DV Buyers Agency',
  'DV Buyers Agency',
  '57 653 667 246',
  'RA81164 / RA81518',
  'https://dvbuyersagency.com.au',
  'daniel@dvbuyersagency.com.au',
  '0478 496 697',
  'Australia/Perth',
  'en-AU',
  true,
  '11111111-1111-1111-1111-111111111111'
)
on conflict (id) do update
set
  slug = excluded.slug,
  display_name = excluded.display_name,
  legal_name = excluded.legal_name,
  business_name = excluded.business_name,
  abn = excluded.abn,
  license_number = excluded.license_number,
  website_url = excluded.website_url,
  primary_email = excluded.primary_email,
  primary_phone = excluded.primary_phone,
  timezone = excluded.timezone,
  locale = excluded.locale,
  is_active = excluded.is_active,
  created_by = excluded.created_by,
  updated_at = now();

insert into public.agent_members (
  agent_id,
  user_id,
  role
)
values (
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  '11111111-1111-1111-1111-111111111111',
  'owner'
)
on conflict (agent_id, user_id) do update
set
  role = excluded.role,
  updated_at = now();

insert into public.agent_addresses (
  id,
  agent_id,
  label,
  suburb,
  state,
  country
)
values (
  '22222222-2222-4222-8222-222222222222',
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  'office',
  'Perth',
  'WA',
  'AU'
)
on conflict (id) do update
set
  agent_id = excluded.agent_id,
  label = excluded.label,
  suburb = excluded.suburb,
  state = excluded.state,
  country = excluded.country,
  updated_at = now();

insert into public.agent_branding (
  agent_id,
  logo_url,
  primary_color,
  secondary_color,
  theme,
  show_branding
)
values (
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  '/logo.png',
  '#0089b0',
  '#009ed1',
  'light',
  true
)
on conflict (agent_id) do update
set
  logo_url = excluded.logo_url,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  theme = excluded.theme,
  show_branding = excluded.show_branding,
  updated_at = now();

insert into public.agent_public_profiles (
  agent_id,
  headline,
  bio,
  service_area,
  google_profile_url,
  facebook_url,
  instagram_url,
  linkedin_url
)
values (
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  'Your trusted Perth buyer''s agents, from search to settlement.',
  'A Perth-born husband-and-wife team helping buyers secure homes and investments with strategy, local market knowledge, and end-to-end support.',
  'Perth, Western Australia',
  'https://www.google.com/maps/place/DV+Buyers+Agency+-+Perth+Buyer''s+Agents',
  'https://www.facebook.com/DVBuyersAgency',
  'https://www.instagram.com/dvbuyersagency',
  'https://www.linkedin.com/company/dv-buyersagency/'
)
on conflict (agent_id) do update
set
  headline = excluded.headline,
  bio = excluded.bio,
  service_area = excluded.service_area,
  google_profile_url = excluded.google_profile_url,
  facebook_url = excluded.facebook_url,
  instagram_url = excluded.instagram_url,
  linkedin_url = excluded.linkedin_url,
  updated_at = now();

insert into public.contact_forms (
  id,
  agent_id,
  name,
  is_active,
  success_message,
  notification_email
)
values (
  'd87ea0c9-33ce-4f51-9ac6-a37f41385ea6',
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  'Website contact form',
  true,
  'Your message has been sent. We will get back to you shortly.',
  'daniel@dvbuyersagency.com.au'
)
on conflict (id) do update
set
  agent_id = excluded.agent_id,
  name = excluded.name,
  is_active = excluded.is_active,
  success_message = excluded.success_message,
  notification_email = excluded.notification_email,
  updated_at = now();

insert into public.contact_form_fields (
  form_id,
  field_key,
  label,
  field_type,
  is_required,
  sort_order,
  config
)
values
  ('d87ea0c9-33ce-4f51-9ac6-a37f41385ea6', 'name', 'Full Name', 'text', true, 10, '{"autocomplete":"name"}'::jsonb),
  ('d87ea0c9-33ce-4f51-9ac6-a37f41385ea6', 'email', 'Email', 'email', true, 20, '{"autocomplete":"email"}'::jsonb),
  ('d87ea0c9-33ce-4f51-9ac6-a37f41385ea6', 'phone', 'Phone', 'tel', false, 30, '{"autocomplete":"tel"}'::jsonb),
  ('d87ea0c9-33ce-4f51-9ac6-a37f41385ea6', 'message', 'Message', 'textarea', true, 40, '{"minRows":5}'::jsonb)
on conflict (form_id, field_key) do update
set
  label = excluded.label,
  field_type = excluded.field_type,
  is_required = excluded.is_required,
  sort_order = excluded.sort_order,
  config = excluded.config,
  updated_at = now();

insert into public.calendar_configs (
  id,
  agent_id,
  name,
  booking_url,
  duration_minutes,
  timezone,
  is_active
)
values (
  '33333333-3333-4333-8333-333333333333',
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  'Free discovery call',
  'https://dvbuyersagency.com.au/contact-us',
  30,
  'Australia/Perth',
  true
)
on conflict (id) do update
set
  agent_id = excluded.agent_id,
  name = excluded.name,
  booking_url = excluded.booking_url,
  duration_minutes = excluded.duration_minutes,
  timezone = excluded.timezone,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.widget_builds (
  agent_id,
  widget_type,
  build_key,
  version,
  loader_version,
  config,
  is_active,
  published_at
)
values
  (
    'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
    'contact',
    'form-d87ea0c9-33ce-4f51-9ac6-a37f41385ea6',
    '2026-05-29T22:34:03.864+00:00',
    'v1.1.4',
    '{"form_id":"d87ea0c9-33ce-4f51-9ac6-a37f41385ea6","primaryColor":"#009ed1","theme":"light","showBranding":true}'::jsonb,
    true,
    '2026-05-29T22:34:03.864+00:00'
  ),
  (
    'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
    'calendar',
    'calendar-717524e7',
    '2026-06-11T04:17:19.852106+00:00',
    'v1.1.4',
    '{"calendar_config_id":"33333333-3333-4333-8333-333333333333","primaryColor":"#0089b0","theme":"light","showBranding":true}'::jsonb,
    true,
    '2026-06-11T04:17:19.852106+00:00'
  ),
  (
    'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
    'google_reviews',
    'google-reviews-cad81bf8',
    '2026-06-11T04:17:19.852106+00:00',
    'v1.1.4',
    '{"minRating":4,"maxReviews":5,"layout":"horizontal","animation":"marquee"}'::jsonb,
    true,
    '2026-06-11T04:17:19.852106+00:00'
  )
on conflict (build_key) do update
set
  agent_id = excluded.agent_id,
  widget_type = excluded.widget_type,
  version = excluded.version,
  loader_version = excluded.loader_version,
  config = excluded.config,
  is_active = excluded.is_active,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.leads (
  id,
  agent_id,
  form_id,
  status,
  full_name,
  email,
  phone,
  message,
  source_url,
  referrer,
  raw_fields,
  metadata
)
values (
  '44444444-4444-4444-8444-444444444444',
  'cad81bf8-053b-489e-8a2d-09c3f9b0ba75',
  'd87ea0c9-33ce-4f51-9ac6-a37f41385ea6',
  'new',
  'Sample Buyer',
  'buyer@example.com',
  '0400 000 000',
  'I am looking for help buying an investment property in Perth.',
  'https://dvbuyersagency.com.au/contact-us',
  null,
  '{"name":"Sample Buyer","email":"buyer@example.com","phone":"0400 000 000","message":"I am looking for help buying an investment property in Perth."}'::jsonb,
  '{"seed":true}'::jsonb
)
on conflict (id) do update
set
  agent_id = excluded.agent_id,
  form_id = excluded.form_id,
  status = excluded.status,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  message = excluded.message,
  source_url = excluded.source_url,
  referrer = excluded.referrer,
  raw_fields = excluded.raw_fields,
  metadata = excluded.metadata,
  updated_at = now();

commit;
