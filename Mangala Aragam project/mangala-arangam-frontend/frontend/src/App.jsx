import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Halls from './pages/Halls'
import HallDetails from './pages/HallDetails'
import Booking from './pages/Booking'
import BookingConfirmation from './pages/BookingConfirmation'
import Payment from './pages/Payment'
import MyBookings from './pages/MyBookings'
import BookingDetails from './pages/BookingDetails'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import ComingSoon from './pages/ComingSoon'
import OwnerLayout from './layouts/OwnerLayout'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import MyHalls from './pages/owner/MyHalls'
import AddHall from './pages/owner/AddHall'
import EditHall from './pages/owner/EditHall'
import HallAvailabilityManage from './pages/owner/HallAvailabilityManage'
import HallStatusManage from './pages/owner/HallStatusManage'
import BookingRequests from './pages/owner/BookingRequests'
import ConfirmedBookings from './pages/owner/ConfirmedBookings'
import CancelledBookings from './pages/owner/CancelledBookings'
import PaymentManagement from './pages/owner/PaymentManagement'
import RevenueDashboard from './pages/owner/RevenueDashboard'
import OwnerReviews from './pages/owner/OwnerReviews'
import OwnerProfile from './pages/owner/OwnerProfile'
import OwnerRegister from './pages/owner/OwnerRegister'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCustomers from './pages/admin/ManageCustomers'
import ManageOwners from './pages/admin/ManageOwners'
import ManageHalls from './pages/admin/ManageHalls'
import ManageBookings from './pages/admin/ManageBookings'
import Complaints from './pages/admin/Complaints'

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/halls" element={<PageTransition><Halls /></PageTransition>} />
            <Route path="/halls/:id" element={<PageTransition><HallDetails /></PageTransition>} />
            <Route path="/book/:hallId" element={<PageTransition><ProtectedRoute roles={['ROLE_CUSTOMER']}><Booking /></ProtectedRoute></PageTransition>} />
            <Route path="/booking-success" element={<PageTransition><BookingConfirmation /></PageTransition>} />
            <Route path="/payment/:bookingId" element={<PageTransition><ProtectedRoute roles={['ROLE_CUSTOMER']}><Payment /></ProtectedRoute></PageTransition>} />
            <Route path="/my-bookings" element={<PageTransition><ProtectedRoute roles={['ROLE_CUSTOMER']}><MyBookings /></ProtectedRoute></PageTransition>} />
            <Route path="/bookings/:id" element={<PageTransition><ProtectedRoute roles={['ROLE_CUSTOMER']}><BookingDetails /></ProtectedRoute></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><ProtectedRoute roles={['ROLE_CUSTOMER']}><Wishlist /></ProtectedRoute></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProtectedRoute><Profile /></ProtectedRoute></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

            {/* Hall Owner Dashboard */}
            <Route path="/owner/register" element={<PageTransition><OwnerRegister /></PageTransition>} />
            <Route path="/owner" element={<PageTransition><ProtectedRoute roles={['ROLE_OWNER']}><OwnerLayout /></ProtectedRoute></PageTransition>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="halls" element={<MyHalls />} />
              <Route path="halls/add" element={<AddHall />} />
              <Route path="halls/:id/edit" element={<EditHall />} />
              <Route path="halls/:id/availability" element={<HallAvailabilityManage />} />
              <Route path="halls/:id/status" element={<HallStatusManage />} />
              <Route path="bookings" element={<BookingRequests />} />
              <Route path="bookings/confirmed" element={<ConfirmedBookings />} />
              <Route path="bookings/cancelled" element={<CancelledBookings />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="revenue" element={<RevenueDashboard />} />
              <Route path="reviews" element={<OwnerReviews />} />
              <Route path="profile" element={<OwnerProfile />} />
            </Route>

            {/* Admin Panel */}
            <Route path="/admin" element={<PageTransition><ProtectedRoute roles={['ROLE_ADMIN']}><AdminLayout /></ProtectedRoute></PageTransition>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="customers" element={<ManageCustomers />} />
              <Route path="owners" element={<ManageOwners />} />
              <Route path="halls" element={<ManageHalls />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="complaints" element={<Complaints />} />
            </Route>

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
