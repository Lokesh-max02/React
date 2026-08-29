import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'
import { getAvailability, setAvailability } from '../services/availabilityService'

const STATUS_OPTIONS = [
  { key: 'AVAILABLE', label: 'Available', className: 'bg-leaf/15 text-leaf' },
  { key: 'BOOKING_PENDING', label: 'Booking Pending', className: 'bg-gold/20 text-gold-dark' },
  { key: 'BOOKED', label: 'Booked', className: 'bg-blue-100 text-blue-700' },
  { key: 'UNAVAILABLE', label: 'Unavailable', className: 'bg-kumkum/15 text-kumkum' },
  { key: 'MAINTENANCE', label: 'Maintenance', className: 'bg-stone/15 text-stone/60' },
]

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.key, s]))

function monthRange(cursor) {
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { start: iso(start), end: iso(end) }
}

export default function OwnerAvailabilityCalendar({ hallId }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [direction, setDirection] = useState(0)
  const [statusByDate, setStatusByDate] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeCell, setActiveCell] = useState(null)

  const changeMonth = (delta) => {
    setDirection(delta)
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  const loadMonth = () => {
    if (!hallId) return
    setLoading(true)
    const { start, end } = monthRange(cursor)
    getAvailability(hallId, start, end)
      .then((rows) => {
        const map = {}
        rows.forEach((r) => {
          map[r.date] = r.status
        })
        setStatusByDate(map)
      })
      .catch(() => setStatusByDate({}))
      .finally(() => setLoading(false))
  }

  useEffect(loadMonth, [hallId, cursor])

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

  const handleSetStatus = async (dateKey, status) => {
    setSaving(true)
    setActiveCell(null)
    // Optimistic update, then reconcile with the server's response.
    setStatusByDate((prev) => ({ ...prev, [dateKey]: status }))
    try {
      await setAvailability(hallId, dateKey, status)
    } catch {
      loadMonth() // roll back to server truth if the write failed
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-full border border-stone/15 flex items-center justify-center text-stone/50 hover:text-kumkum">
          <FaChevronLeft size={12} />
        </motion.button>
        <div className="overflow-hidden relative h-6 w-36 text-center">
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
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => changeMonth(1)} className="w-8 h-8 rounded-full border border-stone/15 flex items-center justify-center text-stone/50 hover:text-kumkum">
          <FaChevronRight size={12} />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone/40 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      {loading ? (
        <div className="grid grid-cols-7 gap-1.5">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-stone/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 relative">
          {days.map((cell, i) => {
            if (!cell) return <div key={i} />
            const style = STATUS_MAP[cell.status] || STATUS_MAP.AVAILABLE
            return (
              <div key={cell.dateKey} className="relative">
                <motion.button
                  onClick={() => setActiveCell(activeCell === cell.dateKey ? null : cell.dateKey)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className={`w-full aspect-square rounded-lg text-xs font-semibold flex items-center justify-center ${style.className}`}
                >
                  {cell.day}
                </motion.button>

                <AnimatePresence>
                  {activeCell === cell.dateKey && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 top-full mt-1.5 left-1/2 -translate-x-1/2 bg-white rounded-xl border border-stone/10 shadow-soft p-2 w-44"
                    >
                      <div className="flex items-center justify-between px-1.5 pb-1.5 mb-1 border-b border-stone/10">
                        <span className="text-[11px] font-semibold text-stone/50">{cell.dateKey}</span>
                        <button onClick={() => setActiveCell(null)} className="text-stone/30 hover:text-kumkum">
                          <FaTimes size={10} />
                        </button>
                      </div>
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleSetStatus(cell.dateKey, opt.key)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium mb-0.5 last:mb-0 hover:bg-parchment transition-colors ${
                            cell.status === opt.key ? 'font-bold' : ''
                          }`}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${opt.className.split(' ')[0]}`} />
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}

      <div className="kolam-divider my-4" />

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {STATUS_OPTIONS.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-stone/55">
            <span className={`w-2.5 h-2.5 rounded-full ${s.className.split(' ')[0]}`} />
            {s.label}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-stone/40 mt-3">
        {saving ? 'Saving…' : 'Click a date to update its status. Changes save instantly.'}
      </p>
    </div>
  )
}
