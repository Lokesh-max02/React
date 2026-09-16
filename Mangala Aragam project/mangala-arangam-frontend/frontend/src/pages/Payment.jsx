import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShieldAlt, FaCheckCircle, FaCopy } from 'react-icons/fa'
import { getBookingById } from '../services/bookingService'
import { createRazorpayOrder, openRazorpayCheckout, verifyRazorpayPayment } from '../services/razorpayService'
import { extractErrorMessage } from '../services/apiClient'
import StatusBadge from '../components/StatusBadge'
import Reveal from '../components/Reveal'

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null) // { otp, otpValidityMinutes } once payment succeeds
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    getBookingById(bookingId)
      .then((data) => !cancelled && setBooking(data || null))
      .catch(() => !cancelled && setBooking(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-10">
        <div className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-stone mb-3">Booking not found</h1>
        <Link to="/my-bookings" className="text-kumkum font-semibold">Back to My Bookings</Link>
      </div>
    )
  }

  const handlePayNow = async () => {
    setError('')
    setProcessing(true)
    try {
      // Step 1: ask our backend to open a Razorpay order for this booking.
      const order = await createRazorpayOrder(booking.id)

      // Step 2: open Razorpay's real checkout modal — this is where the
      // customer actually picks UPI/GPay/PayTM/card/netbanking themselves.
      const result = await openRazorpayCheckout(order)

      // Step 3: never trust the client — send the gateway's response back to
      // our backend, which verifies the cryptographic signature server-side.
      const verified = await verifyRazorpayPayment({
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      })

      setReceipt(verified)
      setBooking((b) => ({ ...b, paymentStatus: verified.payment.status }))
    } catch (err) {
      // Prefer the backend's actual reason (e.g. "booking not confirmed yet")
      // over Axios's generic "Request failed with status code 400". Plain
      // Error objects thrown by razorpayService (cancel/gateway-load-failed)
      // have no .response, so they fall through to err.message correctly.
      const backendMessage = err?.response ? extractErrorMessage(err, null) : null
      setError(backendMessage || err.message || 'Payment could not be completed.')
    } finally {
      setProcessing(false)
    }
  }

  const copyOtp = () => {
    navigator.clipboard.writeText(receipt.otp)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-xl mx-auto px-5 sm:px-8 py-10">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Secure Payment</p>
        <h1 className="font-display text-3xl text-stone mb-8">Complete Your Payment</h1>
      </Reveal>

      <AnimatePresence mode="wait">
        {receipt ? (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-stone/10 rounded-2xl p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
              className="w-16 h-16 mx-auto rounded-full bg-leaf/10 text-leaf flex items-center justify-center text-3xl mb-4"
            >
              <FaCheckCircle />
            </motion.div>
            <h2 className="font-display text-xl text-stone mb-1">Payment Successful</h2>
            <p className="text-sm text-stone/55 mb-6">
              Show this code to the hall owner in person — they'll enter it to confirm your payment.
            </p>

            <div className="bg-parchment rounded-2xl py-6 mb-4">
              <p className="text-[11px] uppercase tracking-wide text-stone/40 mb-2">Confirmation Code</p>
              <div className="flex items-center justify-center gap-3">
                <p className="font-display text-4xl tracking-[0.3em] text-kumkum">{receipt.otp}</p>
                <button
                  onClick={copyOtp}
                  className="w-9 h-9 rounded-full bg-white border border-stone/15 flex items-center justify-center text-stone/50 hover:text-kumkum transition-colors"
                  aria-label="Copy code"
                >
                  <FaCopy size={13} />
                </button>
              </div>
              {copied && <p className="text-xs text-leaf mt-2">Copied!</p>}
              <p className="text-xs text-stone/40 mt-3">Valid for {receipt.otpValidityMinutes} minutes</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-stone/45 mb-6">
              <FaShieldAlt /> Payment verified securely via Razorpay
            </div>

            <Link to={`/bookings/${booking.id}`}>
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block w-full px-5 py-3 rounded-full bg-kumkum text-ivory font-semibold"
              >
                Back to Booking Details
              </motion.span>
            </Link>
          </motion.div>
        ) : (
          <Reveal delay={0.1}>
            <div className="bg-white border border-stone/10 rounded-2xl p-6">
              <div className="space-y-2.5 text-sm">
                <Row label="Booking ID" value={booking.id} />
                <Row label="Hall" value={booking.hallName} />
                <Row label="Event Date" value={booking.date} />
                <Row label="Payment Status" value={<StatusBadge status={booking.paymentStatus} size="sm" />} />
              </div>

              <div className="kolam-divider my-5" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="font-semibold text-stone">Amount to Pay</span>
                <span className="font-display text-2xl text-kumkum">₹{booking.amount.toLocaleString('en-IN')}</span>
              </div>

              {error && (
                <p className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 mb-4">{error}</p>
              )}

              {booking.paymentStatus === 'AWAITING_OWNER_CONFIRMATION' ? (
                <div className="bg-gold/10 border border-gold/25 rounded-xl px-4 py-3 text-sm text-stone/70">
                  You've already paid — waiting on the hall owner to confirm your code. If you lost it, contact support.
                </div>
              ) : (
                <motion.button
                  onClick={handlePayNow}
                  disabled={processing}
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.97 }}
                  className="w-full py-3.5 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <motion.span
                        className="w-3.5 h-3.5 border-2 border-ivory/40 border-t-ivory rounded-full inline-block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      />
                      Processing…
                    </>
                  ) : (
                    <>Pay ₹{booking.amount.toLocaleString('en-IN')} via UPI / Cards / Netbanking</>
                  )}
                </motion.button>
              )}
              <p className="text-[11px] text-stone/40 mt-3 text-center">
                Powered by Razorpay — supports GPay, PhonePe, PayTM, UPI, cards, and netbanking.
              </p>
            </div>
          </Reveal>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone/50">{label}</span>
      <span className="font-medium text-stone">{value}</span>
    </div>
  )
}
