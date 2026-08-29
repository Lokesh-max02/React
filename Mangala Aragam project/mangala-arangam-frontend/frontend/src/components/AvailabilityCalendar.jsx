import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { getAvailability } from '../services/availabilityService'

const STATUS_COLORS = {
  AVAILABLE: 'bg-leaf/15 text-leaf hover:bg-leaf/25',
  BOOKING_PENDING: 'bg-gold/20 text-gold-dark hover:bg-gold/30',
  BOOKED: 'bg-blue-100 text-blue-700',
  UNAVAILABLE: 'bg-kumkum/15 text-kumkum',
  MAINTENANCE: 'bg-stone/15 text-stone/60',
}

const LEGEND = [
  { status: 'AVAILABLE', label: 'Available' },
  { status: 'BOOKING_PENDING', label: 'Booking Pending' },
  { status: 'BOOKED', label: 'Booked' },
  { status: 'UNAVAILABLE', label: 'Unavailable' },
  { status: 'MAINTENANCE', label: 'Maintenance' },
]

function monthRange(cursor) {
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { start: iso(start), end: iso(end) }
}

export default function AvailabilityCalendar({ hallId, onSelectDate, selectedDate }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [direction, setDirection] = useState(0)
  const [statusByDate, setStatusByDate] = useState({})
  const [loading, setLoading] = useState(true)

  const changeMonth = (delta) => {
    setDirection(delta)
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  // Fetch this hall's availability for the visible month from the backend.
  // GET /api/halls/{hallId}/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
  // Dates the backend doesn't return default to AVAILABLE (no override on record yet).
  useEffect(() => {
    if (!hallId) return
    let cancelled = false
    setLoading(true)
    const { start, end } = monthRange(cursor)

    getAvailability(hallId, start, end)
      .then((rows) => {
        if (cancelled) return
        const map = {}
        rows.forEach((r) => {
          map[r.date] = r.status
        })
        setStatusByDate(map)
      })
      .catch(() => {
        if (!cancelled) setStatusByDate({})
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [hallId, cursor])

  const days = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d)
      const dateKey = dateObj.toISOString().slice(0, 10)
      cells.push({ day: d, dateKey, status: statusByDate[dateKey] || 'AVAILABLE', dateObj })
    }
    return cells
  }, [cursor, statusByDate])

  const monthLabel = cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="bg-white rounded-2xl border border-stone/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="w-8 h-8 rounded-full border border-stone/15 flex items-center justify-center text-stone/50 hover:text-kumkum"
          aria-label="Previous month"
        >
          <FaChevronLeft size={12} />
        </button>
        <div className="overflow-hidden relative h-6 w-32 text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.p
              key={monthLabel}
              custom={direction}
              initial={{ x: direction >= 0 ? 24 : -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction >= 0 ? -24 : 24, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display text-lg text-stone absolute inset-0"
            >
              {monthLabel}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          onClick={() => changeMonth(1)}
          className="w-8 h-8 rounded-full border border-stone/15 flex items-center justify-center text-stone/50 hover:text-kumkum"
          aria-label="Next month"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone/40 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-7 gap-1.5">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-stone/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((cell, i) => {
            if (!cell) return <div key={i} />
            const isPast = cell.dateObj < today
            const isSelected = selectedDate === cell.dateKey
            const clickable = cell.status === 'AVAILABLE' && !isPast

            return (
              <button
                key={cell.dateKey}
                disabled={!clickable}
                onClick={() => clickable && onSelectDate?.(cell.dateKey)}
                className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  isPast ? 'bg-stone/5 text-stone/25' : STATUS_COLORS[cell.status]
                } ${isSelected ? 'ring-2 ring-kumkum' : ''} ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                title={cell.status.replace('_', ' ')}
              >
                {cell.day}
              </button>
            )
          })}
        </div>
      )}

      <div className="kolam-divider my-4" />

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {LEGEND.map((l) => (
          <span key={l.status} className="flex items-center gap-1.5 text-[11px] text-stone/55">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[l.status].split(' ')[0]}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}
