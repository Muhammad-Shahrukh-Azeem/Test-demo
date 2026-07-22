import type { Agent, AgentAddress, AgentLead, AgentMemberRole, AgentTheme, CreateAgentInput, LeadStatus, UpdateAgentInput } from '../types/agent'
import { getSupabase } from '../lib/supabase'

interface AgentQueryRow {
  id: string
  slug: string
  display_name: string
  legal_name: string | null
  business_name: string | null
  abn: string | null
  license_number: string | null
  website_url: string | null
  primary_email: string | null
  primary_phone: string | null
  timezone: string
  locale: string
  is_active: boolean
  created_at: string
  agent_members: Array<{ user_id: string; role: AgentMemberRole }>
  agent_branding: {
    logo_url: string | null
    primary_color: string
    secondary_color: string | null
    theme: AgentTheme
    show_branding: boolean
  } | Array<{
    logo_url: string | null
    primary_color: string
    secondary_color: string | null
    theme: AgentTheme
    show_branding: boolean
  }> | null
  agent_public_profiles: {
    headline: string | null
    bio: string | null
    service_area: string | null
  } | Array<{
    headline: string | null
    bio: string | null
    service_area: string | null
  }> | null
  agent_addresses: AgentAddressQueryRow[]
  contact_forms: Array<{ id: string; is_active: boolean }>
  calendar_configs: Array<{ id: string; is_active: boolean }>
  widget_builds: Array<{ id: string; is_active: boolean }>
  leads: AgentLeadQueryRow[]
}

interface AgentAddressQueryRow {
  id: string
  label: string
  line1: string | null
  line2: string | null
  suburb: string | null
  state: string | null
  postcode: string | null
  country: string
}

interface AgentLeadQueryRow {
  id: string
  full_name: string | null
  email: string | null
  status: LeadStatus
  created_at: string
}

const firstOrNull = <Value>(value: Value | Value[] | null): Value | null => {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function mapAgent(row: AgentQueryRow): Agent {
  const branding = firstOrNull(row.agent_branding)
  const profile = firstOrNull(row.agent_public_profiles)

  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    legalName: row.legal_name,
    businessName: row.business_name,
    abn: row.abn,
    licenseNumber: row.license_number,
    websiteUrl: row.website_url,
    primaryEmail: row.primary_email,
    primaryPhone: row.primary_phone,
    timezone: row.timezone,
    locale: row.locale,
    isActive: row.is_active,
    createdAt: row.created_at,
    logoUrl: branding?.logo_url ?? null,
    primaryColor: branding?.primary_color ?? '#0089b0',
    secondaryColor: branding?.secondary_color ?? null,
    theme: branding?.theme ?? 'light',
    showBranding: branding?.show_branding ?? true,
    headline: profile?.headline ?? null,
    bio: profile?.bio ?? null,
    serviceArea: profile?.service_area ?? null,
    membershipRole: row.agent_members[0]?.role ?? 'member',
    addresses: (row.agent_addresses ?? []).map((address): AgentAddress => ({ ...address })),
    leads: (row.leads ?? []).map((lead): AgentLead => ({
      id: lead.id,
      fullName: lead.full_name,
      email: lead.email,
      status: lead.status,
      createdAt: lead.created_at,
    })),
    activeContactForms: (row.contact_forms ?? []).filter((form) => form.is_active).length,
    activeCalendars: (row.calendar_configs ?? []).filter((calendar) => calendar.is_active).length,
    activeWidgets: (row.widget_builds ?? []).filter((widget) => widget.is_active).length,
  }
}

const agentSelect = `
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
  created_at,
  agent_members!inner(user_id, role),
  agent_branding(logo_url, primary_color, secondary_color, theme, show_branding),
  agent_public_profiles(headline, bio, service_area),
  agent_addresses(id, label, line1, line2, suburb, state, postcode, country),
  contact_forms(id, is_active),
  calendar_configs(id, is_active),
  widget_builds(id, is_active),
  leads(id, full_name, email, status, created_at)
`

export async function fetchAgents(): Promise<Agent[]> {
  const client = getSupabase()
  const { data: authData, error: authError } = await client.auth.getUser()
  if (authError) throw authError
  if (!authData.user) throw new Error('You must be signed in to load agents.')

  const { data, error } = await client
    .from('agents')
    .select(agentSelect)
    .eq('agent_members.user_id', authData.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as AgentQueryRow[]).map(mapAgent)
}

export async function createAgent(input: CreateAgentInput): Promise<void> {
  const { error } = await getSupabase().rpc('create_agent_for_current_user', {
    agent_slug: input.slug,
    agent_display_name: input.displayName,
    agent_business_name: input.businessName || null,
    agent_primary_email: input.primaryEmail || null,
    agent_primary_phone: input.primaryPhone || null,
  })

  if (error) throw error
}

export async function updateAgent(input: UpdateAgentInput): Promise<void> {
  const client = getSupabase()

  const { error: agentError } = await client
    .from('agents')
    .update({
      slug: input.slug,
      display_name: input.displayName,
      legal_name: input.legalName,
      business_name: input.businessName,
      abn: input.abn,
      license_number: input.licenseNumber,
      website_url: input.websiteUrl,
      primary_email: input.primaryEmail || null,
      primary_phone: input.primaryPhone || null,
      timezone: input.timezone,
      locale: input.locale,
      is_active: input.isActive,
    })
    .eq('id', input.id)

  if (agentError) throw agentError

  const [profileResult, brandingResult] = await Promise.all([
    client.from('agent_public_profiles').upsert({
      agent_id: input.id,
      headline: input.headline,
      bio: input.bio,
      service_area: input.serviceArea,
    }),
    client.from('agent_branding').upsert({
      agent_id: input.id,
      primary_color: input.primaryColor,
      secondary_color: input.secondaryColor,
      theme: input.theme,
      show_branding: input.showBranding,
    }),
  ])

  if (profileResult.error) throw profileResult.error
  if (brandingResult.error) throw brandingResult.error
}
