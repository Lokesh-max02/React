import { Outlet, NavLink } from 'react-router-dom'
import OwnerSidebar from '../components/OwnerSidebar'

const mobileLinks = [
  { to: '/owner/dashboard', label: 'Dashboard' },
  { to: '/owner/halls', label: 'My Halls' },
  { to: '/owner/bookings', label: 'Requests' },
  { to: '/owner/payments', label: 'Payments' },
  { to: '/owner/revenue', label: 'Revenue' },
  { to: '/owner/reviews', label: 'Reviews' },
  { to: '/owner/profile', label: 'Profile' },
]

export default function OwnerLayout() {
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
        <OwnerSidebar />
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
