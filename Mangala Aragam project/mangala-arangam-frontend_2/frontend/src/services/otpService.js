import apiClient from './apiClient'

export async function sendOtp(email) {
  const { data } = await apiClient.post('/api/auth/otp/send', { email })
  return data
}

export async function verifyOtp(email, otp) {
  const { data } = await apiClient.post('/api/auth/otp/verify', { email, otp })
  return data
}
