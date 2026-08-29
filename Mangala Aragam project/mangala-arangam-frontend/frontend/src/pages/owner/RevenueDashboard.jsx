import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaWallet, FaCheckCircle, FaClock, FaChartLine } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import DashboardCard from '../../components/DashboardCard'
import { getOwnerDashboardStats, getPayments } from '../../services/index'
import { extractErrorMessage } from '../../services/apiClient'

function lastSixMonthsLabels() {
  const labels = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-IN', { month: 'short' }) })
  }
  return labels
}

export default function RevenueDashboard() {
  const [stats, setStats] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getOwnerDashboardStats(), getPayments()])
      .then(([s, p]) => {
        if (cancelled) return
        setStats(s)
        setPayments(p)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load revenue data.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const monthly = useMemo(() => {
    const labels = lastSixMonthsLabels()
    const byMonth = Object.fromEntries(labels.map((l) => [l.key, 0]))
    payments
      .filter((p) => p.status === 'PAID' && p.paidAt)
      .forEach((p) => {
        const key = p.paidAt.slice(0, 7)
        if (key in byMonth) byMonth[key] += Number(p.amount)
      })
    return labels.map((l) => ({ month: l.label, revenue: byMonth[l.key] }))
  }, [payments])

  const paidAmount = payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0)
  const pendingAmount = payments.filter((p) => p.status === 'PENDING').reduce((s, p) => s + Number(p.amount), 0)
  const maxRevenue = Math.max(...monthly.map((m) => m.revenue), 1)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}
        </div>
        <div className="h-64 rounded-2xl bg-white border border-stone/10 animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
        <p className="font-display text-xl text-kumkum mb-2">Couldn't load revenue</p>
        <p className="text-sm text-stone/50">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Finance</p>
        <h1 className="font-display text-3xl text-stone">Revenue Dashboard</h1>
      </Reveal>

      <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" stagger={0.06}>
        <RevealItem><DashboardCard icon={<FaWallet />} label="Total Revenue" value={Number(stats.totalRevenue) || 0} prefix="₹" accent="kumkum" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaChartLine />} label="Confirmed Bookings" value={stats.confirmedBookings} accent="gold" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaCheckCircle />} label="Paid Amount" value={paidAmount} prefix="₹" accent="leaf" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaClock />} label="Pending Amount" value={pendingAmount} prefix="₹" accent="blue" /></RevealItem>
      </RevealGroup>

      <Reveal delay={0.15} className="bg-white border border-stone/10 rounded-2xl p-6">
        <h2 className="font-display text-lg text-stone mb-6">Monthly Revenue (Paid)</h2>
        <div className="flex items-end justify-between gap-3 h-52">
          {monthly.map((m, i) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-semibold text-stone/50">
                {m.revenue > 0 ? `₹${Math.round(m.revenue / 1000)}k` : '—'}
              </span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-lg bg-gradient-to-t from-kumkum to-kumkum-light min-h-[4px]"
              />
              <span className="text-xs font-semibold text-stone/60">{m.month}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
