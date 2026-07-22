import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { agents as initialAgents } from './data/agents'
import type { Agent } from './types/agent'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { CreateAgentModal } from './components/agents/CreateAgentModal'
import { ConfigureAgentModal } from './components/agents/ConfigureAgentModal'
import { OverviewPage } from './pages/OverviewPage'
import { AgentsPage } from './pages/AgentsPage'
import { ActivityPage } from './pages/ActivityPage'
import { IntegrationsPage } from './pages/IntegrationsPage'
import { SettingsPage } from './pages/SettingsPage'
import { HelpPage } from './pages/HelpPage'

const AGENT_STORAGE_KEY = 'agentos-agents'

function loadAgents(): Agent[] {
  try {
    const saved = localStorage.getItem(AGENT_STORAGE_KEY)
    if (!saved) return initialAgents
    const parsed = JSON.parse(saved) as Agent[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAgents
  } catch {
    return initialAgents
  }
}

function App() {
  const [agents, setAgents] = useState<Agent[]>(loadAgents)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [agentToConfigure, setAgentToConfigure] = useState<Agent | null>(null)

  useEffect(() => {
    localStorage.setItem(AGENT_STORAGE_KEY, JSON.stringify(agents))
  }, [agents])

  const toggleAgentStatus = (id: string) => {
    setAgents((current) => current.map((agent) => {
      if (agent.id !== id) return agent
      const isRunning = agent.status === 'active' || agent.status === 'idle'
      return {
        ...agent,
        status: isRunning ? 'paused' : 'active',
        currentTask: isRunning ? undefined : 'Starting assigned workflow…',
        lastActive: 'just now',
      }
    }))
  }

  const saveAgent = (updatedAgent: Agent) => {
    setAgents((current) => current.map((agent) => agent.id === updatedAgent.id ? updatedAgent : agent))
  }

  const deleteAgent = (id: string) => {
    setAgents((current) => current.filter((agent) => agent.id !== id))
  }

  const pageProps = {
    agents,
    onCreate: () => setCreateModalOpen(true),
    onToggleStatus: toggleAgentStatus,
    onConfigure: setAgentToConfigure,
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        agentCount={agents.length}
      />
      <div className="app-content">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<OverviewPage {...pageProps} />} />
            <Route path="/agents" element={<AgentsPage {...pageProps} />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <footer className="page-footer"><span>AgentOS</span><p>All systems operational</p></footer>
        </main>
      </div>
      <CreateAgentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={(agent) => setAgents((current) => [agent, ...current])}
      />
      <ConfigureAgentModal
        key={agentToConfigure?.id ?? 'closed'}
        agent={agentToConfigure}
        onClose={() => setAgentToConfigure(null)}
        onSave={saveAgent}
        onDelete={deleteAgent}
      />
    </div>
  )
}

export default App
