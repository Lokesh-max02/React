import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../../components/Reveal'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../services/apiClient'

export default function OwnerRegister() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    ownerName: '', email: '', phone: '', password: '', businessName: '', address: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register({
        fullName: form.ownerName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        businessName: form.businessName,
        address: form.address,
        role: 'ROLE_OWNER',
      })
      navigate('/owner/dashboard')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create your owner account.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-16">
      <Reveal className="text-center mb-8">
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="w-12 h-12 mx-auto rounded-full bg-kumkum flex items-center justify-center text-gold-light font-display text-xl"
        >
          அ
        </motion.span>
        <h1 className="font-display text-3xl text-stone mt-4">List Your Wedding Hall</h1>
        <p className="text-sm text-stone/50 mt-1">Register as a hall owner and start receiving booking requests.</p>
      </Reveal>

      <Reveal delay={0.1}>
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
          <Field label="Owner Name">
            <input required value={form.ownerName} onChange={update('ownerName')} className="input" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email">
              <input required type="email" value={form.email} onChange={update('email')} className="input" />
            </Field>
            <Field label="Phone">
              <input required type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 90000 00000" className="input" />
            </Field>
          </div>
          <Field label="Password">
            <input required type="password" value={form.password} onChange={update('password')} className="input" />
          </Field>
          <Field label="Business Name">
            <input required value={form.businessName} onChange={update('businessName')} placeholder="e.g. Mylapore Mandapam Trust" className="input" />
          </Field>
          <Field label="Address">
            <textarea required value={form.address} onChange={update('address')} rows={2} className="input resize-none" />
          </Field>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.97 }}
            className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating Account…' : 'Create Owner Account'}
          </motion.button>
        </form>
      </Reveal>

      <p className="text-center text-sm text-stone/55 mt-6">
        Already list with us? <Link to="/login" className="text-kumkum font-semibold">Log in</Link>
      </p>
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
