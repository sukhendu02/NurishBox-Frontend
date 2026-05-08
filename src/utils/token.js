const KEYS = {
  ACCESS: 'nb_access_token',
  REFRESH: 'nb_refresh_token',
  TEMP: 'nb_temp_token',
}

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(KEYS.ACCESS, accessToken)
  localStorage.setItem(KEYS.REFRESH, refreshToken)
}

export function getAccessToken() {
  return localStorage.getItem(KEYS.ACCESS)
}

export function getRefreshToken() {
  return localStorage.getItem(KEYS.REFRESH)
}

export function saveTempToken(tempToken) {
  sessionStorage.setItem(KEYS.TEMP, tempToken)
}

export function getTempToken() {
  return sessionStorage.getItem(KEYS.TEMP)
}

export function clearTokens() {
  localStorage.removeItem(KEYS.ACCESS)
  localStorage.removeItem(KEYS.REFRESH)
}

export function clearTempToken() {
  sessionStorage.removeItem(KEYS.TEMP)
}
