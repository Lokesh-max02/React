import apiClient from './apiClient'

// start/end are ISO date strings ('YYYY-MM-DD'). Returns [{ date, status, bookingId }]
export async function getAvailability(hallId, start, end) {
  const { data } = await apiClient.get(`/api/halls/${hallId}/availability`, { params: { start, end } })
  return data
}

// status: 'AVAILABLE' | 'BOOKING_PENDING' | 'BOOKED' | 'UNAVAILABLE' | 'MAINTENANCE'
export async function setAvailability(hallId, date, status) {
  const { data } = await apiClient.post(`/api/halls/${hallId}/availability`, { date, status })
  return data
}
