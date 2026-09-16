import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheck, FaMinus, FaArrowLeft } from 'react-icons/fa'
import Reveal from '../components/Reveal'
import RatingStars from '../components/RatingStars'
import StatusBadge from '../components/StatusBadge'
import { getHallById } from '../services/hallService'

export default function CompareHalls() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const ids = useMemo(
    () => (searchParams.get('ids') || '').split(',').filter(Boolean),
    [searchParams]
  )

  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all(ids.map((id) => getHallById(id)))
      .then((data) => !cancelled && setHalls(data))
      .catch(() => !cancelled && setError('Could not load one or more halls for comparison.'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [ids])

  // Union of every facility across the compared halls, so we can show a
  // consistent checklist row per facility rather than per-hall lists.
  const allFacilities = useMemo(() => {
    const set = new Set()
    halls.forEach((h) => h.facilities?.forEach((f) => set.add(f)))
    return Array.from(set).sort()
  }, [halls])

  if (ids.length < 2) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-stone mb-3">Nothing to compare yet</h1>
        <p className="text-sm text-stone/55 mb-6">
          Pick at least 2 halls from the listing page using the compare icon on each card.
        </p>
        <Link to="/halls" className="text-kumkum font-semibold">← Back to Wedding Halls</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="h-10 w-64 bg-white border border-stone/10 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ids.map((id) => <div key={id} className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-xl text-kumkum mb-2">Couldn't load comparison</p>
        <p className="text-sm text-stone/50 mb-6">{error}</p>
        <Link to="/halls" className="text-kumkum font-semibold">← Back to Wedding Halls</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <Reveal className="mb-8">
        <button
          onClick={() => navigate('/halls')}
          className="flex items-center gap-2 text-sm text-stone/55 hover:text-kumkum transition-colors mb-3"
        >
          <FaArrowLeft size={12} /> Back to Wedding Halls
        </button>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Side by Side</p>
        <h1 className="font-display text-3xl sm:text-4xl text-stone">Comparing {halls.length} Wedding Halls</h1>
      </Reveal>

      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-5 min-w-[640px]"
          style={{ gridTemplateColumns: `160px repeat(${halls.length}, minmax(220px, 1fr))` }}
        >
          {/* Header row: image, name, CTA per hall */}
          <div />
          {halls.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-stone/10 rounded-2xl p-4"
            >
              <div className="arch-frame h-36 mb-3">
                <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display text-base text-stone leading-snug mb-1">{h.name}</h3>
              <p className="text-xs text-stone/50 mb-2">{h.location}</p>
              <StatusBadge status={h.status} size="sm" />
              <Link to={`/halls/${h.id}`} className="block mt-3">
                <span className="block text-center px-4 py-2 rounded-full border border-kumkum text-kumkum text-xs font-semibold hover:bg-kumkum hover:text-ivory transition-colors">
                  View Details
                </span>
              </Link>
            </motion.div>
          ))}

          <Row label="Price">
            {halls.map((h) => (
              <Cell key={h.id}>
                <span className="font-display text-lg text-kumkum">₹{h.price.toLocaleString('en-IN')}</span>
              </Cell>
            ))}
          </Row>

          <Row label="Rating">
            {halls.map((h) => (
              <Cell key={h.id}><RatingStars rating={h.rating} reviewCount={h.reviewCount} /></Cell>
            ))}
          </Row>

          <Row label="Guest Capacity">
            {halls.map((h) => <Cell key={h.id}>{h.capacity} guests</Cell>)}
          </Row>

          <Row label="Rooms">
            {halls.map((h) => <Cell key={h.id}>{h.rooms ?? '—'}</Cell>)}
          </Row>

          <Row label="Parking">
            {halls.map((h) => <Cell key={h.id}>{h.parking ? `${h.parking} vehicles` : '—'}</Cell>)}
          </Row>

          {allFacilities.map((facility) => (
            <Row key={facility} label={facility}>
              {halls.map((h) => (
                <Cell key={h.id}>
                  {h.facilities?.includes(facility) ? (
                    <span className="w-6 h-6 rounded-full bg-leaf/10 text-leaf flex items-center justify-center mx-auto">
                      <FaCheck size={11} />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-stone/5 text-stone/25 flex items-center justify-center mx-auto">
                      <FaMinus size={10} />
                    </span>
                  )}
                </Cell>
              ))}
            </Row>
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <>
      <div className="flex items-center text-xs font-semibold uppercase tracking-wide text-stone/45 py-3 border-t border-stone/10">
        {label}
      </div>
      {children}
    </>
  )
}

function Cell({ children }) {
  return (
    <div className="flex items-center justify-center text-center text-sm text-stone/70 py-3 border-t border-stone/10">
      {children}
    </div>
  )
}
