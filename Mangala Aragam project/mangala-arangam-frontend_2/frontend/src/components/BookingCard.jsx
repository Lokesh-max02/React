import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'

export default function BookingCard({ booking, onCancel, cancelling }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 16px 40px -18px rgba(122,27,61,0.25)' }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-stone/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-display text-lg text-stone">{booking.hallName}</h3>
          <StatusBadge status={booking.status} size="sm" />
        </div>
        <p className="text-xs text-stone/50 mt-1">{booking.location}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-stone/55">
          <span>Booking ID: <strong className="text-stone/70">{booking.id}</strong></span>
          <span>Date: <strong className="text-stone/70">{booking.date}</strong></span>
          <span>Guests: <strong className="text-stone/70">{booking.guests}</strong></span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1.5">
        <p className="font-display text-lg text-kumkum">₹{booking.amount.toLocaleString('en-IN')}</p>
        <StatusBadge status={booking.paymentStatus} size="sm" />
      </div>

      <div className="flex sm:flex-col gap-2 shrink-0">
        <Link to={`/bookings/${booking.id}`}>
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block w-full px-4 py-2 rounded-full border border-stone/15 text-stone text-xs font-semibold text-center hover:border-kumkum hover:text-kumkum transition-colors"
          >
            View Details
          </motion.span>
        </Link>
        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && onCancel ? (
          <motion.button
            onClick={() => onCancel(booking.id)}
            disabled={cancelling}
            whileHover={{ scale: cancelling ? 1 : 1.04 }}
            whileTap={{ scale: cancelling ? 1 : 0.96 }}
            className="px-4 py-2 rounded-full border border-kumkum/30 text-kumkum text-xs font-semibold hover:bg-kumkum/5 transition-colors disabled:opacity-50"
          >
            {cancelling ? 'Cancelling…' : 'Cancel Booking'}
          </motion.button>
        ) : null}
      </div>
    </motion.div>
  )
}
