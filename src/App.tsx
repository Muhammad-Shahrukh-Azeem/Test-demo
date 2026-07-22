import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Agent, CreateAgentInput, UpdateAgentInput } from './types/agent'
import { getSupabase, isSupabaseConfigured } from './lib/supabase'
import { createAgent, fetchAgents, updateAgent } from './services/agents'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { CreateAgentModal } from './components/agents/CreateAgentModal'
import { ConfigureAgentModal } from './components/agents/ConfigureAgentModal'
import { AuthScreen } from './components/auth/AuthScreen'
import { SupabaseSetupScreen } from './components/auth/SupabaseSetupScreen'
import { OverviewPage } from './pages/OverviewPage'
import { AgentsPage } from './pages/AgentsPage'
import { ActivityPage } from './pages/ActivityPage'
import { IntegrationsPage } from './pages/IntegrationsPage'
import { SettingsPage } from './pages/SettingsPage'
import { HelpPage } from './pages/HelpPage'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [agents, setAgents] = useState<Agent[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [agentToConfigure, setAgentToConfigure] = useState<Agent | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const client = getSupabase()
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthLoading(false)
    })

    void client.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const loadAgentData = useCallback(async () => {
    setDataLoading(true)
    setDataError(null)
    try {
      setAgents(await fetchAgents())
    } catch (caughtError) {
      setDataError(caughtError instanceof Error ? caughtError.message : 'Unable to load Supabase agents.')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session) return
    const task = window.setTimeout(() => void loadAgentData(), 0)
    return () => window.clearTimeout(task)
  }, [session, loadAgentData])

  if (!isSupabaseConfigured) return <SupabaseSetupScreen />
  if (authLoading) return <div className="app-loading"><span /><p>Checking Supabase session…</p></div>
  if (!session) return <AuthScreen />

  const toggleAgentStatus = async (id: string) => {
    const agent = agents.find((item) => item.id === id)
    if (!agent) return
    setDataError(null)
    try {
      await updateAgent({ ...agent, isActive: !agent.isActive })
      await loadAgentData()
    } catch (caughtError) {
      setDataError(caughtError instanceof Error ? caughtError.message : 'Unable to update agent status.')
    }
  }

  const saveAgent = async (input: UpdateAgentInput) => {
    await updateAgent(input)
    await loadAgentData()
  }

  const addAgent = async (input: CreateAgentInput) => {
    await createAgent(input)
    await loadAgentData()
  }

  const user = session.user
  const displayName = String(user.user_metadata.full_name ?? user.user_metadata.name ?? user.email?.split('@')[0] ?? 'User')
  const email = user.email ?? ''
  const workspaceLabel = agents[0]?.businessName ?? agents[0]?.displayName ?? 'Agent workspace'

  const pageProps = {
    agents,
    onCreate: () => setCreateModalOpen(true),
    onToggleStatus: (id: string) => void toggleAgentStatus(id),
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
        workspaceLabel={workspaceLabel}
        userEmail={email}
      />
      <div className="app-content">
        <Header onMenuClick={() => setMobileMenuOpen(true)} displayName={displayName} email={email} onSignOut={() => void getSupabase().auth.signOut()} />
        <main>
          {dataError && <div className="data-error" role="alert"><span>{dataError}</span><button type="button" onClick={() => void loadAgentData()}>Try again</button></div>}
          {dataLoading && agents.length === 0 ? (
            <div className="content-loading"><span /><p>Loading your Supabase agents…</p></div>
          ) : (
            <Routes>
              <Route path="/" element={<OverviewPage {...pageProps} />} />
              <Route path="/agents" element={<AgentsPage {...pageProps} />} />
              <Route path="/activity" element={<ActivityPage agents={agents} />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
          <footer className="page-footer"><span>AgentOS · Supabase connected</span><p>Authenticated as {email}</p></footer>
        </main>
      </div>
      <CreateAgentModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={addAgent} />
      <ConfigureAgentModal key={agentToConfigure?.id ?? 'closed'} agent={agentToConfigure} onClose={() => setAgentToConfigure(null)} onSave={saveAgent} />
    </div>
  )
}

export default App
