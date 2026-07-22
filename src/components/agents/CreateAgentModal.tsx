import { useEffect, useState, type FormEvent } from 'react'
import { Bot, X } from 'lucide-react'
import type { Agent, AgentCategory } from '../../types/agent'

interface CreateAgentModalProps {
  open: boolean
  onClose: () => void
  onCreate: (agent: Agent) => void
}

export function CreateAgentModal({ open, onClose, onCreate }: CreateAgentModalProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [category, setCategory] = useState<AgentCategory>('Operations')

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    onCreate({
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      name,
      role,
      category,
      description: `A new ${role.toLowerCase()} ready to join your autonomous team.`,
      status: 'idle',
      avatar: initials,
      avatarColor: 'violet',
      tasksCompleted: 0,
      successRate: 100,
      avgResponse: '—',
      lastActive: 'just now',
    })
    setName('')
    setRole('')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="create-agent-title">
        <div className="modal-header">
          <span className="modal-icon"><Bot size={20} /></span>
          <div><h2 id="create-agent-title">Create a new agent</h2><p>Add a specialist to your AI team.</p></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Agent name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Scout" /></label>
          <label>Role<input required value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Lead qualification agent" /></label>
          <label>Team<select value={category} onChange={(event) => setCategory(event.target.value as AgentCategory)}><option>Operations</option><option>Customer Success</option><option>Engineering</option><option>Growth</option></select></label>
          <div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Create agent</button></div>
        </form>
      </div>
    </div>
  )
}
