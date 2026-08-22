import api from './axios'

export function getallItems(params = {}) {
  return api.get('/menu', { params })
}
export function getSuggestedItems() {
  return api.get('/menu/suggested', )
}
