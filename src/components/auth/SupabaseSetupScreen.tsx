import { Database, FileCode2 } from 'lucide-react'

export function SupabaseSetupScreen() {
  return (
    <main className="auth-page">
      <section className="auth-card setup-card">
        <div className="auth-brand"><span><Database size={19} /></span><strong>Connect Supabase</strong></div>
        <div className="auth-heading"><span><FileCode2 size={19} /></span><h1>Cloud credentials required</h1><p>The UI is connected to Supabase, but this project's <code>.env</code> file is empty.</p></div>
        <div className="setup-values">
          <code>VITE_SUPABASE_URL=https://…supabase.co</code>
          <code>VITE_SUPABASE_ANON_KEY=your-publishable-key</code>
        </div>
        <p className="auth-hint">Copy <strong>.env.example</strong> into <strong>.env</strong>, add your project values, then restart Vite.</p>
      </section>
    </main>
  )
}
