import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from '../components/StatusBadge'
import Reveal from '../components/Reveal'
import { getBookingById, cancelBooking } from '../services/bookingService'
import { extractErrorMessage } from '../services/apiClient'

export default function BookingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getBookingById(id)
      .then((data) => !cancelled && setBooking(data || null))
      .catch(() => !cancelled && setBooking(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  const handleCancel = async () => {
    setError('')
    setCancelling(true)
    try {
      const updated = await cancelBooking(booking.id)
      setBooking(updated)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not cancel this booking.'))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        <div className="h-72 rounded-2xl bg-white border border-stone/10 animate-pulse" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-stone mb-3">Booking not found</h1>
        <Link to="/my-bookings" className="text-kumkum font-semibold">Back to My Bookings</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
      <Link to="/my-bookings" className="text-sm text-kumkum font-semibold">← Back to My Bookings</Link>

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6 mt-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl text-stone">{booking.hallName}</h1>
            <p className="text-sm text-stone/50 mt-1">{booking.location}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="kolam-divider my-5" />

        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <Detail label="Booking ID" value={booking.id} />
          <Detail label="Event Date" value={booking.date} />
          <Detail label="Guests" value={booking.guests} />
          <Detail label="Amount" value={`₹${booking.amount.toLocaleString('en-IN')}`} />
          <Detail label="Booking Status" value={<StatusBadge status={booking.status} size="sm" />} />
          <Detail label="Payment Status" value={<StatusBadge status={booking.paymentStatus} size="sm" />} />
        </div>

        {error && (
          <p className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 mt-4">{error}</p>
        )}

        <div className="kolam-divider my-5" />

        <div className="flex flex-col sm:flex-row gap-3">
          {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
            <Link to={`/payment/${booking.id}`} className="flex-1">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="block text-center px-5 py-3 rounded-full bg-kumkum text-ivory font-semibold"
              >
                Make Payment
              </motion.span>
            </Link>
          )}
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
            <motion.button
              onClick={handleCancel}
              disabled={cancelling}
              whileHover={{ scale: cancelling ? 1 : 1.02 }}
              whileTap={{ scale: cancelling ? 1 : 0.97 }}
              className="flex-1 px-5 py-3 rounded-full border border-kumkum/30 text-kumkum font-semibold hover:bg-kumkum/5 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel Booking'}
            </motion.button>
          )}
        </div>
      </Reveal>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-stone/40 mb-1">{label}</p>
      <div className="font-medium text-stone">{value}</div>
    </div>
  )
}
