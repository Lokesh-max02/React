import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'
import Reveal from '../components/Reveal'
import OtpInput from '../components/OtpInput'
import { sendPasswordResetOtp, resetPassword } from '../services/otpService'
import { extractErrorMessage } from '../services/apiClient'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'otp' | 'done'
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await sendPasswordResetOtp(email)
      setStep('otp')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not send a reset code.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    try {
      await sendPasswordResetOtp(email)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not resend the code.'))
    }
  }

  const handleOtpComplete = (code) => {
    setOtpCode(code)
    setError('')
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit code sent to your email.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(email, otpCode, newPassword)
      setStep('done')
      setTimeout(() => navigate('/login'), 2200)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not reset your password.'))
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
          {step === 'email' ? 'Reset Your Password' : step === 'otp' ? 'Check Your Email' : 'Password Reset!'}
        </h1>
        <p className="text-sm text-stone/50 mt-1">
          {step === 'email' && "Enter your account email and we'll send you a reset code."}
          {step === 'otp' && <>Enter the 6-digit code sent to <strong className="text-stone/70">{email}</strong>, then set a new password.</>}
          {step === 'done' && 'Redirecting you to log in…'}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOtp}
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

              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">Email</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              </label>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60"
              >
                {submitting ? 'Sending Code…' : 'Send Reset Code'}
              </motion.button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetSubmit}
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

              <div className="space-y-5 mt-6">
                <label className="block">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">New Password</span>
                  <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">Confirm New Password</span>
                  <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" />
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="w-full py-3 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60 mt-6"
              >
                {submitting ? 'Resetting…' : 'Reset Password'}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-xs text-stone/40 mt-4 hover:text-kumkum transition-colors"
              >
                ← Use a different email
              </button>
            </motion.form>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
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
              <p className="font-display text-lg text-stone">Your password has been reset.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      {step !== 'done' && (
        <p className="text-center text-sm text-stone/55 mt-6">
          Remembered it? <Link to="/login" className="text-kumkum font-semibold">Back to log in</Link>
        </p>
      )}
    </div>
  )
}
