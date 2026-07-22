import { Activity, CheckCircle2, ContactRound, PanelsTopLeft } from 'lucide-react'
import type { Agent } from '../types/agent'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'

interface ActivityPageProps {
  agents: Agent[]
}

export function ActivityPage({ agents }: ActivityPageProps) {
  const leads = agents.flatMap((agent) => agent.leads)
  const qualified = leads.filter((lead) => lead.status === 'qualified').length
  const activeWidgets = agents.reduce((total, agent) => total + agent.activeWidgets, 0)

  return (
    <>
      <section className="page-intro"><div><span className="eyebrow">Supabase records</span><h1>Workspace activity</h1><p>Recent lead activity and live resource totals from your agents.</p></div></section>
      <section className="summary-strip">
        <article><span className="summary-icon success"><CheckCircle2 size={18} /></span><div><strong>{qualified}</strong><p>Qualified leads</p></div></article>
        <article><span className="summary-icon info"><ContactRound size={18} /></span><div><strong>{leads.length}</strong><p>Total leads</p></div></article>
        <article><span className="summary-icon neutral"><PanelsTopLeft size={18} /></span><div><strong>{activeWidgets}</strong><p>Active widgets</p></div></article>
        <article><span className="summary-icon warning"><Activity size={18} /></span><div><strong>{agents.filter((agent) => agent.isActive).length}</strong><p>Active agents</p></div></article>
      </section>
      <ActivityFeed agents={agents} />
    </>
  )
}
