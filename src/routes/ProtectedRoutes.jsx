import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/ui/Loader'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loader fullScreen />
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}
