import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/Reveal'
import { getHallById } from '../services/hallService'
import { createBooking } from '../services/bookingService'
import { extractErrorMessage } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const EVENT_TYPES = ['Wedding Ceremony', 'Engagement', 'Reception', 'Muhurtham', 'Other']

export default function Booking() {
  const { hallId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [hall, setHall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    date: searchParams.get('date') || '',
    eventType: EVENT_TYPES[0],
    guests: '',
    name: user?.fullName || '',
    phone: '',
    email: user?.email || '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    getHallById(hallId)
      .then((data) => !cancelled && setHall(data))
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [hallId])

  if (loading) {
    return <div className="max-w-5xl mx-auto px-5 py-24"><div className="h-64 rounded-2xl bg-white border border-stone/10 animate-pulse" /></div>
  }

  if (notFound || !hall) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-stone mb-3">Hall not found</h1>
        <Link to="/halls" className="text-kumkum font-semibold">Back to all halls</Link>
      </div>
    )
  }

  const estimatedExtra = form.guests && Number(form.guests) > hall.capacity ? 15000 : 0
  const estimatedTotal = hall.price + estimatedExtra

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Matches backend BookingRequest exactly: hallId, eventDate, eventType,
      // guests, contactName, contactPhone, contactEmail, additionalRequirements.
      const booking = await createBooking({
        hallId: hall.id,
        eventDate: form.date,
        eventType: form.eventType,
        guests: Number(form.guests),
        contactName: form.name,
        contactPhone: form.phone,
        contactEmail: form.email,
        additionalRequirements: form.notes,
      })

      navigate(
        `/booking-success?bookingId=${booking.id}&hallId=${hall.id}&date=${booking.eventDate}` +
        `&guests=${booking.guests}&name=${encodeURIComponent(booking.contactName)}&total=${booking.totalAmount}`
      )
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send your booking request. That date may no longer be available.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Booking Request</p>
      <h1 className="font-display text-3xl text-stone mb-8">Book {hall.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <Reveal direction="left">
        <form onSubmit={handleSubmit} className="bg-white border border-stone/10 rounded-2xl p-6 space-y-5">
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 overflow-hidden"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Event Date">
              <input required type="date" value={form.date} onChange={update('date')} className="input" />
            </Field>
            <Field label="Event Type">
              <select required value={form.eventType} onChange={update('eventType')} className="input">
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Number of Guests">
            <input required type="number" min="1" value={form.guests} onChange={update('guests')} placeholder={`Up to ${hall.capacity}`} className="input" />
          </Field>

          <div className="kolam-divider" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Your Name">
              <input required value={form.name} onChange={update('name')} className="input" />
            </Field>
            <Field label="Phone">
              <input required type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 90000 00000" className="input" />
            </Field>
          </div>
          <Field label="Email">
            <input required type="email" value={form.email} onChange={update('email')} className="input" />
          </Field>
          <Field label="Additional Requirements">
            <textarea
              value={form.notes}
              onChange={update('notes')}
              rows={3}
              placeholder="Catering preferences, decoration theme, arrival time…"
              className="input resize-none"
            />
          </Field>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.97 }}
            className="w-full py-3.5 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60"
          >
            {submitting ? 'Sending Request…' : 'Send Booking Request'}
          </motion.button>
        </form>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
        <aside className="h-fit sticky top-24 bg-white border border-stone/10 rounded-2xl p-6">
          <div className="arch-frame h-32 mb-4">
            <img src={hall.image} alt={hall.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="font-display text-lg text-stone mb-1">{hall.name}</h3>
          <p className="text-xs text-stone/50 mb-4">{hall.location}</p>

          <div className="kolam-divider mb-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-stone/60">
              <span>Hall Price</span>
              <span>₹{hall.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone/60">
              <span>Additional Charges (est.)</span>
              <span>{estimatedExtra ? `₹${estimatedExtra.toLocaleString('en-IN')}` : '—'}</span>
            </div>
          </div>

          <div className="kolam-divider my-4" />

          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-stone">Estimated Total</span>
            <span className="font-display text-xl text-kumkum">₹{estimatedTotal.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-stone/40 mt-3">
            The final amount is confirmed by the server. This sends a request only — you'll pay once the owner confirms your date.
          </p>
        </aside>
        </Reveal>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">{label}</span>
      {children}
    </label>
  )
}
