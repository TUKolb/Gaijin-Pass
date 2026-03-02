import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Gaijin Pass
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/guidebook" className="text-gray-600 hover:text-blue-600">
            Guidebook
          </Link>
          <Link to="/posts" className="text-gray-600 hover:text-blue-600">
            Posts
          </Link>

          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="text-orange-600 hover:text-orange-800 font-medium">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
