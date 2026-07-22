import { useState } from 'react'
import { Boxes, Check, Cloud, GitBranch, MessageSquare, PlugZap, Webhook, Workflow } from 'lucide-react'

const initialIntegrations = [
  { id: 'slack', name: 'Slack', description: 'Send alerts and agent updates to your team channels.', icon: MessageSquare, color: 'purple', connected: true },
  { id: 'github', name: 'GitHub', description: 'Let engineering agents inspect issues and pull requests.', icon: GitBranch, color: 'dark', connected: true },
  { id: 'drive', name: 'Cloud Drive', description: 'Give agents secure access to workspace documents.', icon: Cloud, color: 'blue', connected: false },
  { id: 'webhook', name: 'Webhooks', description: 'Trigger external workflows when agent events occur.', icon: Webhook, color: 'orange', connected: false },
  { id: 'automation', name: 'Automation Hub', description: 'Connect agent actions to your business workflows.', icon: Workflow, color: 'green', connected: false },
]

export function IntegrationsPage() {
  const [items, setItems] = useState(initialIntegrations)
  const toggle = (id: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, connected: !item.connected } : item))

  return (
    <>
      <section className="page-intro">
        <div><span className="eyebrow">Connected tools</span><h1>Integrations</h1><p>Connect the services your agents need to complete work.</p></div>
        <button className="secondary-button" type="button"><PlugZap size={16} /> Request integration</button>
      </section>
      <div className="integration-notice"><Boxes size={18} /><div><strong>{items.filter((item) => item.connected).length} integrations connected</strong><p>Connections in this prototype are stored for the current session.</p></div></div>
      <section className="integration-grid">
        {items.map((item) => (
          <article className="integration-card" key={item.id}>
            <div className={`integration-icon integration-icon-${item.color}`}><item.icon size={22} /></div>
            <div className="integration-copy"><h2>{item.name}</h2><p>{item.description}</p></div>
            <div className="integration-footer">
              <span className={item.connected ? 'connected-label' : 'available-label'}>{item.connected ? <><Check size={13} /> Connected</> : 'Available'}</span>
              <button className={item.connected ? 'secondary-button compact-button' : 'primary-button compact-button'} type="button" onClick={() => toggle(item.id)}>{item.connected ? 'Disconnect' : 'Connect'}</button>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
