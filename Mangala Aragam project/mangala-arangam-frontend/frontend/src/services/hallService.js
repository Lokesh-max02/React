import apiClient from './apiClient'

// The backend's HallResponse shape differs a little from the mock data shape
// the UI was originally built against (e.g. mainImageUrl vs image,
// guestCapacity vs capacity, no single overall "status" field). This
// normalizer bridges the two so existing components keep working unchanged.
export function normalizeHall(h) {
  return {
    id: h.id,
    name: h.name,
    location: h.location,
    address: h.address,
    price: Number(h.price),
    capacity: h.guestCapacity,
    rating: h.averageRating || 0,
    reviewCount: h.reviewCount || 0,
    facilities: Array.isArray(h.facilities) ? h.facilities : Array.from(h.facilities || []),
    image: h.mainImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    gallery: h.galleryImages?.length ? h.galleryImages : [h.mainImageUrl].filter(Boolean),
    description: h.description,
    rooms: h.numberOfRooms,
    parking: h.parkingCapacity,
    // The list/detail endpoints don't return a single day-level status —
    // that's per-date via /availability. APPROVED + active halls are
    // treated as generally bookable; the real per-date state comes from
    // AvailabilityCalendar's own API call.
    status: h.approvalStatus === 'APPROVED' && h.active ? 'AVAILABLE' : 'UNAVAILABLE',
    approvalStatus: h.approvalStatus,
    owner: {
      name: h.ownerName,
      phone: h.ownerPhone,
      businessName: h.businessName,
    },
  }
}

export async function searchHalls(filters = {}) {
  // filters: { location, minPrice, maxPrice, minCapacity, minRating, facilities: [], date }
  const params = {}
  if (filters.location) params.location = filters.location
  if (filters.minPrice) params.minPrice = filters.minPrice
  if (filters.maxPrice) params.maxPrice = filters.maxPrice
  if (filters.capacity) params.minCapacity = filters.capacity
  if (filters.minRating) params.minRating = filters.minRating
  if (filters.facilities?.length) params.facilities = filters.facilities
  if (filters.date) params.date = filters.date

  const { data } = await apiClient.get('/api/halls', { params })
  return data.map(normalizeHall)
}

export async function getHallById(id) {
  const { data } = await apiClient.get(`/api/halls/${id}`)
  return normalizeHall(data)
}

// payload matches HallRequest: { name, description, location, address,
// googleMapLink, price, guestCapacity, numberOfRooms, parkingCapacity,
// mainImageUrl, galleryImages: [], facilities: [] }
export async function createHall(payload) {
  const { data } = await apiClient.post('/api/halls', payload)
  return normalizeHall(data)
}

export async function updateHall(id, payload) {
  const { data } = await apiClient.put(`/api/halls/${id}`, payload)
  return normalizeHall(data)
}

export async function deleteHall(id) {
  await apiClient.delete(`/api/halls/${id}`)
}

export async function getMyHalls() {
  const { data } = await apiClient.get('/api/owner/halls')
  return data.map(normalizeHall)
}
