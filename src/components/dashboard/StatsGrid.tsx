import { Bot, CheckCircle2, CircleDollarSign, Zap } from 'lucide-react'
import type { Agent } from '../../types/agent'

interface StatsGridProps {
  agents: Agent[]
}

export function StatsGrid({ agents }: StatsGridProps) {
  const activeAgents = agents.filter((agent) => agent.status === 'active').length
  const completedTasks = agents.reduce((total, agent) => total + agent.tasksCompleted, 0)
  const successRate = agents.reduce((total, agent) => total + agent.successRate, 0) / agents.length

  const stats = [
    { label: 'Active agents', value: activeAgents.toString(), helper: `of ${agents.length} total agents`, change: '+1 this week', icon: Bot, color: 'purple' },
    { label: 'Tasks completed', value: completedTasks.toLocaleString(), helper: 'across all agents', change: '+12.5%', icon: CheckCircle2, color: 'blue' },
    { label: 'Avg. success rate', value: `${successRate.toFixed(1)}%`, helper: 'last 30 days', change: '+2.1%', icon: Zap, color: 'green' },
    { label: 'Estimated savings', value: '$18.4k', helper: 'this month', change: '+8.3%', icon: CircleDollarSign, color: 'orange' },
  ]

  return (
    <section className="stats-grid" aria-label="Agent statistics">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <div className={`stat-icon stat-icon-${stat.color}`}><stat.icon size={20} /></div>
          <div className="stat-heading"><span>{stat.label}</span><span className="stat-change">{stat.change}</span></div>
          <strong className="stat-value">{stat.value}</strong>
          <p>{stat.helper}</p>
        </article>
      ))}
    </section>
  )
}
