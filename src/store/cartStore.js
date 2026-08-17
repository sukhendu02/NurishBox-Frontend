

import { create }   from 'zustand'
import {
  getCart,
  addToCart,
  updateItem,
  removeItem  as removeItemApi,
  clearCart   as clearCartApi,
  checkAvailability,
  applyCoupon,
  removeCoupon
} from '../api/cart.api'
import toast from 'react-hot-toast'
import useAddressStore from './addressStrore'
import { useProductStore } from './productStore'
import { DELIVERY_CONFIG } from '../constant/deliveryConstant'
const TOAST_SUCCESS = { style: { background: '#0D9E7E', color: 'white' } }
const TOAST_ERROR   = { style: { background: '#ef4444', color: 'white' } }

const emptyCart = {
  items:          [],
  itemCount:      0,
  subtotal:       0,
  totalSavings:   0,
  deliveryFee:    30,
  totalAmount:    0,
  freeDeliveryIn: 299,

    eta: null,
  unavailableIds: [],
   appliedCoupon:  null,  
     couponDiscount: 0, 
 
}



const useCartStore = create((set, get) => ({
  ...emptyCart,
  isLoading: false,
  error:     null,

  

  setCart: (data) => {
    if (!data) return
      // console.log('setCart called with:', data.items?.length, 'items')
      //  console.log("setCart()", data.unavailableItems);
    set({
      items:          data.items          ?? [],
     
      itemCount:      data.itemCount      ?? 0,
     
     
      subtotal:       data.subtotal       ?? 0,
      totalSavings:   data.totalSavings   ?? 0,
      deliveryFee:    data.deliveryFee    ?? 30,
      totalAmount:    data.totalAmount    ?? 0,
      freeDeliveryIn: data.freeDeliveryIn ?? 299,
      // NEW ITEMS\
      eta: data.eta ?? null,
      unavailableIds: data.unavailableItems ?? [],
        appliedCoupon:  data.appliedCoupon  ?? null,  
    couponDiscount: data.couponDiscount ?? 0, 
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
      // console.log(res)
      console.log('Cart fetched:', res.data)
      get().setCart(res.data)
            
    } catch (err) {
      set({ error: err.message })
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true }) 
    try {
      const res = await addToCart(productId, quantity)
      get().setCart(res.data)
       await get().fetchCart()
      // toast.success('Added to cart', TOAST_SUCCESS)
    } catch (err) {
      toast.error(err.message || 'Failed to add item', TOAST_ERROR)
    }
    finally{
      set({ isLoading: false }) 
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true }) 
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
      await get().fetchCart()
    } catch (err) {
      set({ items: previousItems })
      toast.error(err.message || 'Failed to update', TOAST_ERROR)
    }
    finally{
      set({ isLoading: false }) 
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true }) 
    const previousItems = get().items

    // Optimistic update
    set({ items: previousItems.filter((item) => item.id !== itemId) })

    try {
      const res = await removeItemApi(itemId)
      get().setCart(res.data)
       await get().fetchCart()
        // await get().checkCartAvailability() 
      // toast.success('Item removed', TOAST_SUCCESS)
    } catch (err) {
      set({ items: previousItems })
      toast.error(err.message || 'Failed to remove', TOAST_ERROR)
    }
    finally{
      set({ isLoading: false }) 
    }
  },

  clearCart: async () => {
    set({ isLoading: true }) 
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
    finally{
      set({ isLoading: false }) 
    }
  },

   checkCartAvailability: async () => {
    
     console.log("checkCartAvailability called");
    const { items } = get()     
    if (items.length === 0) {
      set({ unavailableIds: [] })
      return
    }
       
    const selectedAddress = useAddressStore.getState().selectedAddress

      // No saved address and no current locaiton 
      if (!selectedAddress && selectedAddress.type !== 'current_location') {
        set({ unavailableIds: items.map(i => i.product?.id).filter(Boolean) })
        return
      }

    const kitchenId = selectedAddress.type === 'current_location'
    ? useProductStore.getState().kitchen?.id ?? null
    : selectedAddress.kitchenId ?? null
      
      // const kitchenId = selectedAddress.kitchenId ?? null
    
    try {
      
      const res = await checkAvailability(
        kitchenId,
        items.map(i => ({ productId: i.product?.id, quantity: i.quantity })),
        selectedAddress
      )
      const eta =res.eta;
      set({eta})
      console.log(eta)
      const unavailableIds = res.unavailable?.map(u => u.productId) ?? []
      set({ unavailableIds })
    } catch {
      // If check fails, don't block — assume all available
      set({ unavailableIds: [] })
    }
  },
 


  // APPLY COUPON
  applyCoupon: async (code) => {
  set({ isApplyingCoupon: true,
      applyingCouponCode: code,
      couponError:null
   })
   
  // set({isLoading:true})
  try {
     const selectedAddress = useAddressStore.getState().selectedAddress
   const kitchenId = selectedAddress.type === 'current_location'
    ? useProductStore.getState().kitchen?.id ?? null
    : selectedAddress.kitchenId ?? null
    // console.log(code,kitchenId)
    const data  = await applyCoupon(code,kitchenId) 
    console.log(data)
     
     if (data.response.valid) {
      // get().setCart(data.cart)
       await get().fetchCart()
      return { success: true }
    } else {
      
      set({ couponError: data.response.message || 'Coupon could not be applied' })
      return { error: data.response.message || 'Coupon could not be applied' }
    }
  } catch (err) {
    set({ couponError: 'Failed to apply coupon' })
    return { error: 'Failed to apply coupon' }
  } finally {
    set({ isApplyingCoupon: false,
        applyingCouponCode: null
     })
    // set({isLoading:false})
  }
},

removeCoupon: async () => {
  set({ isLoading : true })
  try {
    const data = await removeCoupon()
  await get().fetchCart({isLoading : false})

  } catch (err) {
 
    console.log(err)
  } finally {
    set({ isLoading : false })
  }
},

}))

export default useCartStore