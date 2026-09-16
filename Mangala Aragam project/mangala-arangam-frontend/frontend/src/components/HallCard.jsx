import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaUserFriends, FaBalanceScale, FaCheck } from 'react-icons/fa'
import { useState } from 'react'
import { motion } from 'framer-motion'
import RatingStars from './RatingStars'
import StatusBadge from './StatusBadge'
import { useAuth } from '../context/AuthContext'

export default function HallCard({ hall, wishlisted: controlledWishlisted, onToggleWishlist, comparing, onToggleCompare }) {
  const { isAuthenticated, user } = useAuth()
  const [localWishlisted, setLocalWishlisted] = useState(false)
  const isControlled = controlledWishlisted !== undefined
  const wishlisted = isControlled ? controlledWishlisted : localWishlisted
  // Wishlists are a customer-only feature — hide entirely for logged-in
  // owners/admins rather than let them hit a 403 from the backend.
  const canUseWishlist = !isAuthenticated || user?.role === 'ROLE_CUSTOMER'

  const handleToggle = () => {
    if (isControlled) {
      onToggleWishlist?.(hall.id, !wishlisted)
    } else {
      setLocalWishlisted((v) => !v)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`group bg-white rounded-2xl shadow-card border overflow-hidden transition-colors ${
        comparing ? 'border-gold ring-2 ring-gold/40' : 'border-stone/5'
      }`}
    >
      <div className="relative p-3 pb-0">
        <div className="arch-frame h-52">
          <motion.img
            src={hall.image}
            alt={hall.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          {canUseWishlist && (
            <motion.button
              onClick={handleToggle}
              whileTap={{ scale: 0.8 }}
              aria-label="Toggle wishlist"
              className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-kumkum shadow-soft"
            >
              <motion.span
                animate={wishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                {wishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              </motion.span>
            </motion.button>
          )}
          {onToggleCompare && (
            <motion.button
              onClick={() => onToggleCompare(hall.id, !comparing)}
              whileTap={{ scale: 0.8 }}
              aria-label={comparing ? 'Remove from comparison' : 'Add to comparison'}
              title={comparing ? 'Remove from comparison' : 'Add to comparison'}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-soft transition-colors ${
                comparing ? 'bg-gold text-ivory' : 'bg-white/90 text-stone/60'
              }`}
            >
              {comparing ? <FaCheck size={13} /> : <FaBalanceScale size={13} />}
            </motion.button>
          )}
        </div>
        <div className="absolute top-6 left-6">
          <StatusBadge status={hall.status} size="sm" />
        </div>
      </div>

      <div className="p-5 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-stone leading-snug">{hall.name}</h3>
        </div>
        <p className="text-sm text-stone/55 mt-1">{hall.location}</p>

        <div className="flex items-center justify-between mt-3">
          <RatingStars rating={hall.rating} reviewCount={hall.reviewCount} />
          <span className="flex items-center gap-1 text-xs text-stone/50">
            <FaUserFriends size={12} /> {hall.capacity}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {hall.facilities.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[11px] px-2 py-1 rounded-full bg-parchment text-stone/60 font-medium"
            >
              {f}
            </span>
          ))}
          {hall.facilities.length > 3 && (
            <span className="text-[11px] px-2 py-1 rounded-full bg-parchment text-stone/60 font-medium">
              +{hall.facilities.length - 3}
            </span>
          )}
        </div>

        <div className="kolam-divider my-4" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-stone/40">Starting at</p>
            <p className="font-display text-lg text-kumkum">₹{hall.price.toLocaleString('en-IN')}</p>
          </div>
          <Link to={`/halls/${hall.id}`}>
            <motion.span
              whileHover={{ backgroundColor: '#7A1B3D', color: '#FBF6EC' }}
              transition={{ duration: 0.2 }}
              className="inline-block px-4 py-2 rounded-full border border-kumkum text-kumkum text-sm font-semibold"
            >
              View Details
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
