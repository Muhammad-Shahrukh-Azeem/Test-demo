export type AgentStatus = 'active' | 'idle' | 'paused' | 'error'
export type AgentCategory = 'Customer Success' | 'Operations' | 'Engineering' | 'Growth'

export interface Agent {
  id: string
  name: string
  role: string
  description: string
  status: AgentStatus
  category: AgentCategory
  avatar: string
  avatarColor: string
  tasksCompleted: number
  successRate: number
  avgResponse: string
  currentTask?: string
  lastActive: string
}

export interface Activity {
  id: string
  agentId: string
  agentName: string
  avatar: string
  avatarColor: string
  action: string
  target: string
  timestamp: string
  tone: 'success' | 'info' | 'warning'
}
