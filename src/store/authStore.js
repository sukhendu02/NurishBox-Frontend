import { create } from 'zustand'
import { getAccessToken } from '../utils/token'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  initializeAuth: () => {
    const token = getAccessToken()
    set({
      isAuthenticated: !!token,
      isLoading: false,
    })
  },
}))

export default useAuthStore
