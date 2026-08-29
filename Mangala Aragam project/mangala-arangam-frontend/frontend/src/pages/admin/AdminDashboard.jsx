import { useEffect, useState } from 'react'
import { FaUsers, FaUserTie, FaHotel, FaClock, FaClipboardList, FaCheckCircle, FaExclamationCircle, FaWallet } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import DashboardCard from '../../components/DashboardCard'
import { getAdminDashboardStats } from '../../services/index'
import { extractErrorMessage } from '../../services/apiClient'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getAdminDashboardStats()
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load the admin dashboard.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white border border-stone/10 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
        <p className="font-display text-xl text-kumkum mb-2">Couldn't load dashboard</p>
        <p className="text-sm text-stone/50">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Admin Panel</p>
        <h1 className="font-display text-3xl text-stone">Platform Overview</h1>
        <p className="text-sm text-stone/50 mt-1">Everything happening across Mangala Arangam right now.</p>
      </Reveal>

      <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.05}>
        <RevealItem><DashboardCard icon={<FaUsers />} label="Total Customers" value={stats.totalCustomers} accent="kumkum" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaUserTie />} label="Total Owners" value={stats.totalOwners} accent="gold" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaHotel />} label="Total Halls" value={stats.totalHalls} accent="leaf" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaClock />} label="Pending Approvals" value={stats.pendingHallApprovals} accent="gold" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaClipboardList />} label="Total Bookings" value={stats.totalBookings} accent="blue" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaCheckCircle />} label="Confirmed Bookings" value={stats.confirmedBookings} accent="leaf" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaExclamationCircle />} label="Open Complaints" value={stats.openComplaints} accent="kumkum" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaWallet />} label="Total Revenue" value={Number(stats.totalRevenue) || 0} prefix="₹" accent="kumkum" /></RevealItem>
      </RevealGroup>
    </div>
  )
}
