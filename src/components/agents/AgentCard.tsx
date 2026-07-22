import { CirclePause, CirclePlay, MapPin, Settings2 } from 'lucide-react'
import type { Agent } from '../../types/agent'
import { AgentAvatar } from '../common/AgentAvatar'

interface AgentCardProps {
  agent: Agent
  view: 'grid' | 'list'
  onToggleStatus: (id: string) => void
  onConfigure: (agent: Agent) => void
}

export function AgentCard({ agent, view, onToggleStatus, onConfigure }: AgentCardProps) {
  const initials = agent.displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const location = agent.serviceArea
    ?? [agent.addresses[0]?.suburb, agent.addresses[0]?.state].filter(Boolean).join(', ')
    ?? 'No service area'

  return (
    <article className={`agent-card ${view === 'list' ? 'agent-card-list' : ''}`}>
      <div className="agent-card-top">
        <div className="agent-identity">
          <div className="avatar-status-wrap">
            <AgentAvatar label={initials} color="blue" size="lg" imageUrl={agent.logoUrl} />
            <span className={`status-indicator status-${agent.isActive ? 'active' : 'paused'}`} />
          </div>
          <div><h3>{agent.displayName}</h3><p>{agent.businessName ?? agent.legalName ?? agent.slug}</p></div>
        </div>
        <button className="card-menu" type="button" aria-label={`Configure ${agent.displayName}`} onClick={() => onConfigure(agent)}><Settings2 size={18} /></button>
      </div>

      <p className="agent-description">{agent.bio ?? agent.headline ?? 'No public profile description has been added yet.'}</p>

      <div className="agent-status-line">
        <span className={`status-pill status-pill-${agent.isActive ? 'active' : 'paused'}`}><span /> {agent.isActive ? 'Active' : 'Inactive'}</span>
        <small>{agent.primaryEmail ?? 'No primary email'} · {agent.membershipRole}</small>
      </div>

      <div className="agent-metrics">
        <div><span>Leads</span><strong>{agent.leads.length}</strong></div>
        <div><span>Widgets</span><strong>{agent.activeWidgets}</strong></div>
        <div><span>Forms</span><strong>{agent.activeContactForms}</strong></div>
      </div>

      <div className="agent-card-footer">
        <span><MapPin size={14} /> {location || 'No service area'}</span>
        <div className="agent-card-actions">
          <button type="button" onClick={() => onConfigure(agent)}><Settings2 size={15} /> Configure</button>
          <button type="button" onClick={() => onToggleStatus(agent.id)}>
            {agent.isActive ? <CirclePause size={16} /> : <CirclePlay size={16} />}
            {agent.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </article>
  )
}
