import {
  Activity,
  Bot,
  Boxes,
  ChevronLeft,
  Gauge,
  LifeBuoy,
  Settings,
  Sparkles,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  agentCount: number
  workspaceLabel: string
  userEmail: string
}

const primaryItems = [
  { label: 'Overview', icon: Gauge, path: '/' },
  { label: 'Agents', icon: Bot, path: '/agents', hasCount: true },
  { label: 'Activity', icon: Activity, path: '/activity' },
  { label: 'Integrations', icon: Boxes, path: '/integrations' },
]

const secondaryItems = [
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Help center', icon: LifeBuoy, path: '/help' },
]

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, agentCount, workspaceLabel, userEmail }: SidebarProps) {
  const initials = workspaceLabel.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return (
    <>
      <button
        className={`sidebar-scrim ${mobileOpen ? 'is-visible' : ''}`}
        onClick={onMobileClose}
        aria-label="Close navigation"
      />
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={18} strokeWidth={2.4} /></div>
          <div className="brand-copy">
            <span className="brand-name">AgentOS</span>
            <span className="brand-edition">Command center</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-section-label">Workspace</p>
          {primaryItems.map((item) => (
            <NavLink className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`} end={item.path === '/'} key={item.label} to={item.path} title={collapsed ? item.label : undefined} onClick={onMobileClose}>
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.hasCount && <small>{agentCount}</small>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <nav className="sidebar-nav" aria-label="Secondary navigation">
            {secondaryItems.map((item) => (
              <NavLink className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`} key={item.label} to={item.path} title={collapsed ? item.label : undefined} onClick={onMobileClose}>
                <item.icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="workspace-card">
            <span className="workspace-avatar">{initials || 'AG'}</span>
            <div><strong>{workspaceLabel}</strong><span>{userEmail}</span></div>
          </div>
          <button className="collapse-button" onClick={onToggle} type="button">
            <ChevronLeft size={17} />
            <span>Collapse sidebar</span>
          </button>
        </div>
      </aside>
    </>
  )
}
