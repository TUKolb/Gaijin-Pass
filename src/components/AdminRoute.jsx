import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="flex justify-center p-8">Loading...</div>
  if (!user || profile?.role !== 'admin') return <Navigate to="/" replace />

  return children
}
