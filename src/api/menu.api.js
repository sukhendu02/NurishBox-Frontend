import api from './axios'

export function getallItems(params = {}) {
  return api.get('/menu', { params })
}
