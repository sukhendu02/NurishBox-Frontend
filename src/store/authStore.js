import { create } from 'zustand'
import { getAccessToken } from '../utils/token'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

   initializeAuth: () => {
    const token = getAccessToken()
    set({
      isAuthenticated: !!token,
      isLoading: false,
    })
  },

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

 
}))

export default useAuthStore
