interface AgentAvatarProps {
  label: string
  color: string
  size?: 'sm' | 'md' | 'lg'
}

export function AgentAvatar({ label, color, size = 'md' }: AgentAvatarProps) {
  return (
    <span className={`agent-avatar avatar-${color} avatar-${size}`} aria-hidden="true">
      {label}
    </span>
  )
}
