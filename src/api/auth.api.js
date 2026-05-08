import api from './axios'
import { getTempToken } from '../utils/token'

export function sendOTP(phone) {
  return api.post('/auth/send-otp', { phone })
}

export function verifyOTP(phone, otp) {
  return api.post('/auth/verify-otp', { phone, otp })
}

export function completeProfile(name, email) {
  return api.post(
    '/auth/register-user',
    { name, email },
    { headers: { Authorization: `Bearer ${getTempToken()}` } }
  )
}

export function logout(refreshToken) {
  return api.post('/auth/logout', { refreshToken })
}
