

import { create }   from 'zustand'
import {
  getCart,
  addToCart,
  updateItem,
  removeItem  as removeItemApi,
  clearCart   as clearCartApi,
} from '../api/cart.api'
import toast from 'react-hot-toast'

const TOAST_SUCCESS = { style: { background: '#0D9E7E', color: 'white' } }
const TOAST_ERROR   = { style: { background: '#ef4444', color: 'white' } }

const emptyCart = {
  items:          [],
  itemCount:      0,
  subtotal:       0,
  totalSavings:   0,
  deliveryFee:    30,
  totalAmount:    0,
  freeDeliveryIn: 399,
}

const useCartStore = create((set, get) => ({
  ...emptyCart,
  isLoading: false,
  error:     null,

  setCart: (data) => {
    if (!data) return
      console.log('setCart called with:', data.items?.length, 'items')
    set({
      items:          data.items          ?? [],
     
      itemCount:      data.itemCount      ?? 0,
     
     
      subtotal:       data.subtotal       ?? 0,
      totalSavings:   data.totalSavings   ?? 0,
      deliveryFee:    data.deliveryFee    ?? 30,
      totalAmount:    data.totalAmount    ?? 0,
      freeDeliveryIn: data.freeDeliveryIn ?? 399,
      error:          null,
    })
      console.log('setCart called with:', data.items?.length, 'items')
  },

  getItemByProductId: (productId) => {
    return get().items.find((item) => item.product?.id === productId) || null
  },

  fetchCart: async () => {
    // console.log('Fetching cart...')
    set({ isLoading: true, error: null })
    try {
      const res = await getCart()
      // console.log('Cart fetched:', res.data)
      get().setCart(res.data)// res.data = { success, data: {...} }
    } catch (err) {
      set({ error: err.message })
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      const res = await addToCart(productId, quantity)
      get().setCart(res.data)
      // toast.success('Added to cart', TOAST_SUCCESS)
    } catch (err) {
      toast.error(err.message || 'Failed to add item', TOAST_ERROR)
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity === 0) {
      get().removeItem(itemId)
      return
    }

    const previousItems = get().items

    // Optimistic update
    set({
      items: previousItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })

    try {
      const res = await updateItem(itemId, quantity)
      get().setCart(res.data)
    } catch (err) {
      set({ items: previousItems })
      toast.error(err.message || 'Failed to update', TOAST_ERROR)
    }
  },

  removeItem: async (itemId) => {
    const previousItems = get().items

    // Optimistic update
    set({ items: previousItems.filter((item) => item.id !== itemId) })

    try {
      const res = await removeItemApi(itemId)
      get().setCart(res.data)
      // toast.success('Item removed', TOAST_SUCCESS)
    } catch (err) {
      set({ items: previousItems })
      toast.error(err.message || 'Failed to remove', TOAST_ERROR)
    }
  },

  clearCart: async () => {
    const previousItems = get().items
    set({ items: [] })

    try {
      await clearCartApi()
      set({ ...emptyCart })
      // toast.success('Cart cleared', TOAST_SUCCESS)
    } catch (err) {
      set({ items: previousItems })
      toast.error(err.message || 'Failed to clear cart', TOAST_ERROR)
    }
  },
}))

export default useCartStore