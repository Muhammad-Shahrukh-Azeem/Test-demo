import { useEffect, useState, type FormEvent } from 'react'
import { Settings2, X } from 'lucide-react'
import type { Agent, AgentTheme, UpdateAgentInput } from '../../types/agent'

interface ConfigureAgentModalProps {
  agent: Agent | null
  onClose: () => void
  onSave: (input: UpdateAgentInput) => Promise<void>
}

export function ConfigureAgentModal({ agent, onClose, onSave }: ConfigureAgentModalProps) {
  const [draft, setDraft] = useState<Agent | null>(agent)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!agent) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [agent, onClose])

  if (!draft) return null

  const update = <Key extends keyof Agent>(key: Key, value: Agent[Key]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSave(draft)
      onClose()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to update agent.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="configure-agent-title">
        <div className="modal-header">
          <span className="modal-icon"><Settings2 size={20} /></span>
          <div><h2 id="configure-agent-title">Configure {agent?.displayName}</h2><p>Changes are written to the agents, public profile, and branding tables.</p></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-section-title">Identity</div>
          <div className="form-grid">
            <label>Display name<input required value={draft.displayName} onChange={(event) => update('displayName', event.target.value)} /></label>
            <label>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={(event) => update('slug', event.target.value)} /></label>
            <label>Business name<input value={draft.businessName ?? ''} onChange={(event) => update('businessName', event.target.value || null)} /></label>
            <label>Legal name<input value={draft.legalName ?? ''} onChange={(event) => update('legalName', event.target.value || null)} /></label>
            <label>ABN<input value={draft.abn ?? ''} onChange={(event) => update('abn', event.target.value || null)} /></label>
            <label>License number<input value={draft.licenseNumber ?? ''} onChange={(event) => update('licenseNumber', event.target.value || null)} /></label>
          </div>
          <div className="modal-section-title">Contact and location</div>
          <div className="form-grid">
            <label>Primary email<input type="email" value={draft.primaryEmail ?? ''} onChange={(event) => update('primaryEmail', event.target.value || null)} /></label>
            <label>Primary phone<input value={draft.primaryPhone ?? ''} onChange={(event) => update('primaryPhone', event.target.value || null)} /></label>
            <label>Website URL<input type="url" value={draft.websiteUrl ?? ''} onChange={(event) => update('websiteUrl', event.target.value || null)} /></label>
            <label>Service area<input value={draft.serviceArea ?? ''} onChange={(event) => update('serviceArea', event.target.value || null)} /></label>
            <label>Timezone<input value={draft.timezone} onChange={(event) => update('timezone', event.target.value)} /></label>
            <label>Locale<input value={draft.locale} onChange={(event) => update('locale', event.target.value)} /></label>
          </div>
          <div className="modal-section-title">Public profile</div>
          <label>Headline<input value={draft.headline ?? ''} onChange={(event) => update('headline', event.target.value || null)} /></label>
          <label>Bio<textarea rows={3} value={draft.bio ?? ''} onChange={(event) => update('bio', event.target.value || null)} /></label>
          <div className="modal-section-title">Branding and availability</div>
          <div className="form-grid">
            <label>Primary color<input type="color" value={draft.primaryColor} onChange={(event) => update('primaryColor', event.target.value)} /></label>
            <label>Theme<select value={draft.theme} onChange={(event) => update('theme', event.target.value as AgentTheme)}><option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option></select></label>
          </div>
          <div className="toggle-row modal-toggle"><div><strong>Agent is active</strong><p>Inactive agents are excluded from the public agent directory.</p></div><button className={`toggle ${draft.isActive ? 'is-on' : ''}`} type="button" onClick={() => update('isActive', !draft.isActive)}><span /></button></div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions"><span className="member-role-note">Your role: {draft.membershipRole}</span><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={submitting} type="submit">{submitting ? 'Saving…' : 'Save changes'}</button></div>
        </form>
      </div>
    </div>
  )
}
