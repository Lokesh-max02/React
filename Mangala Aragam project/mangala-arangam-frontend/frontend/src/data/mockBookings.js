export const myBookings = [
  {
    id: 'MA-10293841',
    hallId: 1,
    hallName: 'Sri Maha Mangala Mandapam',
    location: 'Mylapore, Chennai',
    date: '2026-11-14',
    guests: 650,
    amount: 185000,
    status: 'CONFIRMED',
    paymentStatus: 'PENDING',
  },
  {
    id: 'MA-10293802',
    hallId: 4,
    hallName: 'Royal Kalyana Mahal',
    location: 'Anna Nagar, Chennai',
    date: '2026-09-02',
    guests: 900,
    amount: 260000,
    status: 'PENDING',
    paymentStatus: 'PENDING',
  },
  {
    id: 'MA-10286120',
    hallId: 3,
    hallName: 'Annapoorna Marriage Hall',
    location: 'Tambaram, Chennai',
    date: '2026-03-18',
    guests: 350,
    amount: 95000,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
  },
  {
    id: 'MA-10281477',
    hallId: 6,
    hallName: 'Sri Lakshmi Thirumana Mandapam',
    location: 'Velachery, Chennai',
    date: '2026-01-22',
    guests: 500,
    amount: 140000,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
  },
]

export function getBookingById(id) {
  return myBookings.find((b) => b.id === id)
}
