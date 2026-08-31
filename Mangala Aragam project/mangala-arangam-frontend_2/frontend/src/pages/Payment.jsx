import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCreditCard, FaMobileAlt, FaUniversity, FaCheck } from 'react-icons/fa'
import { getBookingById } from '../services/bookingService'
import { payForBooking } from '../services/index'
import { extractErrorMessage } from '../services/apiClient'
import StatusBadge from '../components/StatusBadge'
import Reveal from '../components/Reveal'

// UI key -> backend PaymentMethod enum value
const METHODS = [
  { key: 'UPI', label: 'UPI', icon: <FaMobileAlt /> },
  { key: 'CARD', label: 'Card', icon: <FaCreditCard /> },
  { key: 'NETBANKING', label: 'Net Banking', icon: <FaUniversity /> },
]

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState('UPI')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getBookingById(bookingId)
      .then((data) => !cancelled && setBooking(data || null))
      .catch(() => !cancelled && setBooking(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-10">
        <div className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" />
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

  const handlePay = async (e) => {
    e.preventDefault()
    setError('')
    setProcessing(true)
    try {
      // POST /api/payments — body matches PaymentRequest: { bookingId, method }
      await payForBooking(booking.id, method)
      navigate(`/bookings/${booking.id}`)
    } catch (err) {
      setError(extractErrorMessage(err, 'Payment could not be completed.'))
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 sm:px-8 py-10">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Secure Payment</p>
        <h1 className="font-display text-3xl text-stone mb-8">Complete Your Payment</h1>
      </Reveal>

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6">
        <div className="space-y-2.5 text-sm">
          <Row label="Booking ID" value={booking.id} />
          <Row label="Hall" value={booking.hallName} />
          <Row label="Event Date" value={booking.date} />
          <Row label="Payment Status" value={<StatusBadge status={booking.paymentStatus} size="sm" />} />
        </div>

        <div className="kolam-divider my-5" />

        <div className="flex justify-between items-baseline mb-6">
          <span className="font-semibold text-stone">Amount to Pay</span>
          <span className="font-display text-2xl text-kumkum">₹{booking.amount.toLocaleString('en-IN')}</span>
        </div>

        {error && (
          <p className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handlePay}>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone/45 mb-2.5">Payment Method</p>
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {METHODS.map((m) => (
              <motion.button
                type="button"
                key={m.key}
                onClick={() => setMethod(m.key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex flex-col items-center gap-2 py-4 rounded-xl border text-xs font-semibold transition-colors overflow-hidden ${
                  method === m.key ? 'border-kumkum bg-kumkum/5 text-kumkum' : 'border-stone/15 text-stone/55'
                }`}
              >
                {method === m.key && (
                  <motion.span
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-kumkum text-ivory flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <FaCheck size={8} />
                  </motion.span>
                )}
                <span className="text-lg">{m.icon}</span>
                {m.label}
              </motion.button>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={processing}
            whileHover={{ scale: processing ? 1 : 1.02 }}
            whileTap={{ scale: processing ? 1 : 0.97 }}
            className="w-full py-3.5 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-70"
          >
            <AnimatePresence mode="wait">
              {processing ? (
                <motion.span key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                  <motion.span
                    className="w-3.5 h-3.5 border-2 border-ivory/40 border-t-ivory rounded-full inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  />
                  Processing…
                </motion.span>
              ) : (
                <motion.span key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Pay ₹{booking.amount.toLocaleString('en-IN')}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </Reveal>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone/50">{label}</span>
      <span className="font-medium text-stone">{value}</span>
    </div>
  )
}
