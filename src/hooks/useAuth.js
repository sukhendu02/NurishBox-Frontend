import useAuthStore from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)
  const initializeAuth = useAuthStore((s) => s.initializeAuth)

  return { user, isAuthenticated, isLoading, setUser, clearUser, initializeAuth }
}
