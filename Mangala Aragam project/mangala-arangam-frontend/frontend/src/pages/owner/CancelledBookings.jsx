import { useEffect, useState } from 'react'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getOwnerBookings } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'

export default function CancelledBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getOwnerBookings()
      .then((data) => !cancelled && setBookings(data.filter((b) => b.status === 'CANCELLED' || b.status === 'REJECTED')))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load cancellations.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Bookings</p>
        <h1 className="font-display text-3xl text-stone">Cancelled Bookings</h1>
      </Reveal>

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}</div>
      ) : error ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
          <p className="font-display text-xl text-kumkum mb-2">Couldn't load cancellations</p>
          <p className="text-sm text-stone/50">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">No cancellations</p>
        </div>
      ) : (
        <RevealGroup className="space-y-4" stagger={0.06}>
          {bookings.map((b) => (
            <RevealItem key={b.id}>
              <div className="bg-white border border-stone/10 rounded-2xl p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg text-stone">{b.hallName}</h3>
                      <StatusBadge status={b.status} size="sm" />
                    </div>
                    <p className="text-xs text-stone/50 mt-1">{b.date}</p>
                  </div>
                  <p className="font-display text-lg text-stone/40 line-through">₹{b.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
