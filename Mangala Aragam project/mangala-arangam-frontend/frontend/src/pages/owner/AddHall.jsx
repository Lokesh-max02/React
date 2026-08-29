import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'
import Reveal from '../../components/Reveal'
import HallForm from '../../components/HallForm'
import { createHall } from '../../services/hallService'
import { extractErrorMessage } from '../../services/apiClient'

export default function AddHall() {
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (payload) => {
    setError('')
    try {
      await createHall(payload)
      setDone(true)
      setTimeout(() => navigate('/owner/halls'), 1400)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not add this hall.'))
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="w-16 h-16 mx-auto rounded-full bg-leaf/10 text-leaf flex items-center justify-center text-3xl mb-5"
        >
          <FaCheckCircle />
        </motion.div>
        <h1 className="font-display text-2xl text-stone mb-2">Hall Submitted for Approval</h1>
        <p className="text-sm text-stone/55">
          Your new listing has been sent to the Mangala Arangam team and will appear publicly once approved.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">New Listing</p>
        <h1 className="font-display text-3xl text-stone">Add Wedding Hall</h1>
        <p className="text-sm text-stone/50 mt-1">New halls go live after a quick admin review.</p>
      </Reveal>
      {error && (
        <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-4 text-sm text-kumkum">{error}</div>
      )}
      <HallForm onSubmit={handleSubmit} submitLabel="Submit Hall for Approval" />
    </div>
  )
}
