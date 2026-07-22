interface AgentAvatarProps {
  label: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  imageUrl?: string | null
  backgroundColor?: string
}

export function AgentAvatar({ label, color, size = 'md', imageUrl, backgroundColor }: AgentAvatarProps) {
  return (
    <span className={`agent-avatar avatar-${color} avatar-${size}`} style={backgroundColor ? { background: backgroundColor } : undefined} aria-hidden="true">
      {label}
      {imageUrl && <img src={imageUrl} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />}
    </span>
  )
}
