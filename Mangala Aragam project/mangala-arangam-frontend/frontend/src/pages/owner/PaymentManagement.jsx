import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from '../../components/Reveal'
import StatusBadge from '../../components/StatusBadge'
import { getPayments } from '../../services/index'
import { extractErrorMessage } from '../../services/apiClient'

export default function PaymentManagement() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getPayments()
      .then((data) => !cancelled && setPayments(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load payments.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

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
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <motion.tbody initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.05 }}>
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
                    <td className="px-5 py-3.5 text-stone/60">{p.method || '—'}</td>
                    <td className="px-5 py-3.5 text-stone/60">{p.paidAt ? p.paidAt.slice(0, 10) : '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} size="sm" /></td>
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
