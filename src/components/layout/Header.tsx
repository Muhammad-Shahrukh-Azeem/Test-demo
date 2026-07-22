import { Bell, LogOut, Menu, Search } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  displayName: string
  email: string
  onSignOut: () => void
}

export function Header({ onMenuClick, displayName, email, onSignOut }: HeaderProps) {
  const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="topbar">
      <button className="mobile-menu-button" onClick={onMenuClick} type="button" aria-label="Open menu">
        <Menu size={20} />
      </button>
      <label className="global-search">
        <Search size={17} />
        <input type="search" placeholder="Search anything…" aria-label="Search anything" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <button className="icon-button has-notification" type="button" aria-label="Notifications"><Bell size={19} /></button>
        <span className="topbar-divider" />
        <button className="profile-button" type="button">
          <span className="profile-avatar">{initials || 'U'}</span>
          <span className="profile-copy"><strong>{displayName}</strong><small>{email}</small></span>
        </button>
        <button className="icon-button sign-out-button" type="button" onClick={onSignOut} aria-label="Sign out"><LogOut size={18} /></button>
      </div>
    </header>
  )
}
