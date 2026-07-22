import { ArrowRight } from 'lucide-react'
import { activities } from '../../data/agents'
import { AgentAvatar } from '../common/AgentAvatar'

export function ActivityFeed() {
  return (
    <section className="panel activity-panel">
      <div className="panel-header">
        <div><h2>Recent activity</h2><p>Latest updates across your agent team</p></div>
        <button className="text-button" type="button">View all <ArrowRight size={15} /></button>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-row" key={activity.id}>
            <div className="activity-avatar-wrap">
              <AgentAvatar label={activity.avatar} color={activity.avatarColor} size="sm" />
              <span className={`activity-dot activity-dot-${activity.tone}`} />
            </div>
            <p><strong>{activity.agentName}</strong> {activity.action} <span>{activity.target}</span></p>
            <time>{activity.timestamp}</time>
          </div>
        ))}
      </div>
    </section>
  )
}
