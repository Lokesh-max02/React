import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import {
  FaMapMarkerAlt,
  FaUserFriends,
  FaCar,
  FaSnowflake,
  FaUtensils,
  FaBed,
  FaTheaterMasks,
  FaPhone,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa'
import RatingStars from '../components/RatingStars'
import StatusBadge from '../components/StatusBadge'
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import ReviewCard from '../components/ReviewCard'
import { getHallById } from '../services/hallService'
import { getHallReviews, addToWishlist, removeFromWishlist, getWishlist } from '../services/index'
import { useAuth } from '../context/AuthContext'

const FACILITY_ICONS = {
  AC: <FaSnowflake />,
  'Dining Hall': <FaUtensils />,
  Stage: <FaTheaterMasks />,
  Parking: <FaCar />,
  Rooms: <FaBed />,
}

export default function HallDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [hall, setHall] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)

    Promise.all([getHallById(id), getHallReviews(id).catch(() => [])])
      .then(([hallData, reviewData]) => {
        if (cancelled) return
        setHall(hallData)
        setReviews(reviewData)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    getWishlist()
      .then((data) => !cancelled && setWishlisted(data.some((h) => String(h.id) === String(id))))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id, isAuthenticated])

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/halls/${id}` } })
      return
    }
    const next = !wishlisted
    setWishlisted(next) // optimistic
    try {
      if (next) {
        await addToWishlist(hall.id)
      } else {
        await removeFromWishlist(hall.id)
      }
    } catch {
      setWishlisted(!next) // roll back on failure
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="h-[340px] sm:h-[420px] rounded-2xl bg-white border border-stone/10 animate-pulse mb-8" />
      </div>
    )
  }

  if (notFound || !hall) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-stone mb-3">Hall not found</h1>
        <Link to="/halls" className="text-kumkum font-semibold">Back to all halls</Link>
      </div>
    )
  }

  const goToBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/book/${hall.id}` } })
      return
    }
    const query = selectedDate ? `?date=${selectedDate}` : ''
    navigate(`/book/${hall.id}${query}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 mb-8">
        <div className="arch-frame h-[340px] sm:h-[420px] relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={hall.gallery[activeImage]}
              alt={hall.name}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          {hall.gallery.map((img, i) => (
            <motion.button
              key={img}
              onClick={() => setActiveImage(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl overflow-hidden h-24 sm:h-[130px] border-2 transition-colors ${
                activeImage === i ? 'border-kumkum' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <Reveal>
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge status={hall.status} />
              <h1 className="font-display text-3xl sm:text-4xl text-stone mt-3">{hall.name}</h1>
              <p className="flex items-center gap-1.5 text-stone/55 mt-2 text-sm">
                <FaMapMarkerAlt className="text-kumkum" /> {hall.location}
              </p>
            </div>
            <motion.button
              onClick={toggleWishlist}
              whileTap={{ scale: 0.85 }}
              className="w-11 h-11 shrink-0 rounded-full border border-stone/15 flex items-center justify-center text-kumkum"
              aria-label="Toggle wishlist"
            >
              <motion.span animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
                {wishlisted ? <FaHeart /> : <FaRegHeart />}
              </motion.span>
            </motion.button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <RatingStars rating={hall.rating} reviewCount={hall.reviewCount} size={16} />
            <span className="flex items-center gap-1.5 text-sm text-stone/55">
              <FaUserFriends className="text-kumkum" /> Up to {hall.capacity} guests
            </span>
          </div>

          <div className="kolam-divider my-6" />

          <h2 className="font-display text-xl text-stone mb-3">About This Hall</h2>
          <p className="text-sm text-stone/65 leading-relaxed">{hall.description}</p>

          <h2 className="font-display text-xl text-stone mt-8 mb-4">Facilities</h2>
          <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 gap-3" stagger={0.04}>
            {hall.facilities.map((f) => (
              <RevealItem key={f}>
                <motion.div
                  whileHover={{ y: -2, backgroundColor: 'rgba(122,27,61,0.06)' }}
                  className="flex items-center gap-2.5 bg-parchment rounded-xl px-3.5 py-2.5"
                >
                  <span className="text-kumkum">{FACILITY_ICONS[f] || <FaTheaterMasks />}</span>
                  <span className="text-sm text-stone/70 font-medium">{f}</span>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-white border border-stone/10 rounded-xl px-4 py-3">
              <p className="text-stone/40 text-xs uppercase tracking-wide">Rooms</p>
              <p className="font-display text-lg text-stone">{hall.rooms}</p>
            </div>
            <div className="bg-white border border-stone/10 rounded-xl px-4 py-3">
              <p className="text-stone/40 text-xs uppercase tracking-wide">Parking Capacity</p>
              <p className="font-display text-lg text-stone">{hall.parking} vehicles</p>
            </div>
          </div>

          <h2 className="font-display text-xl text-stone mt-8 mb-4">Owner Information</h2>
          <div className="bg-white border border-stone/10 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone text-sm">{hall.owner.name}</p>
              <p className="text-xs text-stone/50">{hall.owner.businessName}</p>
            </div>
            <a href={`tel:${hall.owner.phone}`} className="flex items-center gap-2 text-kumkum text-sm font-semibold">
              <FaPhone size={12} /> {hall.owner.phone}
            </a>
          </div>

          <h2 className="font-display text-xl text-stone mt-10 mb-4">
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-stone/50">No reviews yet for this hall.</p>
          ) : (
            <div>{reviews.map((r) => <ReviewCard key={r.id} review={r} />)}</div>
          )}
        </Reveal>

        {/* Sidebar: price + calendar */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 h-fit lg:sticky lg:top-24"
        >
          <div className="bg-white border border-stone/10 rounded-2xl p-5 shadow-card">
            <p className="text-[11px] uppercase tracking-wide text-stone/40">Price</p>
            <p className="font-display text-2xl text-kumkum">₹{hall.price.toLocaleString('en-IN')} <span className="text-sm text-stone/40 font-body">/ event</span></p>
            <motion.button
              onClick={goToBooking}
              disabled={hall.status !== 'AVAILABLE' && !selectedDate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-4 py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Book This Hall
            </motion.button>
            {selectedDate && (
              <p className="text-xs text-stone/50 mt-2 text-center">Selected date: {selectedDate}</p>
            )}
          </div>

          <AvailabilityCalendar hallId={hall.id} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </motion.aside>
      </div>
    </div>
  )
}
