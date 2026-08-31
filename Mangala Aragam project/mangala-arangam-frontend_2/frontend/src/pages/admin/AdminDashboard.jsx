import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaUserTie, FaHotel, FaClock, FaClipboardList, FaCheckCircle, FaExclamationCircle, FaWallet } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import DashboardCard from '../../components/DashboardCard'
import StatusBadge from '../../components/StatusBadge'
import RatingStars from '../../components/RatingStars'
import { getAdminDashboardStats, getAllHallsAdmin, getComplaintsAdmin } from '../../services/index'
import { normalizeHall } from '../../services/hallService'
import { extractErrorMessage } from '../../services/apiClient'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [pendingHalls, setPendingHalls] = useState([])
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getAdminDashboardStats(), getAllHallsAdmin(), getComplaintsAdmin()])
      .then(([s, halls, complaints]) => {
        if (cancelled) return
        setStats(s)
        setPendingHalls(halls.map(normalizeHall).filter((h) => h.approvalStatus === 'PENDING').slice(0, 3))
        setRecentComplaints(complaints.filter((c) => c.status === 'OPEN').slice(0, 3))
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load the admin dashboard.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-stone/10 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => <div key={i} className="h-56 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}
        </div>
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

      <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" stagger={0.05}>
        <RevealItem><DashboardCard icon={<FaUsers />} label="Total Customers" value={stats.totalCustomers} accent="kumkum" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaUserTie />} label="Total Owners" value={stats.totalOwners} accent="gold" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaHotel />} label="Total Halls" value={stats.totalHalls} accent="leaf" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaClock />} label="Pending Approvals" value={stats.pendingHallApprovals} accent="gold" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaClipboardList />} label="Total Bookings" value={stats.totalBookings} accent="blue" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaCheckCircle />} label="Confirmed Bookings" value={stats.confirmedBookings} accent="leaf" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaExclamationCircle />} label="Open Complaints" value={stats.openComplaints} accent="kumkum" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaWallet />} label="Total Revenue" value={Number(stats.totalRevenue) || 0} prefix="₹" accent="kumkum" /></RevealItem>
      </RevealGroup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-stone">Halls Awaiting Approval</h2>
            <Link to="/admin/halls" className="text-xs font-semibold text-kumkum hover:underline">View all →</Link>
          </div>
          {pendingHalls.length === 0 ? (
            <p className="text-sm text-stone/45">Nothing pending review right now.</p>
          ) : (
            <div className="space-y-3">
              {pendingHalls.map((h) => (
                <div key={h.id} className="flex items-center justify-between border-b border-stone/10 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-parchment">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone truncate">{h.name}</p>
                      <p className="text-xs text-stone/45 truncate">{h.location}</p>
                    </div>
                  </div>
                  <RatingStars rating={h.rating} />
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15} className="bg-white border border-stone/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-stone">Open Complaints</h2>
            <Link to="/admin/complaints" className="text-xs font-semibold text-kumkum hover:underline">View all →</Link>
          </div>
          {recentComplaints.length === 0 ? (
            <p className="text-sm text-stone/45">No open complaints. Nice.</p>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-stone/10 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone truncate">{c.customerName}</p>
                    <p className="text-xs text-stone/45 truncate">{c.type?.replace('_', ' ')}</p>
                  </div>
                  <StatusBadge status={c.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  )
}
