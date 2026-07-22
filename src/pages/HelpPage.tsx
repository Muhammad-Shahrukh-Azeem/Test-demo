import { useMemo, useState } from 'react'
import { BookOpen, ChevronRight, LifeBuoy, Mail, Search } from 'lucide-react'

const questions = [
  { title: 'How do I create a new agent?', answer: 'Open Agents, select New agent, and choose a name, role, and team. The new agent is saved locally and ready to configure.' },
  { title: 'How can I pause an agent?', answer: 'Use the Pause action on any agent card. You can also open Configure and change its runtime status directly.' },
  { title: 'Where are agent changes stored?', answer: 'This prototype stores agent configuration in your browser local storage, so changes survive refreshes on this device.' },
  { title: 'How do integrations work?', answer: 'Open Integrations from the sidebar and connect the tools an agent needs. The current integration controls demonstrate the intended flow.' },
  { title: 'What does success rate measure?', answer: 'Success rate is the percentage of agent tasks completed without an error or manual intervention.' },
]

export function HelpPage() {
  const [query, setQuery] = useState('')
  const visible = useMemo(() => questions.filter((item) => `${item.title} ${item.answer}`.toLowerCase().includes(query.toLowerCase())), [query])
  const [openQuestion, setOpenQuestion] = useState<string | null>(questions[0].title)

  return (
    <>
      <section className="help-hero">
        <span className="help-icon"><LifeBuoy size={22} /></span>
        <span className="eyebrow">Help center</span>
        <h1>How can we help?</h1>
        <p>Find guidance for managing your AI workforce.</p>
        <label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help articles…" /></label>
      </section>
      <div className="help-layout">
        <section className="faq-card">
          <div className="settings-card-heading"><span><BookOpen size={19} /></span><div><h2>Frequently asked questions</h2><p>Quick answers about AgentOS.</p></div></div>
          <div className="faq-list">
            {visible.map((item) => <button type="button" key={item.title} onClick={() => setOpenQuestion(openQuestion === item.title ? null : item.title)} className={openQuestion === item.title ? 'is-open' : ''}><span><strong>{item.title}</strong>{openQuestion === item.title && <p>{item.answer}</p>}</span><ChevronRight size={17} /></button>)}
            {visible.length === 0 && <div className="help-empty">No help articles match “{query}”.</div>}
          </div>
        </section>
        <aside className="support-card"><span><Mail size={20} /></span><h2>Still need help?</h2><p>Our support team can help with workspace setup and agent configuration.</p><a className="primary-button button-link" href="mailto:support@agentos.example">Contact support</a></aside>
      </div>
    </>
  )
}
