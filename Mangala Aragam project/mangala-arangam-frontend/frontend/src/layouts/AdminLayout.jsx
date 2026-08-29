import { Outlet, NavLink } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const mobileLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/owners', label: 'Owners' },
  { to: '/admin/halls', label: 'Halls' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/complaints', label: 'Complaints' },
]

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="lg:hidden flex gap-2 overflow-x-auto mb-6 pb-1">
        {mobileLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                isActive ? 'bg-kumkum text-ivory border-kumkum' : 'border-stone/15 text-stone/60'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="flex gap-8 items-start">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
