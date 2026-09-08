import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import Reveal from '../../components/Reveal'
import HallForm from '../../components/HallForm'
import { getHallById, updateHall } from '../../services/hallService'
import { extractErrorMessage } from '../../services/apiClient'

export default function EditHall() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hall, setHall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getHallById(id)
      .then((data) => !cancelled && setHall(data))
      .catch(() => !cancelled && setHall(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <div className="max-w-3xl"><div className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" /></div>
  }

  if (!hall) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <h1 className="font-display text-2xl text-stone mb-3">Hall not found</h1>
        <Link to="/owner/halls" className="text-kumkum font-semibold">Back to My Halls</Link>
      </div>
    )
  }

  const initial = {
    name: hall.name,
    description: hall.description,
    location: hall.location,
    address: hall.address,
    googleMapLink: '',
    price: hall.price,
    capacity: hall.capacity,
    rooms: hall.rooms,
    parking: hall.parking,
    facilities: hall.facilities,
    mainImageUrl: hall.image,
    galleryImages: hall.gallery,
  }

  const handleSubmit = async (payload) => {
    setError('')
    try {
      await updateHall(id, payload)
      setSaved(true)
      setTimeout(() => navigate('/owner/halls'), 900)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save changes.'))
    }
  }

  return (
    <div className="max-w-3xl">
      <Reveal className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Edit Listing</p>
          <h1 className="font-display text-3xl text-stone">{hall.name}</h1>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-leaf text-sm font-semibold"
            >
              <FaCheck size={12} /> Changes saved
            </motion.span>
          )}
        </AnimatePresence>
      </Reveal>
      {error && (
        <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-4 text-sm text-kumkum">{error}</div>
      )}
      <HallForm initial={initial} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  )
}
