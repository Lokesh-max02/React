import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getComplaintsAdmin, updateComplaintAdmin } from '../../services/index'
import { extractErrorMessage } from '../../services/apiClient'

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

const TYPE_LABELS = {
  HALL_ISSUE: 'Hall Issue',
  OWNER_ISSUE: 'Owner Issue',
  BOOKING_ISSUE: 'Booking Issue',
  PAYMENT_ISSUE: 'Payment Issue',
}

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [notes, setNotes] = useState({})

  useEffect(() => {
    let cancelled = false
    getComplaintsAdmin()
      .then((data) => !cancelled && setComplaints(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load complaints.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleUpdate = async (id, status) => {
    setUpdatingId(id)
    try {
      const updated = await updateComplaintAdmin(id, status, notes[id])
      setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update this complaint.'))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Support</p>
        <h1 className="font-display text-3xl text-stone">Complaints</h1>
      </Reveal>

      {error && <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>}

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}</div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">No complaints filed</p>
        </div>
      ) : (
        <RevealGroup className="space-y-4" stagger={0.06}>
          {complaints.map((c) => (
            <RevealItem key={c.id}>
              <div className="bg-white border border-stone/10 rounded-2xl p-5">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-dark">{TYPE_LABELS[c.type] || c.type}</span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="text-xs text-stone/45 mt-1">
                      {c.customerName}{c.hallName ? ` · ${c.hallName}` : ''}{c.bookingId ? ` · Booking #${c.bookingId}` : ''}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone/35">{c.createdAt ? c.createdAt.slice(0, 10) : ''}</p>
                </div>

                <p className="text-sm text-stone/70 leading-relaxed mb-4">{c.description}</p>

                <div className="kolam-divider mb-4" />

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone/40 mb-1.5">Resolution Notes</span>
                    <input
                      value={notes[c.id] ?? c.resolutionNotes ?? ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [c.id]: e.target.value }))}
                      placeholder="Add a note about how this was handled…"
                      className="input"
                    />
                  </label>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <motion.button
                        key={s}
                        onClick={() => handleUpdate(c.id, s)}
                        disabled={updatingId === c.id || c.status === s}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 ${
                          c.status === s ? 'bg-kumkum text-ivory border-kumkum' : 'border-stone/15 text-stone/60'
                        }`}
                      >
                        {s.replace('_', ' ')}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
