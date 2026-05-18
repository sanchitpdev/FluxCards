import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const LINKS = [
  { path: '/decks',    label: 'My Decks',    icon: '📚' },
  { path: '/study',    label: 'PDF Library', icon: '📄' },
  { path: '/progress', label: 'Progress',    icon: '📊' },
]

export default function Navbar() {
  const { accessToken, clearAuth } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  if (!accessToken) return null

  const logout = () => { clearAuth(); navigate('/login'); setOpen(false) }
  const close  = () => setOpen(false)

  const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px',
    borderRadius: 100, // Pill shaped link hovers
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem',
    color:      active ? 'var(--navy)' : 'var(--text-sub)',
    background: active ? 'var(--primary)' : 'transparent',
    /* Adds a bold outline to the active tab to match the new border */
    border:     active ? '2px solid var(--navy)' : '2px solid transparent',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  })

  return (
      /* Wrapper handles the sticky positioning and side margins */
      <div style={{ position: 'sticky', top: 16, zIndex: 300, padding: '0 clamp(16px, 4vw, 32px)' }}>

        {/* ── Main Floating Pill Bar ── */}
        <nav style={{
          maxWidth: 1400, margin: '0 auto',
          height: 76,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '3px solid var(--navy)', /* The bold dark border you requested! */
          borderRadius: 100, /* Makes the whole nav bar a floating pill */
          display: 'flex', alignItems: 'center',
          padding: '0 12px 0 32px',
          boxShadow: '0 12px 32px rgba(11, 19, 43, 0.12), 0 4px 12px rgba(11, 19, 43, 0.08)',
          gap: 12,
          position: 'relative'
        }}>

          {/* Brand */}
          <Link to="/decks" onClick={close} style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: '1.6rem', letterSpacing: '0.04em',
            color: 'var(--navy)', textDecoration: 'none',
            marginRight: 24, flexShrink: 0,
          }}>
            FluxCards
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 4, flex: 1, alignItems: 'center' }}>
            {LINKS.map(l => {
              const active = location.pathname.startsWith(l.path)
              return (
                  <Link key={l.path} to={l.path} style={linkStyle(active)}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(11, 19, 43, 0.05)' }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{l.icon}</span>{l.label}
                  </Link>
              )
            })}
          </div>

          {/* Sign Out — desktop */}
          <button onClick={logout} className="nav-desktop" style={{
            background: 'white', color: 'var(--navy)',
            border: '2px solid var(--navy)', borderRadius: 100,
            padding: '10px 24px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem',
            display: 'flex', alignItems: 'center', gap: 7,
            transition: 'all 0.2s ease', flexShrink: 0,
          }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--navy)'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.color='var(--navy)' }}
          >
            Sign Out
          </button>

          {/* Hamburger — mobile */}
          <button onClick={() => setOpen(o => !o)} className="nav-mobile" style={{
            marginLeft: 'auto', background: open ? 'var(--navy)' : 'var(--primary-light)',
            border: open ? '2px solid var(--navy)' : '2px solid transparent',
            cursor: 'pointer', color: open ? 'white' : 'var(--primary-dark)', fontSize: '1.4rem',
            display: 'none', padding: '8px 16px', borderRadius: 100, lineHeight: 1,
            transition: 'all 0.2s'
          }}>
            {open ? '✕' : '☰'}
          </button>
        </nav>

        {/* ── Mobile Floating Menu Drawer ── */}
        {open && (
            <div className="nav-mobile" style={{
              position: 'absolute', top: 92, left: 'clamp(16px, 4vw, 32px)', right: 'clamp(16px, 4vw, 32px)',
              zIndex: 299, maxWidth: 1400, margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(12px)',
              border: '3px solid var(--navy)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: '0 16px 40px rgba(11, 19, 43, 0.15)',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {LINKS.map(l => {
                const active = location.pathname.startsWith(l.path)
                return (
                    <Link key={l.path} to={l.path} onClick={close} style={{
                      ...linkStyle(active),
                      fontSize: '1.15rem', padding: '14px 20px',
                      background: active ? 'var(--primary)' : 'rgba(11, 19, 43, 0.03)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <span style={{ fontSize: '1.4rem' }}>{l.icon}</span>{l.label}
                    </Link>
                )
              })}
              <div style={{ borderTop: '2px solid var(--border)', marginTop: 12, paddingTop: 20 }}>
                <button onClick={logout} style={{
                  width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-md)',
                  background: 'white', border: '2px solid var(--navy)', cursor: 'pointer',
                  color: 'var(--navy)', fontFamily: 'var(--font-display)',
                  fontWeight: 900, fontSize: '1.1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  🚪 Sign Out
                </button>
              </div>
            </div>
        )}

        {/* Responsive rules — injected once per render */}
        <style>{`
        @media (max-width: 820px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
        @media (min-width: 821px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
      </div>
  )
}