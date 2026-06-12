import { create } from 'zustand'
import { placeOrder, verifyPayment, getOrderDetail, cancelOrder } from '../api/order.api'
import toast from 'react-hot-toast'

const useOrderStore = create((set, get) => ({
  currentOrder: null,
  orders: [],
  isPlacing: false,
  isVerifying: false,
  checkoutStatus: null,
  error: null,

  // Add to initial state
trackedStatus: null,
isTracking: false,

// Add actions
setTrackedStatus: (status) => set({ trackedStatus: status }),
setIsTracking: (val) => set({ isTracking: val }),
clearTracking: () => set({ trackedStatus: null, isTracking: false }),

  placeOrderAction: async (payload, idemKey) => {
    try {
      set({ checkoutStatus: 'loading', isPlacing: true })
      const response = await placeOrder(payload, idemKey)

      if (response.success) {
        set({ currentOrder: response.data })

        if (payload.paymentMethod === 'COD') {
          set({ checkoutStatus: 'success' })
          toast.success('Order placed successfully!', {
            style: { background: '#0D9E7E', color: 'white' },
          })
        } else if (payload.paymentMethod === 'RAZORPAY') {
          set({ checkoutStatus: null })
        }

        return response.data
      } else {
        set({ checkoutStatus: 'failed', error: response.error?.message })
        toast.error(response.error?.message || 'Failed to place order', {
          style: { background: '#ef4444', color: 'white' },
        })
        return null
      }
    } catch (error) {
      set({ checkoutStatus: 'failed', error: error.message })
      toast.error(error.message || 'Failed to place order', {
        style: { background: '#ef4444', color: 'white' },
      })
      return null
    } finally {
      set({ isPlacing: false })
    }
  },

  verifyPaymentAction: async (verifyData) => {
    try {
      set({ isVerifying: true, checkoutStatus: 'loading' })
      const response = await verifyPayment(verifyData)

      if (response.success) {
        set({ currentOrder: response.data, checkoutStatus: 'success' })
         console.log("AFTER SET", get().checkoutStatus)
        toast.success('Payment successful!', {
          style: { background: '#0D9E7E', color: 'white' },
        })
      } else {
        set({ checkoutStatus: 'failed', error: response.error?.message })
        toast.error(response.error?.message || 'Payment verification failed', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      set({ checkoutStatus: 'failed', error: error.message })
      toast.error(error.message || 'Payment verification failed', {
        style: { background: '#ef4444', color: 'white' },
      })
    } finally {
      set({ isVerifying: false })
    }
  },

  fetchOrderDetail: async (orderId) => {
    try {
      const response = await getOrderDetail(orderId)
      if (response.success) {
        set({ currentOrder: response.data })
      }
    } catch (error) {
      console.error('Failed to fetch order detail:', error)
    }
  },

  cancelOrderAction: async (orderId) => {
    try {
      const response = await cancelOrder(orderId)
      if (response.success) {
        set({ currentOrder: response.data })
        toast.success('Order cancelled', {
          style: { background: '#0D9E7E', color: 'white' },
        })
        return true
      } else {
        toast.error(response.error?.message || 'Failed to cancel order', {
          style: { background: '#ef4444', color: 'white' },
        })
        return false
      }
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order', {
        style: { background: '#ef4444', color: 'white' },
      })
      return false
    }
  },

  resetCheckout: () => {
    set({ checkoutStatus: null, currentOrder: null, error: null })
  },
})



)



export default useOrderStore
