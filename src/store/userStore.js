import { create } from 'zustand'
import {
  getProfile,
  updateProfile,
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getMyOrders,
} from '../api/user.api'
import toast from 'react-hot-toast'

const useUserStore = create((set, get) => ({
  profile: null,
  addresses: [],
  isLoadingProfile: false,
  isLoadingAddresses: false,
  isSaving: false,

  fetchProfile: async () => {
    try {
      set({ isLoadingProfile: true })
      const response = await getProfile()
      if (response.success) {
        set({ profile: response.data })
      } else {
        toast.error(response.error?.message || 'Failed to load profile', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load profile', {
        style: { background: '#ef4444', color: 'white' },
      })
    } finally {
      set({ isLoadingProfile: false })
    }
  },

  updateProfile: async (data) => {
      const previousProfile = get().profile  // ← save for rollback

     set(state => ({ profile: { ...state.profile, ...data } }))
    try {
      set({ isSaving: true })
      const response = await updateProfile(data)
      if (response.success) {
        set({ profile: response.data })
          set(state => ({ profile: { ...state.profile, ...response.data } }))
        toast.success('Profile updated', {
          style: { background: '#0D9E7E', color: 'white' },
        })
        return true
      } else {
        toast.error(response.error?.message || 'Failed to update profile', {
          style: { background: '#ef4444', color: 'white' },
        })
        return false
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile', {
        style: { background: '#ef4444', color: 'white' },
      })
      return false
    } finally {
      set({ isSaving: false })
    }
  },

  fetchAddresses: async () => {
        //  set(state => ({ profile: { ...state.profile, ...data } }))
    try {
      set({ isLoadingAddresses: true })
      const response = await getAddresses()
      if (response.success) {
        set({ addresses: response.data.allAddresses?? [] })
      } else {
        toast.error(response.error?.message || 'Failed to load addresses', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load addresses', {
        style: { background: '#ef4444', color: 'white' },
      })
    } finally {
      set({ isLoadingAddresses: false })
    }
  },

  addAddress: async (data) => {
    try {
      set({ isSaving: true })
      const response = await createAddress(data)
      if (response.success) {
        const newAddress = response.data
        set((state) => {
          const updated = [newAddress, ...state.addresses]
          if (newAddress.isDefault) {
            return {
              addresses: updated.map((addr) =>
                addr.id === newAddress.id ? addr : { ...addr, isDefault: false }
              ),
            }
          }
          return { addresses: updated }
        })
        toast.success('Address added', {
          style: { background: 'white', color: 'gray', fontSize:'13px'  },
        })
        
        return { ok: true } 
      } else {
        
        toast.error(response.error?.message || 'Failed to add address', {
          style: { background: '#ef4444', color: 'white' },
        })
        return false
        

// return {
//    ok: false,
//   error: response.error?.message      // ← .message, not the whole object
//       || response.message
//       || response.error
//       || 'Failed to add address',
// }
      }
    } catch (error) {
   console.log(error)
      // toast.error(error.message || 'Failed to add address', {
      //   style: { background: 'white', color: 'grey' },
      // })

      const status = error?.response?.status
    const message = error?.response?.data?.message
                 || error?.response?.data?.error?.message
                 || error?.response?.data?.error
                 || error.message
                 || 'Failed to add address'

    // 400 / 422 = validation error → show inside form, no toast
    if (status === 400 || status === 422) {
      return { ok: false, error: message }
    }

    // Everything else (500, network) → toast
    toast.error(message, {
      style: { background: '#ef4444', color: 'white' },
    })
    return { ok: false, error: null }

      return false
    } finally {
      set({ isSaving: false })
    }
  },

  updateAddress: async (id, data) => {
    try {
      set({ isSaving: true })
      const response = await updateAddress(id, data)
      if (response.success) {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? response.data : addr
          ),
        }))
        toast.success('Address updated', {
          style: { background: 'white', color: 'gray', fontSize:"13px" },
        })
     
        return { ok: true } 
      } else {
        toast.error(response.error?.message || 'Failed to update address', {
          style: { background: '#ef4444', color: 'white' },
        })
        return false
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update address', {
        style: { background: '#ef4444', color: 'white' },
      })
      return false
    } finally {
      set({ isSaving: false })
    }
  },

  setDefaultAddress: async (id) => {
    try {
      set({ isSaving: true })
      const response = await setDefaultAddress(id)
      if (response.success) {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }))
        toast.success('Default address updated', {
          style: { background: 'white', color: 'black',fontSize:"12px" },
        })
        return true
      } else {
        toast.error(response.error?.message || 'Failed to set default', {
          style: { background: '#ef4444', color: 'white' },
        })
        return false
      }
    } catch (error) {
      toast.error(error.message || 'Failed to set default', {
        style: { background: '#ef4444', color: 'white' },
      })
      return false
    } finally {
      set({ isSaving: false })
    }
  },

  deleteAddress: async (id) => {
    try {
      set({ isSaving: true })
      const response = await deleteAddress(id)
      if (response.success) {
        set((state) => {
          const updated = state.addresses.filter((addr) => addr.id !== id)
          const deletedWasDefault = state.addresses.find(
            (addr) => addr.id === id
          )?.isDefault

          if (deletedWasDefault && updated.length > 0) {
            updated[0].isDefault = true
          }

          return { addresses: updated }
        })
        toast.success('Address deleted', {
          style: { background: 'white', color: 'black',fontSize:'12px' },
        })
        return true
      } else {
        toast.error(response.error?.message || 'Failed to delete address', {
          style: { background: '#ef4444', color: 'white' },
        })
        return false
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete address', {
        style: { background: '#ef4444', color: 'white' },
      })
      return false
    } finally {
      set({ isSaving: false })
    }
  },

  // GET ALL ORDERS
  orders: [],
ordersPage: 1,
ordersTotalPages: 1,
ordersHasNext: false,
isFetchingOrders: false,

// Add action
fetchMyOrders: async (page = 1) => {
  try {
    set({ isFetchingOrders: true })
    const response = await getMyOrders(page)
    if (!response.success) return

    set((state) => ({
      // Append for infinite scroll, replace for pagination
      orders: page === 1 ? response.data : [...state.orders, ...response.data],
      ordersPage: page,
      ordersTotalPages: response.pagination.totalPage,
      ordersHasNext: response.pagination.hasNext,
    }))
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  } finally {
    set({ isFetchingOrders: false })
  }
},
}))

export default useUserStore
