import api from './axios'

export const getCart = async () => {
  const response = await api.get('/cart')
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