import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import Reveal from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getHallById } from '../../services/hallService'
import { getAvailability, setAvailability } from '../../services/availabilityService'
import { getOwnerBookings } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'

const STATUS_OPTIONS = [
  { key: 'AVAILABLE', label: 'Available' },
  { key: 'BOOKING_PENDING', label: 'Booking Pending' },
  { key: 'BOOKED', label: 'Booked' },
  { key: 'UNAVAILABLE', label: 'Unavailable' },
  { key: 'MAINTENANCE', label: 'Maintenance' },
]

const today = () => new Date().toISOString().slice(0, 10)

export default function HallStatusManage() {
  const { id } = useParams()
  const [hall, setHall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('AVAILABLE')
  const [selectedDate, setSelectedDate] = useState('')
  const [dateStatus, setDateStatus] = useState(null)
  const [booking, setBooking] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getHallById(id), getAvailability(id, today(), today())])
      .then(([hallData, avail]) => {
        if (cancelled) return
        setHall(hallData)
        setStatus(avail[0]?.status || 'AVAILABLE')
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load this hall.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!selectedDate) {
      setDateStatus(null)
      setBooking(null)
      return
    }
    let cancelled = false
    getAvailability(id, selectedDate, selectedDate)
      .then((rows) => {
        if (cancelled) return
        const row = rows[0]
        setDateStatus(row?.status || 'AVAILABLE')
        if (row?.bookingId) {
          getOwnerBookings().then((bookings) => {
            if (!cancelled) setBooking(bookings.find((b) => b.id === row.bookingId) || null)
          })
        } else {
          setBooking(null)
        }
      })
      .catch(() => !cancelled && setDateStatus(null))
    return () => {
      cancelled = true
    }
  }, [id, selectedDate])

  if (loading) {
    return <div className="max-w-2xl"><div className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" /></div>
  }

  if (!hall) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <h1 className="font-display text-2xl text-stone mb-3">Hall not found</h1>
        <Link to="/owner/halls" className="text-kumkum font-semibold">Back to My Halls</Link>
      </div>
    )
  }

  // "Hall status" maps onto today's date-availability record — the backend
  // models status per-date (HallAvailability) rather than as a single
  // hall-level field, so updating "current status" here writes today's entry.
  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await setAvailability(hall.id, today(), status)
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update status.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Status Management</p>
        <h1 className="font-display text-3xl text-stone">{hall.name}</h1>
      </Reveal>

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-stone/40 mb-1">Today's Status</p>
            <StatusBadge status={status} />
          </div>
          <div className="w-1/2">
            <p className="text-[11px] uppercase tracking-wide text-stone/40 mb-1.5">Check a specific date</p>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {selectedDate && (
          <div className="bg-parchment rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wide text-stone/40">Status on {selectedDate}</p>
              {dateStatus && <StatusBadge status={dateStatus} size="sm" />}
            </div>
            {booking ? (
              <div className="text-sm text-stone/70 space-y-1">
                <p><strong className="text-stone">Booking</strong> · {booking.guests} guests</p>
                <p>Booking ID: {booking.id} · ₹{booking.amount.toLocaleString('en-IN')}</p>
              </div>
            ) : (
              <p className="text-sm text-stone/50">No booking tied to this date.</p>
            )}
          </div>
        )}

        {error && <p className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2">{error}</p>}

        <div className="kolam-divider" />

        <div>
          <p className="text-[11px] uppercase tracking-wide text-stone/40 mb-3">Update Today's Status</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {STATUS_OPTIONS.map((opt) => (
              <motion.button
                key={opt.key}
                onClick={() => setStatus(opt.key)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                  status === opt.key ? 'bg-kumkum text-ivory border-kumkum' : 'border-stone/15 text-stone/60'
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.97 }}
          className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <FaCheck size={12} /> Status Updated
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {saving ? 'Saving…' : 'Save Status'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </Reveal>
    </div>
  )
}
