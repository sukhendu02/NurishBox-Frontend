import { create } from 'zustand'
import { getAddresses } from '../api/user.api.js' // ← adjust path if needed
import useAuthStore from './authStore'
import { getAccessToken } from '../utils/token.js'
import {useProductStore} from "./productStore.js"
import api from '../api/axios.js'
// ─── Shape reference ──────────────────────────────────────────────────────────
//
// Current location:
//   { type: 'current_location', label: 'Your location', coords: { lat, lng } }
//
// Saved address:
//   { type: 'saved', address_id, label, line1, line2, city, pincode, is_default }
//
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'selectedAddressId'

// ─── Helper: get browser geolocation ─────────────────────────────────────────

function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ type: 'current_location', label: 'Your location', coords: null })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        type: 'current_location',
        label: 'Your location',
        coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      }),
      () => resolve({ type: 'current_location', label: 'Your location', coords: null })
    )
  })
}

// ─── Store ────────────────────────────────────────────────────────────────────

// const useAddressStore = create((set) => ({
  const useAddressStore = create((set, get) => ({
  selectedAddress: null,
  addresses: [],
  loadingAddress: true,

  // ── Persist + set selected address ───────────────────────────────────────
  setSelectedAddress: (address) => {
    if (address?.type === 'saved') {
    //   localStorage.setItem(STORAGE_KEY, String(address.address_id))
    
    localStorage.setItem(STORAGE_KEY, String(address.id))
     api.defaults.headers.common['X-Address-Id'] = address.id
    } else {
      localStorage.removeItem(STORAGE_KEY)
      delete api.defaults.headers.common['X-Address-Id']
    }
    set({ selectedAddress: address })
    useProductStore.getState().fetchProducts()
  },

  // ── Main init — reads isAuthenticated directly from authStore ─────────────
//   initAddress: async () => {
//     set({ loadingAddress: true })

//     // Read auth state directly from authStore at call time — always up to date
//     const isAuthenticated = useAuthStore.getState().isAuthenticated
// console.log('isAuthenticated:', isAuthenticated)
//   console.log('token:', getAccessToken())
//     if (!isAuthenticated) {
//       const location = await getCurrentLocation()
//       set({ selectedAddress: location, addresses: [], loadingAddress: false })
//       return
//     }

//     try {
//       const fetched = await getAddresses()
      
// console.log('raw getAddresses response:', fetched)
//       const list = fetched?.data?.allAddresses ?? []
//       if (list.length === 0) {
//         const location = await getCurrentLocation()
//         set({ selectedAddress: location, addresses: [], loadingAddress: false })
//         return
//       }

//       const lastSelectedId = localStorage.getItem(STORAGE_KEY)
//     //   const lastSelected   = lastSelectedId && list.find(a => String(a.address_id) === lastSelectedId)
//       const lastSelected = lastSelectedId && list.find(a => String(a.id) === lastSelectedId)

//       const defaultAddress = list.find(a => a.is_default) ?? list[0]


//       set({
//         addresses: list,
//         selectedAddress: { type: 'saved', ...(lastSelected || defaultAddress) },
//         loadingAddress: false,
//       })
//     } catch {
//       const location = await getCurrentLocation()
//       set({ selectedAddress: location, addresses: [], loadingAddress: false })
//     }
//   },
initAddress: async () => {
  set({ loadingAddress: true })

  const isAuthenticated = useAuthStore.getState().isAuthenticated
  const token = getAccessToken()

  if (!isAuthenticated || !token) {
    const location = await getCurrentLocation()
    get().setSelectedAddress(location)
    set({ addresses: [], loadingAddress: false })
    return
  }

  try {
    const fetched = await getAddresses()
    const list = fetched?.data?.allAddresses ?? []

    if (list.length === 0) {
      const location = await getCurrentLocation()
      get().setSelectedAddress(location)
      set({ addresses: [], loadingAddress: false })
      return
    }

    const lastSelectedId = localStorage.getItem(STORAGE_KEY)
    const lastSelected   = lastSelectedId && list.find(a => String(a.id) === lastSelectedId)
    const defaultAddress = list.find(a => a.isDefault) ?? list[0]

    get().setSelectedAddress({ type: 'saved', ...(lastSelected || defaultAddress) })
    set({ addresses: list, loadingAddress: false })

  } catch {
    const location = await getCurrentLocation()
    get().setSelectedAddress(location)
    set({ addresses: [], loadingAddress: false })
  }
},



  // ── Call on logout to reset everything ────────────────────────────────────
  resetAddress: async () => {
    localStorage.removeItem(STORAGE_KEY)
    const location = await getCurrentLocation()
    set({ selectedAddress: location, addresses: [], loadingAddress: false })
  },
}))

export default useAddressStore