import { ArrowRight, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Agent } from '../../types/agent'
import { AgentAvatar } from '../common/AgentAvatar'

interface ActivityFeedProps {
  agents: Agent[]
  showViewAll?: boolean
}

export function ActivityFeed({ agents, showViewAll = false }: ActivityFeedProps) {
  const activity = agents
    .flatMap((agent) => agent.leads.map((lead) => ({ agent, lead })))
    .sort((left, right) => Date.parse(right.lead.createdAt) - Date.parse(left.lead.createdAt))
    .slice(0, 12)

  return (
    <section className="panel activity-panel">
      <div className="panel-header">
        <div><h2>Recent lead activity</h2><p>Latest leads available through your Supabase membership.</p></div>
        {showViewAll && <Link className="text-button button-link" to="/activity">View all <ArrowRight size={15} /></Link>}
      </div>
      {activity.length > 0 ? (
        <div className="activity-list">
          {activity.map(({ agent, lead }) => {
            const initials = agent.displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
            return (
              <div className="activity-row" key={lead.id}>
                <div className="activity-avatar-wrap"><AgentAvatar label={initials} color="blue" size="sm" imageUrl={agent.logoUrl} /><span className={`activity-dot activity-dot-${lead.status === 'qualified' ? 'success' : lead.status === 'archived' ? 'warning' : 'info'}`} /></div>
                <p><strong>{lead.fullName ?? lead.email ?? 'Unnamed lead'}</strong> was added to <span>{agent.displayName}</span> · {lead.status}</p>
                <time>{new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(lead.createdAt))}</time>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="panel-empty"><Inbox size={22} /><strong>No lead activity yet</strong><p>New leads will appear here when they are captured.</p></div>
      )}
    </section>
  )
}
