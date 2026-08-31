import apiClient from './apiClient'

export async function getMyProfile() {
  const { data } = await apiClient.get('/api/profile')
  return data
}

// payload: { fullName, phone, address, businessName?, profileImageUrl?, currentPassword?, newPassword? }
export async function updateMyProfile(payload) {
  const { data } = await apiClient.put('/api/profile', payload)
  return data
}
