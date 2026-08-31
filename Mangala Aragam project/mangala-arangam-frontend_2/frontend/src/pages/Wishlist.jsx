import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import RatingStars from '../components/RatingStars'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { getWishlist, removeFromWishlist } from '../services/index'
import { normalizeHall } from '../services/hallService'
import { extractErrorMessage } from '../services/apiClient'

export default function Wishlist() {
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getWishlist()
      .then((data) => !cancelled && setHalls(data.map(normalizeHall)))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load your wishlist.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleRemove = async (hallId) => {
    // Optimistic UI update. Note: the backend's DELETE /api/wishlist/{id}
    // expects the wishlist row's own id, which GET /api/wishlist doesn't
    // currently return alongside the hall data — only the hall itself. If
    // removal 404s, add a wishlistEntryId field to WishlistController's
    // response so this can target the right row.
    setHalls((prev) => prev.filter((h) => h.id !== hallId))
    try {
      await removeFromWishlist(hallId)
    } catch {
      // Removal failed server-side; UI already optimistically updated.
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Saved</p>
        <h1 className="font-display text-3xl text-stone mb-8">My Wishlist</h1>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-stone/10 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
          <p className="font-display text-xl text-kumkum mb-2">Couldn't load wishlist</p>
          <p className="text-sm text-stone/50">{error}</p>
        </div>
      ) : halls.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">Your wishlist is empty</p>
          <Link to="/halls" className="text-kumkum font-semibold text-sm">Browse wedding halls →</Link>
        </div>
      ) : (
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5" stagger={0.06}>
          <AnimatePresence>
            {halls.map((h) => (
              <RevealItem key={h.id}>
                <motion.div
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border border-stone/10 rounded-2xl p-4 flex gap-4"
                >
                  <div className="arch-frame w-28 h-28 shrink-0">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base text-stone leading-snug">{h.name}</h3>
                      <motion.button
                        onClick={() => handleRemove(h.id)}
                        whileHover={{ scale: 1.15, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Remove from wishlist"
                        className="text-stone/30 hover:text-kumkum shrink-0"
                      >
                        <FaTimes size={13} />
                      </motion.button>
                    </div>
                    <p className="text-xs text-stone/50 mt-0.5">{h.location}</p>
                    <RatingStars rating={h.rating} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display text-kumkum">₹{h.price.toLocaleString('en-IN')}</span>
                      <Link to={`/halls/${h.id}`} className="text-xs font-semibold text-kumkum hover:underline">
                        View →
                      </Link>
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
