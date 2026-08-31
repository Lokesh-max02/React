import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { FaHeart, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const DASHBOARD_LINK = {
  ROLE_OWNER: '/owner/dashboard',
  ROLE_ADMIN: '/admin/dashboard',
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/halls', label: 'Wedding Halls' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  useEffect(() => {
    setOpen(false)
  }, [])

  return (
    <motion.header
      initial={false}
      animate={{
        paddingTop: scrolled ? 8 : 16,
        paddingBottom: scrolled ? 8 : 16,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ivory/85 backdrop-blur-lg shadow-[0_1px_0_rgba(42,33,28,0.08)]' : 'bg-ivory/40 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
            className="w-9 h-9 rounded-full bg-kumkum flex items-center justify-center text-gold-light font-display text-lg"
          >
            அ
          </motion.span>
          <span className="font-display text-xl sm:text-2xl text-kumkum tracking-tight">
            Mangala Arangam
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="relative group">
              {({ isActive }) => (
                <span className={`transition-colors ${isActive ? 'text-kumkum' : 'text-stone/70 group-hover:text-kumkum'}`}>
                  {l.label}
                  <span
                    className={`absolute left-0 -bottom-1.5 h-[1.5px] bg-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="w-10 h-10 rounded-full border border-stone/15 flex items-center justify-center text-stone/60 hover:text-kumkum hover:border-kumkum/40 hover:scale-105 active:scale-95 transition-all"
          >
            <FaHeart size={14} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={DASHBOARD_LINK[user.role] || '/profile'}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-stone/80 hover:text-kumkum transition-colors"
              >
                <FaUserCircle size={16} />
                {user.fullName?.split(' ')[0]}
              </Link>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone/15 text-sm font-semibold text-stone/70 hover:border-kumkum hover:text-kumkum transition-colors"
              >
                <FaSignOutAlt size={13} /> Log out
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-stone/80 hover:text-kumkum transition-colors"
              >
                Log in
              </Link>
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block px-5 py-2.5 rounded-full bg-kumkum text-ivory text-sm font-semibold shadow-card"
                >
                  Register
                </motion.span>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-stone p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <FaTimes size={20} />
              </motion.span>
            ) : (
              <motion.span key="bars" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <FaBars size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-stone/10 bg-ivory"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-stone/80 font-medium">
                  {l.label}
                </NavLink>
              ))}
              <div className="kolam-divider" />
              <Link to="/wishlist" onClick={() => setOpen(false)} className="text-stone/80 font-medium">
                Wishlist
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to={DASHBOARD_LINK[user.role] || '/profile'}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-stone/80 font-medium"
                  >
                    <FaUserCircle size={16} /> {user.fullName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone/15 text-stone/70 text-sm font-semibold text-center justify-center"
                  >
                    <FaSignOutAlt size={13} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-stone/80 font-medium">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-kumkum text-ivory text-sm font-semibold text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
