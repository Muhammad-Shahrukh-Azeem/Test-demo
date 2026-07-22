import { useState, type FormEvent } from 'react'
import { LockKeyhole, LogIn, Sparkles } from 'lucide-react'
import { getSupabase } from '../../lib/supabase'

export function AuthScreen() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const signIn = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: signInError } = await getSupabase().auth.signInWithPassword({ email, password })
    if (signInError) setError(signInError.message)
    setSubmitting(false)
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span><Sparkles size={19} /></span><strong>AgentOS</strong></div>
        <div className="auth-heading"><span><LockKeyhole size={19} /></span><h1>Sign in to your workspace</h1><p>Your Supabase account controls which agents you can access.</p></div>
        <form onSubmit={signIn}>
          <label>Email address<input autoFocus required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" disabled={submitting} type="submit"><LogIn size={16} /> {submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="auth-hint">The included seed migration creates <strong>test@example.com</strong> for development.</p>
      </section>
    </main>
  )
}
