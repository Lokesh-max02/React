import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaThLarge,
  FaHotel,
  FaPlusCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaChartLine,
  FaStar,
  FaUserCircle,
} from 'react-icons/fa'

const links = [
  { to: '/owner/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
  { to: '/owner/halls', label: 'My Halls', icon: <FaHotel /> },
  { to: '/owner/halls/add', label: 'Add Hall', icon: <FaPlusCircle /> },
  { to: '/owner/bookings', label: 'Booking Requests', icon: <FaClipboardList /> },
  { to: '/owner/bookings/confirmed', label: 'Confirmed Bookings', icon: <FaCheckCircle /> },
  { to: '/owner/bookings/cancelled', label: 'Cancelled Bookings', icon: <FaTimesCircle /> },
  { to: '/owner/payments', label: 'Payments', icon: <FaMoneyBillWave /> },
  { to: '/owner/revenue', label: 'Revenue', icon: <FaChartLine /> },
  { to: '/owner/reviews', label: 'Reviews', icon: <FaStar /> },
  { to: '/owner/profile', label: 'Profile', icon: <FaUserCircle /> },
]

export default function OwnerSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-white border border-stone/10 rounded-2xl p-3">
        <div className="px-3 py-3 mb-1">
          <p className="text-[11px] uppercase tracking-wide text-stone/40 font-semibold">Owner Panel</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className="relative">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'text-kumkum' : 'text-stone/60 hover:text-stone'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="owner-sidebar-active"
                      className="absolute inset-0 bg-kumkum/8 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 text-base">{l.icon}</span>
                  <span className="relative z-10">{l.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
