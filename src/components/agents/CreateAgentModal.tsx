import { useEffect, useState, type FormEvent } from 'react'
import { Bot, X } from 'lucide-react'
import type { CreateAgentInput } from '../../types/agent'

interface CreateAgentModalProps {
  open: boolean
  onClose: () => void
  onCreate: (input: CreateAgentInput) => Promise<void>
}

const toSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function CreateAgentModal({ open, onClose, onCreate }: CreateAgentModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [slug, setSlug] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [primaryEmail, setPrimaryEmail] = useState('')
  const [primaryPhone, setPrimaryPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onCreate({ displayName, slug, businessName, primaryEmail, primaryPhone })
      setDisplayName('')
      setSlug('')
      setBusinessName('')
      setPrimaryEmail('')
      setPrimaryPhone('')
      onClose()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to create agent.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="create-agent-title">
        <div className="modal-header">
          <span className="modal-icon"><Bot size={20} /></span>
          <div><h2 id="create-agent-title">Create a new agent</h2><p>This calls the authenticated Supabase agent creation function.</p></div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Display name<input autoFocus required value={displayName} onChange={(event) => { setDisplayName(event.target.value); setSlug(toSlug(event.target.value)) }} placeholder="DV Buyers Agency" /></label>
            <label>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(toSlug(event.target.value))} placeholder="dv-buyers-agency" /></label>
          </div>
          <label>Business name<input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Registered business name" /></label>
          <div className="form-grid">
            <label>Primary email<input type="email" value={primaryEmail} onChange={(event) => setPrimaryEmail(event.target.value)} placeholder="agent@example.com" /></label>
            <label>Primary phone<input value={primaryPhone} onChange={(event) => setPrimaryPhone(event.target.value)} placeholder="+61…" /></label>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={submitting} type="submit">{submitting ? 'Creating…' : 'Create agent'}</button></div>
        </form>
      </div>
    </div>
  )
}
