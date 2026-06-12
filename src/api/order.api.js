import api from './axios'

export const placeOrder = async (data, idemKey) => {
  const response = await api.post('/order/place-order', data, {
    headers: { 'x-idempotency-key': idemKey },
  })
  return response.data
}

export const verifyPayment = async (data) => {
  const response = await api.post('/payment/verify', data)
  return response.data
}

export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/order/${orderId}`)
  return response.data
}

export const getMyOrders = async (params) => {
  const response = await api.get('/order/my', { params })
  return response.data
}

export const cancelOrder = async (orderId) => {
  const response = await api.post(`/order/my/${orderId}/cancel`)
  return response.data
}
