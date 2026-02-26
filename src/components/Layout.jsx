import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch {
      alert('Sign out not yet implemented — wire up AuthContext first.')
    }
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          Gaijin<span>Pass</span>
        </NavLink>

        <ul className="navbar-links">
          <li><NavLink to="/guidebook">Guidebook</NavLink></li>
          <li><NavLink to="/posts">Posts</NavLink></li>

          {user ? (
            <>
              <li><NavLink to="/profile">Profile</NavLink></li>
              {/* TODO: show Admin link only for admin users */}
              <li><NavLink to="/admin">Admin</NavLink></li>
              <li>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li>
                <NavLink to="/register">
                  <button className="btn btn-primary btn-sm">Register</button>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Gaijin Pass · Built for newcomers to Japan
      </footer>
    </div>
  )
}
