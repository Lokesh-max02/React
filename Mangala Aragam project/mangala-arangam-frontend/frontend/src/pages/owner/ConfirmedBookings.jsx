import { useEffect, useState } from 'react'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getOwnerBookings } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'

export default function ConfirmedBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getOwnerBookings()
      .then((data) => !cancelled && setBookings(data.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load bookings.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Bookings</p>
        <h1 className="font-display text-3xl text-stone">Confirmed Bookings</h1>
      </Reveal>

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}</div>
      ) : error ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
          <p className="font-display text-xl text-kumkum mb-2">Couldn't load bookings</p>
          <p className="text-sm text-stone/50">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">No confirmed bookings yet</p>
        </div>
      ) : (
        <RevealGroup className="space-y-4" stagger={0.06}>
          {bookings.map((b) => (
            <RevealItem key={b.id}>
              <div className="bg-white border border-stone/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg text-stone">{b.hallName}</h3>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-stone/55">
                    <span>Booking ID: <strong className="text-stone/70">{b.id}</strong></span>
                    <span>Event Date: <strong className="text-stone/70">{b.date}</strong></span>
                    <span>Guests: <strong className="text-stone/70">{b.guests}</strong></span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <p className="font-display text-lg text-kumkum">₹{b.amount.toLocaleString('en-IN')}</p>
                  <StatusBadge status={b.paymentStatus} size="sm" />
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
