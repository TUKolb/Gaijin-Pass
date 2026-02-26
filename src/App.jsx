import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Layout from './components/Layout'

import LandingPage     from './pages/LandingPage'
import GuidebookPage   from './pages/GuidebookPage'
import PostsFeedPage   from './pages/PostsFeedPage'
import PostDetailPage  from './pages/PostDetailPage'
import PostCreatePage  from './pages/PostCreatePage'
import ProfilePage     from './pages/ProfilePage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import AdminPage       from './pages/AdminPage'

// Protect routes that require login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

// Protect admin-only routes
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
  // TODO: check user.user_metadata.role === 'admin' or similar once RLS roles are set up
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/guidebook"  element={<GuidebookPage />} />
            <Route path="/posts"      element={<PostsFeedPage />} />
            <Route path="/posts/:id"  element={<PostDetailPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />

            {/* Auth-protected routes */}
            <Route path="/posts/new"  element={<PrivateRoute><PostCreatePage /></PrivateRoute>} />
            <Route path="/profile"    element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            {/* Admin-only routes */}
            <Route path="/admin"      element={<AdminRoute><AdminPage /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
