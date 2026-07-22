import { CirclePause, CirclePlay, Settings2, Target } from 'lucide-react'
import type { Agent } from '../../types/agent'
import { AgentAvatar } from '../common/AgentAvatar'

interface AgentCardProps {
  agent: Agent
  view: 'grid' | 'list'
  onToggleStatus: (id: string) => void
  onConfigure: (agent: Agent) => void
}

const statusLabel = {
  active: 'Working',
  idle: 'Available',
  paused: 'Paused',
  error: 'Needs attention',
}

export function AgentCard({ agent, view, onToggleStatus, onConfigure }: AgentCardProps) {
  const isRunning = agent.status === 'active' || agent.status === 'idle'

  return (
    <article className={`agent-card ${view === 'list' ? 'agent-card-list' : ''}`}>
      <div className="agent-card-top">
        <div className="agent-identity">
          <div className="avatar-status-wrap">
            <AgentAvatar label={agent.avatar} color={agent.avatarColor} size="lg" />
            <span className={`status-indicator status-${agent.status}`} />
          </div>
          <div>
            <h3>{agent.name}</h3>
            <p>{agent.role}</p>
          </div>
        </div>
        <button className="card-menu" type="button" aria-label={`Configure ${agent.name}`} onClick={() => onConfigure(agent)}>
          <Settings2 size={18} />
        </button>
      </div>

      <p className="agent-description">{agent.description}</p>

      <div className="agent-status-line">
        <span className={`status-pill status-pill-${agent.status}`}>
          <span /> {statusLabel[agent.status]}
        </span>
        <small>{agent.currentTask ?? `Last active ${agent.lastActive}`}</small>
      </div>

      <div className="agent-metrics">
        <div><span>Tasks completed</span><strong>{agent.tasksCompleted.toLocaleString()}</strong></div>
        <div><span>Success rate</span><strong>{agent.successRate}%</strong></div>
        <div><span>Avg. response</span><strong>{agent.avgResponse}</strong></div>
      </div>

      <div className="agent-card-footer">
        <span><Target size={14} /> {agent.category}</span>
        <div className="agent-card-actions">
          <button type="button" onClick={() => onConfigure(agent)}><Settings2 size={15} /> Configure</button>
          <button type="button" onClick={() => onToggleStatus(agent.id)}>
            {isRunning ? <CirclePause size={16} /> : <CirclePlay size={16} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
    </article>
  )
}
