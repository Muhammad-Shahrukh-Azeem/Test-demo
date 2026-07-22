import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import type { Agent, AgentStatus } from '../types/agent'
import { AgentsPanel } from '../components/agents/AgentsPanel'

interface AgentsPageProps {
  agents: Agent[]
  onCreate: () => void
  onToggleStatus: (id: string) => void
  onConfigure: (agent: Agent) => void
}

export function AgentsPage({ agents, onCreate, onToggleStatus, onConfigure }: AgentsPageProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<AgentStatus | 'all'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const visibleAgents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return agents.filter((agent) => {
      const matchesFilter = filter === 'all' || agent.status === filter
      const matchesQuery = !searchTerm || [agent.name, agent.role, agent.category].some((value) => value.toLowerCase().includes(searchTerm))
      return matchesFilter && matchesQuery
    })
  }, [agents, filter, query])

  return (
    <>
      <section className="page-intro">
        <div><span className="eyebrow">Agent directory</span><h1>Manage your agents</h1><p>Create, configure, pause, and monitor every agent from one place.</p></div>
        <button className="primary-button" type="button" onClick={onCreate}><Plus size={17} /> New agent</button>
      </section>
      <AgentsPanel agents={visibleAgents} query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} view={view} onViewChange={setView} onToggleStatus={onToggleStatus} onConfigure={onConfigure} />
    </>
  )
}
