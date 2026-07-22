export type AgentMemberRole = 'owner' | 'admin' | 'member'
export type AgentTheme = 'light' | 'dark' | 'system'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'archived'

export interface AgentAddress {
  id: string
  label: string
  line1: string | null
  line2: string | null
  suburb: string | null
  state: string | null
  postcode: string | null
  country: string
}

export interface AgentLead {
  id: string
  fullName: string | null
  email: string | null
  status: LeadStatus
  createdAt: string
}

export interface Agent {
  id: string
  slug: string
  displayName: string
  legalName: string | null
  businessName: string | null
  abn: string | null
  licenseNumber: string | null
  websiteUrl: string | null
  primaryEmail: string | null
  primaryPhone: string | null
  timezone: string
  locale: string
  isActive: boolean
  createdAt: string
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string | null
  theme: AgentTheme
  showBranding: boolean
  headline: string | null
  bio: string | null
  serviceArea: string | null
  membershipRole: AgentMemberRole
  addresses: AgentAddress[]
  leads: AgentLead[]
  activeContactForms: number
  activeCalendars: number
  activeWidgets: number
}

export interface CreateAgentInput {
  displayName: string
  slug: string
  businessName: string
  primaryEmail: string
  primaryPhone: string
}

export interface UpdateAgentInput {
  id: string
  slug: string
  displayName: string
  legalName: string | null
  businessName: string | null
  abn: string | null
  licenseNumber: string | null
  websiteUrl: string | null
  primaryEmail: string | null
  primaryPhone: string | null
  timezone: string
  locale: string
  isActive: boolean
  headline: string | null
  bio: string | null
  serviceArea: string | null
  primaryColor: string
  secondaryColor: string | null
  theme: AgentTheme
  showBranding: boolean
}
