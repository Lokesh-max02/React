import apiClient from './apiClient'

// Bridges the backend's BookingResponse field names (hallLocation, eventDate,
// totalAmount) to the shape BookingCard/BookingDetails/Payment were built
// against (location, date, amount) — same pattern as normalizeHall.
export function normalizeBooking(b) {
  return {
    id: b.id,
    hallId: b.hallId,
    hallName: b.hallName,
    location: b.hallLocation,
    ownerName: b.ownerName,
    ownerPhone: b.ownerPhone,
    date: b.eventDate,
    eventType: b.eventType,
    guests: b.guests,
    amount: Number(b.totalAmount),
    status: b.status,
    paymentStatus: b.paymentStatus || 'PENDING',
    createdAt: b.createdAt,
  }
}

// payload matches BookingRequest: { hallId, eventDate, eventType, guests,
// contactName, contactPhone, contactEmail, additionalRequirements }
// Returned raw (unnormalized) since Booking.jsx reads the original field
// names (eventDate, guests, contactName, totalAmount) straight off the response.
export async function createBooking(payload) {
  const { data } = await apiClient.post('/api/bookings', payload)
  return data
}

export async function getMyBookings() {
  const { data } = await apiClient.get('/api/bookings/my')
  return data.map(normalizeBooking)
}

export async function getOwnerBookings() {
  const { data } = await apiClient.get('/api/owner/bookings')
  return data.map(normalizeBooking)
}

export async function getBookingById(id) {
  // No single-booking GET endpoint exists on the backend yet, so we pull
  // it from the customer's own list. Swap this for a dedicated
  // GET /api/bookings/{id} call if you add one.
  const bookings = await getMyBookings()
  return bookings.find((b) => String(b.id) === String(id))
}

export async function approveBooking(id) {
  const { data } = await apiClient.put(`/api/bookings/${id}/approve`)
  return normalizeBooking(data)
}

export async function rejectBooking(id, reason) {
  const { data } = await apiClient.put(`/api/bookings/${id}/reject`, reason ? { reason } : {})
  return normalizeBooking(data)
}

export async function cancelBooking(id, reason) {
  const { data } = await apiClient.put(`/api/bookings/${id}/cancel`, reason ? { reason } : {})
  return normalizeBooking(data)
}
