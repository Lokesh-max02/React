import { useEffect, useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Reveal from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getAllBookingsAdmin } from '../../services/index'
import { normalizeBooking } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    getAllBookingsAdmin()
      .then((data) => !cancelled && setBookings(data.map(normalizeBooking)))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load bookings.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return bookings
    const q = query.toLowerCase()
    return bookings.filter((b) => b.hallName?.toLowerCase().includes(q) || String(b.id).includes(q))
  }, [bookings, query])

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Oversight</p>
        <h1 className="font-display text-3xl text-stone">Manage Bookings</h1>
      </Reveal>

      {error && <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>}

      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/30" size={13} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by hall or booking ID…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone/15 text-sm outline-none focus-visible:border-kumkum bg-white"
        />
      </div>

      <div className="bg-white border border-stone/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-stone/5 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><p className="font-display text-lg text-stone">No bookings found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-stone/40 border-b border-stone/10">
                  <th className="px-5 py-3 font-semibold">Booking ID</th>
                  <th className="px-5 py-3 font-semibold">Hall</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Booking Status</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                </tr>
              </thead>
              <motion.tbody initial="hidden" animate="show" transition={{ staggerChildren: 0.02 }}>
                {filtered.map((b) => (
                  <motion.tr
                    key={b.id}
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                    className="border-b border-stone/5 last:border-0 hover:bg-parchment/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-stone">{b.id}</td>
                    <td className="px-5 py-3.5 text-stone/70">{b.hallName}</td>
                    <td className="px-5 py-3.5 text-stone/60">{b.date}</td>
                    <td className="px-5 py-3.5 font-display text-kumkum">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={b.status} size="sm" /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={b.paymentStatus} size="sm" /></td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
