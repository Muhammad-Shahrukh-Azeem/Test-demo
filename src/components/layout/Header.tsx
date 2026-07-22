import { Bell, Menu, Search } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
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
          <span className="profile-avatar">JD</span>
          <span className="profile-copy"><strong>Jordan Davis</strong><small>Administrator</small></span>
        </button>
      </div>
    </header>
  )
}
