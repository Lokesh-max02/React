import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getOwnerBookings, approveBooking, rejectBooking } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'

export default function BookingRequests() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [decidingId, setDecidingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    getOwnerBookings()
      .then((data) => !cancelled && setBookings(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load booking requests.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const decide = async (id, decision) => {
    setDecidingId(id)
    setError('')
    try {
      const updated = decision === 'CONFIRMED' ? await approveBooking(id) : await rejectBooking(id)
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update this booking.'))
    } finally {
      setDecidingId(null)
    }
  }

  const pending = bookings.filter((b) => b.status === 'PENDING')
  const decided = bookings.filter((b) => b.status !== 'PENDING').slice(0, 8)

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Requests</p>
        <h1 className="font-display text-3xl text-stone">Booking Requests</h1>
        <p className="text-sm text-stone/50 mt-1">Accepting locks the date as Booked. Rejecting frees it back up.</p>
      </Reveal>

      {error && (
        <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-stone/10 animate-pulse" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone/10 mb-8">
          <p className="font-display text-lg text-stone mb-1">No pending requests</p>
          <p className="text-sm text-stone/50">New booking requests will show up here.</p>
        </div>
      ) : (
        <RevealGroup className="space-y-4 mb-10" stagger={0.06}>
          <AnimatePresence>
            {pending.map((r) => (
              <RevealItem key={r.id}>
                <motion.div layout exit={{ opacity: 0, x: -20 }} className="bg-white border border-stone/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg text-stone">{r.hallName}</h3>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-stone/55">
                      <span>Booking ID: <strong className="text-stone/70">{r.id}</strong></span>
                      <span>Event Date: <strong className="text-stone/70">{r.date}</strong></span>
                      <span>Guests: <strong className="text-stone/70">{r.guests}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <p className="font-display text-lg text-kumkum mr-2">₹{r.amount.toLocaleString('en-IN')}</p>
                    <motion.button
                      onClick={() => decide(r.id, 'REJECTED')}
                      disabled={decidingId === r.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full border border-kumkum/30 text-kumkum flex items-center justify-center hover:bg-kumkum/5 transition-colors disabled:opacity-50"
                      aria-label="Reject"
                    >
                      <FaTimes size={14} />
                    </motion.button>
                    <motion.button
                      onClick={() => decide(r.id, 'CONFIRMED')}
                      disabled={decidingId === r.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-leaf text-ivory flex items-center justify-center disabled:opacity-50"
                      aria-label="Accept"
                    >
                      <FaCheck size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </AnimatePresence>
        </RevealGroup>
      )}

      {decided.length > 0 && (
        <>
          <h2 className="font-display text-lg text-stone mb-4">Recently Decided</h2>
          <div className="space-y-3">
            {decided.map((r) => (
              <div key={r.id} className="bg-white border border-stone/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone">{r.hallName}</p>
                  <p className="text-xs text-stone/45">{r.date}</p>
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
