import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../services/apiClient'

const ROLE_REDIRECT = {
  ROLE_OWNER: '/owner/dashboard',
  ROLE_ADMIN: '/admin/dashboard',
  ROLE_CUSTOMER: '/',
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form.email, form.password)
      const from = location.state?.from
      navigate(from || ROLE_REDIRECT[user.role] || '/')
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid email or password.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <Reveal className="text-center mb-8">
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="w-12 h-12 mx-auto rounded-full bg-kumkum flex items-center justify-center text-gold-light font-display text-xl"
        >
          அ
        </motion.span>
        <h1 className="font-display text-3xl text-stone mt-4">Welcome Back</h1>
        <p className="text-sm text-stone/50 mt-1">Log in to manage your bookings.</p>
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

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">Email</span>
            <input required type="email" value={form.email} onChange={update('email')} className="input" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">Password</span>
            <input required type="password" value={form.password} onChange={update('password')} className="input" />
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-stone/60">
              <input type="checkbox" checked={form.remember} onChange={update('remember')} className="accent-kumkum" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-kumkum font-semibold">Forgot password?</Link>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.97 }}
            className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </motion.button>
        </form>
      </Reveal>

      <p className="text-center text-sm text-stone/55 mt-6">
        Don't have an account? <Link to="/register" className="text-kumkum font-semibold">Register</Link>
      </p>
      <p className="text-center text-xs text-stone/40 mt-2">
        Own a wedding hall? <Link to="/owner/register" className="text-kumkum font-semibold">Register as an owner</Link>
      </p>
    </div>
  )
}
