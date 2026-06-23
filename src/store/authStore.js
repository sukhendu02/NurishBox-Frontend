import { create } from 'zustand'
import { getAccessToken } from '../utils/token'
import useAddressStore from './addressStrore'

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

  clearUser: () =>{
    set({ user: null, isAuthenticated: false }),
      useAddressStore.getState().resetAddress() 
  } 

 
}))

export default useAuthStore
