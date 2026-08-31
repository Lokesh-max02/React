import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHotel, FaCheckCircle, FaClock, FaCalendarCheck, FaWallet, FaBed } from 'react-icons/fa'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import DashboardCard from '../../components/DashboardCard'
import StatusBadge from '../../components/StatusBadge'
import RatingStars from '../../components/RatingStars'
import { getOwnerDashboardStats } from '../../services/index'
import { getOwnerBookings } from '../../services/bookingService'
import { getOwnerReviews } from '../../services/index'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage } from '../../services/apiClient'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getOwnerDashboardStats(), getOwnerBookings(), getOwnerReviews().catch(() => [])])
      .then(([s, b, r]) => {
        if (cancelled) return
        setStats(s)
        setBookings(b)
        setReviews(r)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load your dashboard.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-white border border-stone/10 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-stone/10 animate-pulse" />
          ))}
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

  const recentRequests = bookings.filter((b) => b.status === 'PENDING').slice(0, 3)
  const upcoming = bookings.filter((b) => b.status === 'CONFIRMED').slice(0, 3)
  const recentReviews = reviews.slice(0, 2)

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Owner Panel</p>
        <h1 className="font-display text-3xl text-stone">Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}</h1>
        <p className="text-sm text-stone/50 mt-1">Here's what's happening across your wedding halls.</p>
      </Reveal>

      <RevealGroup className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8" stagger={0.05}>
        <RevealItem><DashboardCard icon={<FaHotel />} label="Total Halls" value={stats.totalHalls} accent="kumkum" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaClock />} label="Pending Requests" value={stats.pendingRequests} accent="gold" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaCheckCircle />} label="Confirmed Bookings" value={stats.confirmedBookings} accent="leaf" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaCalendarCheck />} label="Upcoming Events" value={stats.upcomingEvents} accent="blue" /></RevealItem>
        <RevealItem><DashboardCard icon={<FaWallet />} label="Total Revenue" value={Number(stats.totalRevenue) || 0} prefix="₹" accent="kumkum" /></RevealItem>
      </RevealGroup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-stone">Recent Booking Requests</h2>
            <Link to="/owner/bookings" className="text-xs font-semibold text-kumkum hover:underline">View all →</Link>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-sm text-stone/45">No pending requests right now.</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-stone/10 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-stone">{r.hallName}</p>
                    <p className="text-xs text-stone/45">{r.date}</p>
                  </div>
                  <StatusBadge status={r.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15} className="bg-white border border-stone/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-stone">Upcoming Bookings</h2>
            <Link to="/owner/bookings/confirmed" className="text-xs font-semibold text-kumkum hover:underline">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-stone/45">Nothing confirmed yet.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="flex items-center justify-between border-b border-stone/10 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-stone">{b.hallName}</p>
                    <p className="text-xs text-stone/45">{b.date}</p>
                  </div>
                  <span className="font-display text-sm text-kumkum">₹{b.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.2} className="bg-white border border-stone/10 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-stone">Recent Reviews</h2>
            <Link to="/owner/reviews" className="text-xs font-semibold text-kumkum hover:underline">View all →</Link>
          </div>
          {recentReviews.length === 0 ? (
            <p className="text-sm text-stone/45">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentReviews.map((r) => (
                <div key={r.id} className="bg-parchment rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-stone">{r.customer}</p>
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="text-xs text-stone/45 mb-2">{r.hallName}</p>
                  <p className="text-sm text-stone/65 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  )
}
