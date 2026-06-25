import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export const ProtectedRoute = () => {
  const { currentUser, isReady } = useAuth()

  if (!isReady) {
    return <div className="loading-screen">Loading GALE Skycrane...</div>
  }

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
