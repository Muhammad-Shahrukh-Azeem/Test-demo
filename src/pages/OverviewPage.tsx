import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Agent } from '../types/agent'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { AgentCard } from '../components/agents/AgentCard'

interface OverviewPageProps {
  agents: Agent[]
  onCreate: () => void
  onToggleStatus: (id: string) => void
  onConfigure: (agent: Agent) => void
}

export function OverviewPage({ agents, onCreate, onToggleStatus, onConfigure }: OverviewPageProps) {
  return (
    <>
      <section className="page-intro">
        <div><span className="eyebrow">Supabase agent overview</span><h1>Your agent workspace</h1><p>Live business, lead, form, and widget data for your account.</p></div>
        <div className="intro-actions">
          <Link className="secondary-button button-link" to="/activity">View activity <ArrowRight size={16} /></Link>
          <button className="primary-button" type="button" onClick={onCreate}><Plus size={17} /> New agent</button>
        </div>
      </section>
      <StatsGrid agents={agents} />
      <section className="agents-section">
        <div className="agents-heading">
          <div><h2>Agent directory</h2><p>Your Supabase agents at a glance.</p></div>
          <Link className="text-button button-link" to="/agents">Manage all <ArrowRight size={15} /></Link>
        </div>
        <div className="agents-grid">
          {agents.slice(0, 3).map((agent) => <AgentCard key={agent.id} agent={agent} view="grid" onToggleStatus={onToggleStatus} onConfigure={onConfigure} />)}
        </div>
      </section>
      <ActivityFeed agents={agents} showViewAll />
    </>
  )
}
