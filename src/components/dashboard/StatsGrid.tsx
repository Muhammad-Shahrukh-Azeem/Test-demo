import { Building2, ContactRound, FileText, PanelsTopLeft } from 'lucide-react'
import type { Agent } from '../../types/agent'

interface StatsGridProps {
  agents: Agent[]
}

export function StatsGrid({ agents }: StatsGridProps) {
  const activeAgents = agents.filter((agent) => agent.isActive).length
  const totalLeads = agents.reduce((total, agent) => total + agent.leads.length, 0)
  const activeWidgets = agents.reduce((total, agent) => total + agent.activeWidgets, 0)
  const activeForms = agents.reduce((total, agent) => total + agent.activeContactForms, 0)

  const stats = [
    { label: 'Accessible agents', value: agents.length.toString(), helper: `${activeAgents} currently active`, icon: Building2, color: 'purple' },
    { label: 'Captured leads', value: totalLeads.toLocaleString(), helper: 'across your agents', icon: ContactRound, color: 'blue' },
    { label: 'Published widgets', value: activeWidgets.toLocaleString(), helper: 'active widget builds', icon: PanelsTopLeft, color: 'green' },
    { label: 'Contact forms', value: activeForms.toLocaleString(), helper: 'active forms', icon: FileText, color: 'orange' },
  ]

  return (
    <section className="stats-grid" aria-label="Agent statistics">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <div className={`stat-icon stat-icon-${stat.color}`}><stat.icon size={20} /></div>
          <div className="stat-heading"><span>{stat.label}</span><span className="live-data-label">Live data</span></div>
          <strong className="stat-value">{stat.value}</strong>
          <p>{stat.helper}</p>
        </article>
      ))}
    </section>
  )
}
