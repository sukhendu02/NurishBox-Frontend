import { create } from 'zustand'
import { getCart, addToCart, updateItem, removeItem, clearCart } from '../api/cart.api'
import toast from 'react-hot-toast'

const useCartStore = create((set, get) => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
  totalSavings: 0,
  deliveryFee: 30,
  totalAmount: 0,
  freeDeliveryIn: 399,
  isLoading: false,
  error: null,

  setCart: (data) => {
    set({
      items: data.items || [],
      itemCount: data.itemCount || 0,
      subtotal: data.subtotal || 0,
      totalSavings: data.totalSavings || 0,
      deliveryFee: data.deliveryFee || 0,
      totalAmount: data.totalAmount || 0,
      freeDeliveryIn: data.freeDeliveryIn || 0,
      error: null,
    })
  },

  fetchCart: async () => {
    try {
      set({ isLoading: true })
      const response = await getCart()
      if (response.success) {
        get().setCart(response.data)
      } else {
        set({ error: response.error?.message || 'Failed to fetch cart' })
      }
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      const response = await addToCart(productId, quantity)
      if (response.success) {
        get().setCart(response.data)
        toast.success('Added to cart', {
          style: { background: '#0D9E7E', color: 'white' },
        })
      } else {
        toast.error(response.error?.message || 'Failed to add item', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add item', {
        style: { background: '#ef4444', color: 'white' },
      })
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity === 0) {
      get().removeItem(itemId)
      return
    }

    const previousItems = get().items
    set({
      items: get().items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })

    try {
      const response = await updateItem(itemId, quantity)
      if (response.success) {
        get().setCart(response.data)
      } else {
        set({ items: previousItems })
        toast.error(response.error?.message || 'Failed to update quantity', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      set({ items: previousItems })
      toast.error(error.message || 'Failed to update quantity', {
        style: { background: '#ef4444', color: 'white' },
      })
    }
  },

  removeItem: async (itemId) => {
    const previousItems = get().items
    set({ items: get().items.filter((item) => item.id !== itemId) })

    try {
      const response = await removeItem(itemId)
      if (response.success) {
        get().setCart(response.data)
        toast.success('Item removed', {
          style: { background: '#0D9E7E', color: 'white' },
        })
      } else {
        set({ items: previousItems })
        toast.error(response.error?.message || 'Failed to remove item', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      set({ items: previousItems })
      toast.error(error.message || 'Failed to remove item', {
        style: { background: '#ef4444', color: 'white' },
      })
    }
  },

  clearCart: async () => {
    const previousItems = get().items
    set({ items: [] })

    try {
      const response = await clearCart()
      if (response.success) {
        get().setCart(response.data)
        toast.success('Cart cleared', {
          style: { background: '#0D9E7E', color: 'white' },
        })
      } else {
        set({ items: previousItems })
        toast.error(response.error?.message || 'Failed to clear cart', {
          style: { background: '#ef4444', color: 'white' },
        })
      }
    } catch (error) {
      set({ items: previousItems })
      toast.error(error.message || 'Failed to clear cart', {
        style: { background: '#ef4444', color: 'white' },
      })
    }
  },
}))

export default useCartStore
