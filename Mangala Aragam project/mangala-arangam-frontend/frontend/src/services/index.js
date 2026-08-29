import apiClient from './apiClient'

// --- Payments -------------------------------------------------------
// method: 'UPI' | 'CARD' | 'NETBANKING' (must match backend PaymentMethod enum)
export async function payForBooking(bookingId, method) {
  const { data } = await apiClient.post('/api/payments', { bookingId, method })
  return data
}

export async function getPayments() {
  // Backend infers scope (customer vs owner) from the logged-in user's role.
  const { data } = await apiClient.get('/api/payments')
  return data
}

// --- Reviews ----------------------------------------------------------
// Normalizes ReviewResponse (customerName/createdAt) to the shape
// ReviewCard/ReviewsRequest UI was built against (customer/date).
function normalizeReview(r) {
  return {
    id: r.id,
    customer: r.customerName,
    rating: r.rating,
    text: r.text,
    date: r.createdAt ? r.createdAt.slice(0, 10) : '',
    hallName: r.hallName,
  }
}

export async function submitReview({ hallId, bookingId, rating, text }) {
  const { data } = await apiClient.post('/api/reviews', { hallId, bookingId, rating, text })
  return normalizeReview(data)
}

export async function getHallReviews(hallId) {
  const { data } = await apiClient.get(`/api/halls/${hallId}/reviews`)
  return data.map(normalizeReview)
}

export async function getOwnerReviews() {
  const { data } = await apiClient.get('/api/owner/reviews')
  return data.map(normalizeReview)
}

// --- Wishlist -----------------------------------------------------------
export async function addToWishlist(hallId) {
  await apiClient.post('/api/wishlist', { hallId })
}

export async function getWishlist() {
  const { data } = await apiClient.get('/api/wishlist')
  return data
}

export async function removeFromWishlist(id) {
  await apiClient.delete(`/api/wishlist/${id}`)
}

// --- Complaints -----------------------------------------------------------
export async function fileComplaint(payload) {
  const { data } = await apiClient.post('/api/complaints', payload)
  return data
}

export async function getMyComplaints() {
  const { data } = await apiClient.get('/api/complaints/my')
  return data
}

// --- Owner dashboard -----------------------------------------------------
export async function getOwnerDashboardStats() {
  const { data } = await apiClient.get('/api/owner/dashboard')
  return data
}

// --- Admin -----------------------------------------------------------------
export async function getAdminDashboardStats() {
  const { data } = await apiClient.get('/api/admin/dashboard')
  return data
}

export async function getCustomers() {
  const { data } = await apiClient.get('/api/admin/users')
  return data
}

export async function getOwners() {
  const { data } = await apiClient.get('/api/admin/owners')
  return data
}

export async function setUserActive(id, active) {
  const { data } = await apiClient.put(`/api/admin/users/${id}/status`, { active })
  return data
}

export async function getAllHallsAdmin() {
  const { data } = await apiClient.get('/api/admin/halls')
  return data
}

export async function approveHallAdmin(id) {
  const { data } = await apiClient.put(`/api/admin/halls/${id}/approve`)
  return data
}

export async function rejectHallAdmin(id) {
  const { data } = await apiClient.put(`/api/admin/halls/${id}/reject`)
  return data
}

export async function deleteHallAdmin(id) {
  await apiClient.delete(`/api/admin/halls/${id}`)
}

export async function getAllBookingsAdmin() {
  const { data } = await apiClient.get('/api/admin/bookings')
  return data
}

export async function getComplaintsAdmin() {
  const { data } = await apiClient.get('/api/admin/complaints')
  return data
}

export async function updateComplaintAdmin(id, status, resolutionNotes) {
  const { data } = await apiClient.put(`/api/admin/complaints/${id}`, { status, resolutionNotes })
  return data
}
