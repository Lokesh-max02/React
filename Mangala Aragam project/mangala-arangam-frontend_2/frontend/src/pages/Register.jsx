import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import Reveal from '../components/Reveal'
import OtpInput from '../components/OtpInput'
import { useAuth } from '../context/AuthContext'
import { extractErrorMessage } from '../services/apiClient'
import { sendOtp, verifyOtp } from '../services/otpService'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState('details') // 'details' | 'otp' | 'verified'
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', address: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await sendOtp(form.email)
      setStep('otp')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send a verification code.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    try {
      await sendOtp(form.email)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not resend the code.'))
    }
  }

  const handleOtpComplete = async (code) => {
    setError('')
    setSubmitting(true)
    try {
      await verifyOtp(form.email, code)
      setStep('verified')
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
        role: 'ROLE_CUSTOMER',
      })
      navigate('/')
    } catch (err) {
      setError(extractErrorMessage(err, 'Verification failed.'))
      setStep('otp')
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
        <h1 className="font-display text-3xl text-stone mt-4">
          {step === 'details' ? 'Create Your Account' : step === 'otp' ? 'Verify Your Email' : 'Verified!'}
        </h1>
        <p className="text-sm text-stone/50 mt-1">
          {step === 'details' && 'Start comparing and booking wedding halls.'}
          {step === 'otp' && <>We sent a 6-digit code to <strong className="text-stone/70">{form.email}</strong></>}
          {step === 'verified' && 'Creating your account…'}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.form
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleDetailsSubmit}
              className="bg-white border border-stone/10 rounded-2xl p-6 space-y-5"
            >
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

              <Field label="Full Name">
                <input required value={form.fullName} onChange={update('fullName')} className="input" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Email">
                  <input required type="email" value={form.email} onChange={update('email')} className="input" />
                </Field>
                <Field label="Phone Number">
                  <input required type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 90000 00000" className="input" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Password">
                  <input required type="password" value={form.password} onChange={update('password')} className="input" />
                </Field>
                <Field label="Confirm Password">
                  <input required type="password" value={form.confirmPassword} onChange={update('confirmPassword')} className="input" />
                </Field>
              </div>
              <Field label="Address">
                <textarea value={form.address} onChange={update('address')} rows={2} className="input resize-none" />
              </Field>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60"
              >
                {submitting ? 'Sending Code…' : 'Send Verification Code'}
              </motion.button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-stone/10 rounded-2xl p-6"
            >
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 mb-5 overflow-hidden"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <OtpInput onComplete={handleOtpComplete} onResend={handleResend} />

              {submitting && (
                <p className="text-center text-sm text-stone/50 mt-4">Verifying…</p>
              )}

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full text-center text-xs text-stone/40 mt-5 hover:text-kumkum transition-colors"
              >
                ← Edit details
              </button>
            </motion.div>
          )}

          {step === 'verified' && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-stone/10 rounded-2xl p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                className="w-14 h-14 mx-auto rounded-full bg-leaf/10 text-leaf flex items-center justify-center text-2xl mb-4"
              >
                <FaCheckCircle />
              </motion.div>
              <p className="font-display text-lg text-stone">Email verified — welcome aboard!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      {step === 'details' && (
        <p className="text-center text-sm text-stone/55 mt-6">
          Already have an account? <Link to="/login" className="text-kumkum font-semibold">Log in</Link>
        </p>
      )}
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
