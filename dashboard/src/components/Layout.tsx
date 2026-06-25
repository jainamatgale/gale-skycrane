import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutGrid, LogOut, Menu, Users, X } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import galeLogo from '../assets/gale-logo.png'

const roleLabel: Record<string, string> = {
  admin: 'Administrator',
  edit: 'Editor',
  read: 'Read only',
}

export const Layout = () => {
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    setIsNavOpen(false)
  }, [location.pathname])

  const initials = currentUser?.fullName
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="layout">
      <header className="mobile-topbar">
        <div className="mobile-brand">
          <img src={galeLogo} alt="GALE Partners" />
          <span>
            GALE <strong>Skycrane</strong>
          </span>
        </div>
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setIsNavOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {isNavOpen ? <div className="nav-scrim" onClick={() => setIsNavOpen(false)} /> : null}

      <aside className={`sidebar ${isNavOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src={galeLogo} alt="GALE Partners" />
          <div>
            <span className="brand-name">GALE Skycrane</span>
            <span className="brand-sub">GALE Partners</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Workspace</span>
          <NavLink to="/dashboard" className="nav-item">
            <LayoutGrid size={18} />
            Projects
          </NavLink>
          {currentUser?.role === 'admin' ? (
            <NavLink to="/users" className="nav-item">
              <Users size={18} />
              Team &amp; Users
            </NavLink>
          ) : null}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="avatar">{initials}</span>
            <div className="sidebar-user-meta">
              <strong>{currentUser?.fullName}</strong>
              <span>{roleLabel[currentUser?.role ?? 'read']}</span>
            </div>
          </div>
          <button type="button" className="btn btn-ghost full" onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
