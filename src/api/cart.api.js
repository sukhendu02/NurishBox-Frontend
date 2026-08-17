import useAddressStore from '../store/addressStrore'
import { useProductStore } from '../store/productStore'
import api from './axios'

// export const getCart = async () => {
//   const response = await api.get('/cart')
//   return response.data
// }
export const getCart = async () => {
  const selectedAddress = useAddressStore.getState().selectedAddress

  const params = {}

 
   if (selectedAddress) {
    const kitchenId =
      selectedAddress.type === "current_location"
        ? useProductStore.getState().kitchen?.id ?? null
        : selectedAddress.kitchenId ?? null;

    if (kitchenId) {
      params.kitchenId = kitchenId;
    }

    if (
      selectedAddress.type === "current_location" &&
      selectedAddress.coords
    ) {
      params.lat = selectedAddress.coords.lat;
      params.lng = selectedAddress.coords.lng;
    }
  }
  const response = await api.get('/cart',{params})
  console.log("cart response",response)
  return response.data
}

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity })
  return response.data
}

export const updateItem = async (itemId, quantity) => {
  const response = await api.patch(`/cart/${itemId}`, { quantity })
  return response.data
}

export const removeItem = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`)
  return response.data
}

export const clearCart = async () => {
  const response = await api.delete('/cart')
  return response.data
}

export const checkAvailability = async (kitchenId, items,selectedAddress) => {
  const response = await api.post('/cart/check-availability', { kitchenId, items,selectedAddress })
  return response.data
}
export const applyCoupon = async (code,kitchenId) => {
  const response = await api.post('/coupon', { code,kitchenId })
  return response.data
}
export const removeCoupon = async () => {
  const response = await api.post('/coupon/remove')
  return response.data
}
export const getAvailableCoupons = async () => {
  const response = await api.get('/coupon/available')
  return response.data
}