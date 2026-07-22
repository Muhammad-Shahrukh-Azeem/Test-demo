import { useEffect, useState, type FormEvent } from 'react'
import { Settings2, Trash2, X } from 'lucide-react'
import type { Agent, AgentCategory, AgentStatus } from '../../types/agent'

interface ConfigureAgentModalProps {
  agent: Agent | null
  onClose: () => void
  onSave: (agent: Agent) => void
  onDelete: (id: string) => void
}

export function ConfigureAgentModal({ agent, onClose, onSave, onDelete }: ConfigureAgentModalProps) {
  const [draft, setDraft] = useState<Agent | null>(agent)

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const avatar = draft.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    onSave({ ...draft, avatar })
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="configure-agent-title">
        <div className="modal-header">
          <span className="modal-icon"><Settings2 size={20} /></span>
          <div><h2 id="configure-agent-title">Configure {agent?.name}</h2><p>Update this agent's identity, assignment, and runtime status.</p></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Agent name<input required value={draft.name} onChange={(event) => update('name', event.target.value)} /></label>
            <label>Role<input required value={draft.role} onChange={(event) => update('role', event.target.value)} /></label>
            <label>Team
              <select value={draft.category} onChange={(event) => update('category', event.target.value as AgentCategory)}>
                <option>Operations</option><option>Customer Success</option><option>Engineering</option><option>Growth</option>
              </select>
            </label>
            <label>Status
              <select value={draft.status} onChange={(event) => update('status', event.target.value as AgentStatus)}>
                <option value="active">Working</option><option value="idle">Available</option><option value="paused">Paused</option><option value="error">Needs attention</option>
              </select>
            </label>
          </div>
          <label>Description<textarea required rows={3} value={draft.description} onChange={(event) => update('description', event.target.value)} /></label>
          <label>Current task<input value={draft.currentTask ?? ''} onChange={(event) => update('currentTask', event.target.value || undefined)} placeholder="No task assigned" /></label>
          <div className="modal-actions modal-actions-split">
            <button className="danger-button" type="button" onClick={() => { onDelete(draft.id); onClose() }}><Trash2 size={15} /> Delete agent</button>
            <div><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save changes</button></div>
          </div>
        </form>
      </div>
    </div>
  )
}
