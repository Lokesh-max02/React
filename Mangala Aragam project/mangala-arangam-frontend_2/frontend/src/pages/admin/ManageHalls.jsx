import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaSearch, FaCheck, FaTimes, FaTrash, FaExternalLinkAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import RatingStars from '../../components/RatingStars'
import { getAllHallsAdmin, approveHallAdmin, rejectHallAdmin, deleteHallAdmin } from '../../services/index'
import { normalizeHall } from '../../services/hallService'
import { extractErrorMessage } from '../../services/apiClient'

const APPROVAL_STYLES = {
  APPROVED: 'bg-leaf/10 text-leaf border-leaf/30',
  PENDING: 'bg-gold/10 text-gold-dark border-gold/40',
  REJECTED: 'bg-kumkum/10 text-kumkum border-kumkum/30',
}

const TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function ManageHalls() {
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('PENDING')
  const [actingId, setActingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    getAllHallsAdmin()
      .then((data) => !cancelled && setHalls(data.map(normalizeHall)))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load halls.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    let result = tab === 'ALL' ? halls : halls.filter((h) => h.approvalStatus === tab)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((h) => h.name.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q))
    }
    return result
  }, [halls, tab, query])

  const act = async (id, action) => {
    setActingId(id)
    setError('')
    try {
      if (action === 'approve') {
        const updated = normalizeHall(await approveHallAdmin(id))
        setHalls((prev) => prev.map((h) => (h.id === id ? updated : h)))
      } else if (action === 'reject') {
        const updated = normalizeHall(await rejectHallAdmin(id))
        setHalls((prev) => prev.map((h) => (h.id === id ? updated : h)))
      } else if (action === 'delete') {
        await deleteHallAdmin(id)
        setHalls((prev) => prev.filter((h) => h.id !== id))
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'That action failed.'))
    } finally {
      setActingId(null)
    }
  }

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Listings</p>
        <h1 className="font-display text-3xl text-stone">Manage Wedding Halls</h1>
        <p className="text-sm text-stone/50 mt-1">Only approved halls appear publicly on the site.</p>
      </Reveal>

      {error && <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t ? 'bg-kumkum text-ivory' : 'bg-white border border-stone/15 text-stone/60'
              }`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/30" size={13} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search halls…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone/15 text-sm outline-none focus-visible:border-kumkum bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">No halls in this view</p>
        </div>
      ) : (
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" stagger={0.06}>
          <AnimatePresence>
            {filtered.map((h) => (
              <RevealItem key={h.id}>
                <motion.div layout exit={{ opacity: 0, scale: 0.9 }} className="bg-white border border-stone/10 rounded-2xl overflow-hidden">
                  <div className="p-3 pb-0 relative">
                    <div className="arch-frame h-36">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute top-6 right-6 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${APPROVAL_STYLES[h.approvalStatus]}`}>
                      {h.approvalStatus}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base text-stone leading-snug">{h.name}</h3>
                      <Link to={`/halls/${h.id}`} className="text-stone/30 hover:text-kumkum shrink-0" title="View public page">
                        <FaExternalLinkAlt size={11} />
                      </Link>
                    </div>
                    <p className="text-xs text-stone/50 mt-0.5">{h.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <RatingStars rating={h.rating} />
                      <span className="text-xs text-stone/50">{h.capacity} guests</span>
                    </div>
                    <p className="font-display text-base text-kumkum mt-2">₹{h.price.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-stone/40 mt-1">Owner: {h.owner?.name || '—'}</p>

                    <div className="kolam-divider my-3" />

                    <div className="flex gap-2">
                      {h.approvalStatus !== 'APPROVED' && (
                        <motion.button
                          onClick={() => act(h.id, 'approve')}
                          disabled={actingId === h.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-leaf text-ivory text-xs font-semibold disabled:opacity-50"
                        >
                          <FaCheck size={10} /> Approve
                        </motion.button>
                      )}
                      {h.approvalStatus !== 'REJECTED' && (
                        <motion.button
                          onClick={() => act(h.id, 'reject')}
                          disabled={actingId === h.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-kumkum/30 text-kumkum text-xs font-semibold disabled:opacity-50"
                        >
                          <FaTimes size={10} /> Reject
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => act(h.id, 'delete')}
                        disabled={actingId === h.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-3 py-2 rounded-lg border border-stone/15 text-stone/50 text-xs font-semibold hover:border-kumkum hover:text-kumkum transition-colors disabled:opacity-50"
                        aria-label="Delete hall"
                      >
                        <FaTrash size={10} />
                      </motion.button>
                    </div>
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
