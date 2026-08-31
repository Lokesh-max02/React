import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaEdit, FaTrash, FaCalendarAlt, FaSlidersH, FaPlus } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import RatingStars from '../../components/RatingStars'
import StatusBadge from '../../components/StatusBadge'
import { getMyHalls, deleteHall } from '../../services/hallService'
import { extractErrorMessage } from '../../services/apiClient'

const APPROVAL_STYLES = {
  APPROVED: 'bg-leaf/10 text-leaf border-leaf/30',
  PENDING: 'bg-gold/10 text-gold-dark border-gold/40',
  REJECTED: 'bg-kumkum/10 text-kumkum border-kumkum/30',
}

export default function MyHalls() {
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMyHalls()
      .then((data) => !cancelled && setHalls(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load your halls.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteHall(id)
      setHalls((prev) => prev.filter((h) => h.id !== id))
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete this hall.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <Reveal className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Manage</p>
          <h1 className="font-display text-3xl text-stone">My Halls</h1>
        </div>
        <Link to="/owner/halls/add">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-kumkum text-ivory text-sm font-semibold"
          >
            <FaPlus size={12} /> Add Wedding Hall
          </motion.span>
        </Link>
      </Reveal>

      {error && (
        <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" />
          ))}
        </div>
      ) : halls.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">No halls listed yet</p>
          <Link to="/owner/halls/add" className="text-kumkum font-semibold text-sm">Add your first wedding hall →</Link>
        </div>
      ) : (
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" stagger={0.06}>
          <AnimatePresence>
            {halls.map((h) => (
              <RevealItem key={h.id}>
                <motion.div layout exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl border border-stone/10 shadow-card overflow-hidden">
                  <div className="p-3 pb-0 relative">
                    <div className="arch-frame h-40">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-6 left-6">
                      <StatusBadge status={h.status} size="sm" />
                    </div>
                    <div className={`absolute top-6 right-6 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${APPROVAL_STYLES[h.approvalStatus] || APPROVAL_STYLES.PENDING}`}>
                      {h.approvalStatus}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-stone leading-snug">{h.name}</h3>
                    <p className="text-xs text-stone/50 mt-0.5">{h.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <RatingStars rating={h.rating} reviewCount={h.reviewCount} />
                      <span className="text-xs text-stone/50">{h.capacity} guests</span>
                    </div>
                    <p className="font-display text-lg text-kumkum mt-3">₹{h.price.toLocaleString('en-IN')}</p>

                    <div className="kolam-divider my-4" />

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                      <ActionLink to={`/halls/${h.id}`} icon={<FaEye size={11} />} label="View" />
                      <ActionLink to={`/owner/halls/${h.id}/edit`} icon={<FaEdit size={11} />} label="Edit" />
                      <ActionLink to={`/owner/halls/${h.id}/availability`} icon={<FaCalendarAlt size={11} />} label="Availability" />
                      <ActionLink to={`/owner/halls/${h.id}/status`} icon={<FaSlidersH size={11} />} label="Status" />
                    </div>
                    <motion.button
                      onClick={() => handleDelete(h.id)}
                      disabled={deletingId === h.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-kumkum/25 text-kumkum text-xs font-semibold hover:bg-kumkum/5 transition-colors disabled:opacity-50"
                    >
                      <FaTrash size={10} /> {deletingId === h.id ? 'Deleting…' : 'Delete Hall'}
                    </motion.button>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </AnimatePresence>
        </RevealGroup>
      )}
    </div>
  )
}

function ActionLink({ to, icon, label }) {
  return (
    <Link to={to}>
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone/15 text-stone/70 hover:border-kumkum hover:text-kumkum transition-colors"
      >
        {icon} {label}
      </motion.span>
    </Link>
  )
}
