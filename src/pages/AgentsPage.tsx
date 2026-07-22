import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import type { Agent } from '../types/agent'
import { AgentsPanel, type AgentFilter } from '../components/agents/AgentsPanel'

interface AgentsPageProps {
  agents: Agent[]
  onCreate: () => void
  onToggleStatus: (id: string) => void
  onConfigure: (agent: Agent) => void
}

export function AgentsPage({ agents, onCreate, onToggleStatus, onConfigure }: AgentsPageProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<AgentFilter>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const visibleAgents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return agents.filter((agent) => {
      const matchesFilter = filter === 'all' || (filter === 'active' ? agent.isActive : !agent.isActive)
      const matchesQuery = !searchTerm || [agent.displayName, agent.businessName, agent.primaryEmail, agent.serviceArea, agent.slug].some((value) => value?.toLowerCase().includes(searchTerm))
      return matchesFilter && matchesQuery
    })
  }, [agents, filter, query])

  return (
    <>
      <section className="page-intro">
        <div><span className="eyebrow">Supabase directory</span><h1>Manage your agents</h1><p>Create and configure the business agents assigned to your account.</p></div>
        <button className="primary-button" type="button" onClick={onCreate}><Plus size={17} /> New agent</button>
      </section>
      <AgentsPanel agents={visibleAgents} query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} view={view} onViewChange={setView} onToggleStatus={onToggleStatus} onConfigure={onConfigure} />
    </>
  )
}
