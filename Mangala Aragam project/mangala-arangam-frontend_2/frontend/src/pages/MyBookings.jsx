import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BookingCard from '../components/BookingCard'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { getMyBookings, cancelBooking } from '../services/bookingService'
import { extractErrorMessage } from '../services/apiClient'

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

export default function MyBookings() {
  const [tab, setTab] = useState('ALL')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getMyBookings()
      .then((data) => !cancelled && setBookings(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load your bookings.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = tab === 'ALL' ? bookings : bookings.filter((b) => b.status === tab)

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Your Requests</p>
        <h1 className="font-display text-3xl text-stone mb-8">My Bookings</h1>
      </Reveal>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
          >
            {tab === t.key && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 bg-kumkum rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${tab === t.key ? 'text-ivory' : 'text-stone/60'}`}>{t.label}</span>
            {tab !== t.key && <span className="absolute inset-0 rounded-full border border-stone/15" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
            <p className="font-display text-xl text-kumkum mb-2">Couldn't load bookings</p>
            <p className="text-sm text-stone/50">{error}</p>
          </motion.div>
        ) : loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white border border-stone/10 animate-pulse" />
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 bg-white rounded-2xl border border-stone/10"
          >
            <p className="font-display text-xl text-stone mb-2">No bookings here yet</p>
            <p className="text-sm text-stone/50">Bookings you make will show up in this tab.</p>
          </motion.div>
        ) : (
          <RevealGroup key={tab} className="space-y-4" stagger={0.06}>
            {filtered.map((b) => (
              <RevealItem key={b.id}>
                <BookingCard booking={b} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </AnimatePresence>
    </div>
  )
}
