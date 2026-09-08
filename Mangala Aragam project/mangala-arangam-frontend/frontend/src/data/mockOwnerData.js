// Mock data standing in for the owner-facing endpoints:
// GET /api/owner/dashboard, GET /api/owner/halls, GET /api/owner/bookings,
// GET /api/payments (owner scope), GET /api/owner/revenue, owner reviews.

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

export const ownerProfile = {
  name: 'R. Krishnamurthy',
  email: 'krishnamurthy@mylaporemandapam.in',
  phone: '+91 98400 11223',
  businessName: 'Mylapore Mandapam Trust',
  address: '4 Kutchery Road, Mylapore, Chennai',
}

export const ownerHalls = [
  {
    id: 1,
    name: 'Sri Maha Mangala Mandapam',
    location: 'Mylapore, Chennai',
    price: 185000,
    capacity: 800,
    rating: 4.7,
    reviewCount: 132,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    status: 'AVAILABLE',
    approvalStatus: APPROVAL_STATUS.APPROVED,
    facilities: ['AC', 'Dining Hall', 'Stage', 'Parking', 'Catering', 'Generator'],
  },
  {
    id: 4,
    name: 'Royal Kalyana Mahal',
    location: 'Anna Nagar, Chennai',
    price: 260000,
    capacity: 950,
    rating: 4.8,
    reviewCount: 204,
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop',
    status: 'BOOKING_PENDING',
    approvalStatus: APPROVAL_STATUS.APPROVED,
    facilities: ['AC', 'Dining Hall', 'Stage', 'Parking', 'Catering', 'Decoration', 'Rooms'],
  },
  {
    id: 7,
    name: 'Kutchery Road Banquet Hall',
    location: 'Mylapore, Chennai',
    price: 150000,
    capacity: 500,
    rating: 0,
    reviewCount: 0,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    status: 'AVAILABLE',
    approvalStatus: APPROVAL_STATUS.PENDING,
    facilities: ['AC', 'Dining Hall', 'Parking', 'WiFi'],
  },
]

export const ownerBookingRequests = [
  {
    id: 'MA-20931144',
    hallId: 1,
    hallName: 'Sri Maha Mangala Mandapam',
    customerName: 'Divya Ramesh',
    customerPhone: '+91 90000 12345',
    eventDate: '2026-10-18',
    guests: 620,
    amount: 185000,
    requestDate: '2026-08-10',
    status: 'PENDING',
  },
  {
    id: 'MA-20931102',
    hallId: 4,
    hallName: 'Royal Kalyana Mahal',
    customerName: 'Karthik Subramaniam',
    customerPhone: '+91 90011 22334',
    eventDate: '2026-09-02',
    guests: 900,
    amount: 260000,
    requestDate: '2026-08-05',
    status: 'PENDING',
  },
]

export const ownerConfirmedBookings = [
  {
    id: 'MA-20928871',
    hallId: 1,
    hallName: 'Sri Maha Mangala Mandapam',
    customerName: 'Meena Suresh',
    eventDate: '2026-11-14',
    guests: 650,
    amount: 185000,
    paymentStatus: 'PENDING',
    status: 'CONFIRMED',
  },
  {
    id: 'MA-20925520',
    hallId: 1,
    hallName: 'Sri Maha Mangala Mandapam',
    customerName: 'Arjun Kumar',
    eventDate: '2026-03-18',
    guests: 350,
    amount: 185000,
    paymentStatus: 'PAID',
    status: 'COMPLETED',
  },
]

export const ownerCancelledBookings = [
  {
    id: 'MA-20918820',
    hallId: 4,
    hallName: 'Royal Kalyana Mahal',
    customerName: 'Priya Elango',
    eventDate: '2026-01-22',
    guests: 500,
    amount: 260000,
    reason: 'Customer rescheduled to a different city.',
    cancelledOn: '2026-01-05',
    status: 'CANCELLED',
  },
]

export const ownerPayments = [
  {
    id: 'PMT-88231',
    bookingId: 'MA-20925520',
    hallName: 'Sri Maha Mangala Mandapam',
    customer: 'Arjun Kumar',
    amount: 185000,
    method: 'UPI',
    date: '2026-02-20',
    status: 'PAID',
  },
  {
    id: 'PMT-88190',
    bookingId: 'MA-20928871',
    hallName: 'Sri Maha Mangala Mandapam',
    customer: 'Meena Suresh',
    amount: 185000,
    method: '—',
    date: '—',
    status: 'PENDING',
  },
]

export const revenueMonthly = [
  { month: 'Mar', revenue: 185000 },
  { month: 'Apr', revenue: 0 },
  { month: 'May', revenue: 95000 },
  { month: 'Jun', revenue: 260000 },
  { month: 'Jul', revenue: 140000 },
  { month: 'Aug', revenue: 185000 },
]

export const ownerReviews = [
  { id: 1, hallName: 'Sri Maha Mangala Mandapam', customer: 'Divya R.', rating: 5, text: 'The mandapam stage looked stunning during the muhurtham. Staff coordinated the sadhya timing perfectly.', date: '2026-05-12' },
  { id: 2, hallName: 'Royal Kalyana Mahal', customer: 'Meena S.', rating: 5, text: 'Booked for my sister\'s wedding, the gold stage decor and naadaswaram arrangement were worth every rupee.', date: '2026-06-20' },
  { id: 3, hallName: 'Sri Maha Mangala Mandapam', customer: 'Arun K.', rating: 4, text: 'Great location for guests coming by train, parking filled up fast though.', date: '2026-03-02' },
]

export function ownerDashboardStats() {
  const totalHalls = ownerHalls.length
  const availableHalls = ownerHalls.filter((h) => h.status === 'AVAILABLE').length
  const bookedHalls = ownerHalls.filter((h) => h.status === 'BOOKED' || h.status === 'BOOKING_PENDING').length
  const pendingRequests = ownerBookingRequests.filter((b) => b.status === 'PENDING').length
  const upcomingEvents = ownerConfirmedBookings.filter((b) => b.status === 'CONFIRMED').length
  const totalRevenue = revenueMonthly.reduce((sum, m) => sum + m.revenue, 0)
  return { totalHalls, availableHalls, bookedHalls, pendingRequests, upcomingEvents, totalRevenue }
}

export function getOwnerHallById(id) {
  return ownerHalls.find((h) => String(h.id) === String(id))
}
