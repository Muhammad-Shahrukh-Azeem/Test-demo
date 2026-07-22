import { useState, type FormEvent } from 'react'
import { BellRing, Check, RotateCcw, Save, ShieldCheck } from 'lucide-react'

interface WorkspaceSettings {
  workspaceName: string
  timezone: string
  approvalMode: boolean
  emailDigest: boolean
  errorAlerts: boolean
}

const defaults: WorkspaceSettings = {
  workspaceName: 'Acme, Inc.',
  timezone: 'Asia/Karachi',
  approvalMode: true,
  emailDigest: true,
  errorAlerts: true,
}

function loadSettings(): WorkspaceSettings {
  try {
    const saved = localStorage.getItem('agentos-settings')
    return saved ? { ...defaults, ...JSON.parse(saved) as WorkspaceSettings } : defaults
  } catch {
    return defaults
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    localStorage.setItem('agentos-settings', JSON.stringify(settings))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  const update = <Key extends keyof WorkspaceSettings>(key: Key, value: WorkspaceSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  return (
    <>
      <section className="page-intro"><div><span className="eyebrow">Workspace controls</span><h1>Settings</h1><p>Configure workspace defaults, permissions, and notifications.</p></div>{saved && <span className="saved-message"><Check size={14} /> Changes saved</span>}</section>
      <form className="settings-layout" onSubmit={submit}>
        <section className="settings-card">
          <div className="settings-card-heading"><span><ShieldCheck size={19} /></span><div><h2>General settings</h2><p>Core preferences for your AgentOS workspace.</p></div></div>
          <div className="settings-fields">
            <label>Workspace name<input value={settings.workspaceName} onChange={(event) => update('workspaceName', event.target.value)} /></label>
            <label>Timezone<select value={settings.timezone} onChange={(event) => update('timezone', event.target.value)}><option>Asia/Karachi</option><option>Australia/Sydney</option><option>America/New_York</option><option>Europe/London</option><option>UTC</option></select></label>
            <div className="toggle-row"><div><strong>Require approval for sensitive actions</strong><p>Agents pause before actions involving external systems.</p></div><button className={`toggle ${settings.approvalMode ? 'is-on' : ''}`} type="button" onClick={() => update('approvalMode', !settings.approvalMode)} aria-label="Toggle approval mode"><span /></button></div>
          </div>
        </section>
        <section className="settings-card">
          <div className="settings-card-heading"><span><BellRing size={19} /></span><div><h2>Notifications</h2><p>Choose which workspace updates you receive.</p></div></div>
          <div className="settings-fields">
            <div className="toggle-row"><div><strong>Weekly performance digest</strong><p>A weekly email summarizing agent performance.</p></div><button className={`toggle ${settings.emailDigest ? 'is-on' : ''}`} type="button" onClick={() => update('emailDigest', !settings.emailDigest)} aria-label="Toggle weekly digest"><span /></button></div>
            <div className="toggle-row"><div><strong>Agent error alerts</strong><p>Notify administrators when an agent needs attention.</p></div><button className={`toggle ${settings.errorAlerts ? 'is-on' : ''}`} type="button" onClick={() => update('errorAlerts', !settings.errorAlerts)} aria-label="Toggle error alerts"><span /></button></div>
          </div>
        </section>
        <div className="settings-actions"><button className="secondary-button" type="button" onClick={() => setSettings(defaults)}><RotateCcw size={15} /> Restore defaults</button><button className="primary-button" type="submit"><Save size={15} /> Save changes</button></div>
      </form>
    </>
  )
}
