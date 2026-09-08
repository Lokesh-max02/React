import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaThLarge, FaUsers, FaUserTie, FaHotel, FaClipboardList, FaExclamationCircle, FaUserCircle } from 'react-icons/fa'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
  { to: '/admin/customers', label: 'Customers', icon: <FaUsers /> },
  { to: '/admin/owners', label: 'Hall Owners', icon: <FaUserTie /> },
  { to: '/admin/halls', label: 'Wedding Halls', icon: <FaHotel /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <FaClipboardList /> },
  { to: '/admin/complaints', label: 'Complaints', icon: <FaExclamationCircle /> },
  { to: '/admin/profile', label: 'Profile', icon: <FaUserCircle /> },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-white border border-stone/10 rounded-2xl p-3">
        <div className="px-3 py-3 mb-1">
          <p className="text-[11px] uppercase tracking-wide text-stone/40 font-semibold">Admin Panel</p>
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
                      layoutId="admin-sidebar-active"
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
