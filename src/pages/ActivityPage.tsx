import { useState } from 'react'
import { Activity, CheckCircle2, Clock3, TriangleAlert } from 'lucide-react'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'

export function ActivityPage() {
  const [range, setRange] = useState('24h')

  return (
    <>
      <section className="page-intro">
        <div><span className="eyebrow">Runtime history</span><h1>Agent activity</h1><p>Review completed work, running tasks, and events that need attention.</p></div>
        <label className="standalone-select">Time range<select value={range} onChange={(event) => setRange(event.target.value)}><option value="24h">Last 24 hours</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select></label>
      </section>
      <section className="summary-strip">
        <article><span className="summary-icon success"><CheckCircle2 size={18} /></span><div><strong>186</strong><p>Completed events</p></div></article>
        <article><span className="summary-icon info"><Activity size={18} /></span><div><strong>4</strong><p>Tasks running now</p></div></article>
        <article><span className="summary-icon neutral"><Clock3 size={18} /></span><div><strong>22m</strong><p>Avg. task duration</p></div></article>
        <article><span className="summary-icon warning"><TriangleAlert size={18} /></span><div><strong>1</strong><p>Requires attention</p></div></article>
      </section>
      <ActivityFeed />
    </>
  )
}
