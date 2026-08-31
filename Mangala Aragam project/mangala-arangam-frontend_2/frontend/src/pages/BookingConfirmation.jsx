import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import { getHallById } from '../services/hallService'
import StatusBadge from '../components/StatusBadge'
import { RevealGroup, RevealItem } from '../components/Reveal'

export default function BookingConfirmation() {
  const [params] = useSearchParams()
  const bookingId = params.get('bookingId')
  const hallId = params.get('hallId')
  const date = params.get('date')
  const guests = params.get('guests')
  const name = params.get('name')
  const total = params.get('total')

  const [hall, setHall] = useState(null)

  useEffect(() => {
    if (!hallId) return
    getHallById(hallId).then(setHall).catch(() => setHall(null))
  }, [hallId])

  return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
        className="relative w-16 h-16 mx-auto mb-6"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-leaf/20"
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: 2, ease: 'easeOut' }}
        />
        <div className="relative w-16 h-16 rounded-full bg-leaf/10 text-leaf flex items-center justify-center text-3xl">
          <FaCheckCircle />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="font-display text-3xl text-stone mb-2"
      >
        Booking Request Sent
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-stone/55 mb-8"
      >
        Your booking request has been sent to the hall owner.
      </motion.p>

      <RevealGroup className="bg-white border border-stone/10 rounded-2xl p-6 text-left space-y-4" stagger={0.05}>
        <RevealItem>
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-stone">Booking Details</p>
            <StatusBadge status="PENDING" />
          </div>
        </RevealItem>
        <div className="kolam-divider" />
        <RevealItem><Row label="Booking ID" value={bookingId} /></RevealItem>
        <RevealItem><Row label="Customer Name" value={name || '—'} /></RevealItem>
        <RevealItem><Row label="Hall Name" value={hall?.name} /></RevealItem>
        <RevealItem><Row label="Hall Location" value={hall?.location} /></RevealItem>
        <RevealItem><Row label="Event Date" value={date} /></RevealItem>
        <RevealItem><Row label="Number of Guests" value={guests} /></RevealItem>
        <RevealItem><Row label="Total Amount" value={total ? `₹${Number(total).toLocaleString('en-IN')}` : '—'} strong /></RevealItem>
      </RevealGroup>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Link to="/my-bookings">
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block px-6 py-3 rounded-full bg-kumkum text-ivory font-semibold">
            Go to My Bookings
          </motion.span>
        </Link>
        <Link to="/halls">
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block px-6 py-3 rounded-full border border-stone/15 text-stone font-semibold hover:border-kumkum hover:text-kumkum transition-colors">
            Browse More Halls
          </motion.span>
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone/50">{label}</span>
      <span className={strong ? 'font-display text-lg text-kumkum' : 'font-medium text-stone'}>{value || '—'}</span>
    </div>
  )
}
