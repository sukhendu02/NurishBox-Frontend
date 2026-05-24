import api from './axios'

export const getProfile = async () => {
  const response = await api.get('/user/me')
  return response.data
}

export const updateProfile = async (data) => {
  const response = await api.patch('/user/me', data)
  return response.data
}

export const getAddresses = async () => {
  const response = await api.get('/user/me/addresses')
  return response.data
}

export const getAddressById = async (id) => {
  const response = await api.get(`/user/me/addresses/${id}`)
  return response.data
}

export const createAddress = async (data) => {
  const response = await api.post('/user/me/addresses', data)
  return response.data
}

export const updateAddress = async (id, data) => {
  const response = await api.patch(`/user/me/addresses/${id}`, data)
  return response.data
}

export const setDefaultAddress = async (id) => {
  const response = await api.patch(`/user/me/addresses/${id}/default`)
  return response.data
}

export const deleteAddress = async (id) => {
  const response = await api.delete(`/user/me/addresses/${id}`)
  return response.data
}
