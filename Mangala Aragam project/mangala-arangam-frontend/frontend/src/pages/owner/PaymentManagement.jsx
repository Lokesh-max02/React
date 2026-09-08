import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaKey, FaCheck } from 'react-icons/fa'
import Reveal from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getPayments } from '../../services/index'
import { confirmPaymentOtp } from '../../services/razorpayService'
import { extractErrorMessage } from '../../services/apiClient'

export default function PaymentManagement() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [otpValue, setOtpValue] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState('')

  const load = () => {
    setLoading(true)
    getPayments()
      .then(setPayments)
      .catch((err) => setError(extractErrorMessage(err, 'Could not load payments.')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openConfirm = (id) => {
    setActiveId(id)
    setOtpValue('')
    setConfirmError('')
  }

  const handleConfirm = async (paymentId) => {
    if (otpValue.length !== 6) {
      setConfirmError('Enter the 6-digit code the customer showed you.')
      return
    }
    setConfirming(true)
    setConfirmError('')
    try {
      const updated = await confirmPaymentOtp(paymentId, otpValue)
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? updated : p)))
      setActiveId(null)
    } catch (err) {
      setConfirmError(extractErrorMessage(err, 'Incorrect or expired code.'))
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Finance</p>
        <h1 className="font-display text-3xl text-stone">Payment Management</h1>
      </Reveal>

      {error && (
        <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>
      )}

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-stone/5 animate-pulse" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg text-stone">No payments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-stone/40 border-b border-stone/10">
                  <th className="px-5 py-3 font-semibold">Booking ID</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Hall</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <motion.tbody initial="hidden" animate="show" transition={{ staggerChildren: 0.05 }}>
                {payments.map((p) => (
                  <motion.tr
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    className="border-b border-stone/5 last:border-0 hover:bg-parchment/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-stone">{p.bookingId}</td>
                    <td className="px-5 py-3.5 text-stone/70">{p.customerName}</td>
                    <td className="px-5 py-3.5 text-stone/70">{p.hallName}</td>
                    <td className="px-5 py-3.5 font-display text-kumkum">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-stone/60">{p.paidAt ? p.paidAt.slice(0, 10) : '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="px-5 py-3.5 text-right relative">
                      {p.status === 'AWAITING_OWNER_CONFIRMATION' && (
                        <motion.button
                          onClick={() => openConfirm(p.id)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-kumkum text-ivory text-xs font-semibold"
                        >
                          <FaKey size={10} /> Enter Code
                        </motion.button>
                      )}

                      <AnimatePresence>
                        {activeId === p.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.95 }}
                            className="absolute z-20 top-full mt-2 right-0 bg-white rounded-xl border border-stone/10 shadow-soft p-4 w-64 text-left"
                          >
                            <p className="text-xs font-semibold text-stone mb-2">Enter customer's confirmation code</p>
                            <input
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="6-digit code"
                              maxLength={6}
                              inputMode="numeric"
                              className="w-full text-center text-lg font-display tracking-[0.3em] rounded-lg border border-stone/15 px-3 py-2 outline-none focus-visible:border-kumkum mb-2"
                            />
                            {confirmError && <p className="text-xs text-kumkum mb-2">{confirmError}</p>}
                            <div className="flex gap-2">
                              <button
                                onClick={() => setActiveId(null)}
                                className="flex-1 px-3 py-1.5 rounded-full border border-stone/15 text-stone/60 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                              <motion.button
                                onClick={() => handleConfirm(p.id)}
                                disabled={confirming}
                                whileHover={{ scale: confirming ? 1 : 1.03 }}
                                whileTap={{ scale: confirming ? 1 : 0.97 }}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-leaf text-ivory text-xs font-semibold disabled:opacity-50"
                              >
                                <FaCheck size={10} /> {confirming ? '…' : 'Confirm'}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </Reveal>
    </div>
  )
}
