import { Clock3, Grid2X2, List, Search, SlidersHorizontal } from 'lucide-react'
import type { Agent, AgentStatus } from '../../types/agent'
import { AgentCard } from './AgentCard'

interface AgentsPanelProps {
  agents: Agent[]
  query: string
  onQueryChange: (query: string) => void
  filter: AgentStatus | 'all'
  onFilterChange: (filter: AgentStatus | 'all') => void
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  onToggleStatus: (id: string) => void
  onConfigure: (agent: Agent) => void
}

export function AgentsPanel({ agents, query, onQueryChange, filter, onFilterChange, view, onViewChange, onToggleStatus, onConfigure }: AgentsPanelProps) {
  return (
    <section className="agents-section">
      <div className="agents-heading">
        <div><h2>Your agents</h2><p>Monitor performance and manage your autonomous team.</p></div>
        <div className="view-toggle" aria-label="View style">
          <button className={view === 'grid' ? 'is-active' : ''} onClick={() => onViewChange('grid')} type="button" aria-label="Grid view"><Grid2X2 size={17} /></button>
          <button className={view === 'list' ? 'is-active' : ''} onClick={() => onViewChange('list')} type="button" aria-label="List view"><List size={18} /></button>
        </div>
      </div>

      <div className="agents-toolbar">
        <label className="agent-search">
          <Search size={17} />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search agents…" type="search" />
        </label>
        <label className="filter-control">
          <SlidersHorizontal size={16} />
          <select value={filter} onChange={(event) => onFilterChange(event.target.value as AgentStatus | 'all')} aria-label="Filter agents">
            <option value="all">All statuses</option>
            <option value="active">Working</option>
            <option value="idle">Available</option>
            <option value="paused">Paused</option>
            <option value="error">Needs attention</option>
          </select>
        </label>
        <span className="result-count">{agents.length} agent{agents.length === 1 ? '' : 's'}</span>
      </div>

      {agents.length > 0 ? (
        <div className={`agents-grid ${view === 'list' ? 'agents-list' : ''}`}>
          {agents.map((agent) => <AgentCard key={agent.id} agent={agent} view={view} onToggleStatus={onToggleStatus} onConfigure={onConfigure} />)}
        </div>
      ) : (
        <div className="empty-state"><Clock3 size={26} /><h3>No agents found</h3><p>Try changing your search or status filter.</p></div>
      )}
    </section>
  )
}
