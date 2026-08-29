import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-kumkum-dark text-ivory/80 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-kumkum-dark font-display text-lg">
              அ
            </span>
            <span className="font-display text-xl text-ivory">Mangala Arangam</span>
          </div>
          <p className="text-sm leading-relaxed text-ivory/60">
            Finding and booking the right mandapam for your wedding day, from Mylapore to Anna Nagar.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-light mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li><Link to="/halls" className="hover:text-gold-light">Wedding Halls</Link></li>
            <li><Link to="/about" className="hover:text-gold-light">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold-light">Contact</Link></li>
            <li><Link to="/owner/dashboard" className="hover:text-gold-light">List Your Hall</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-light mb-4">For Customers</h4>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li><Link to="/my-bookings" className="hover:text-gold-light">My Bookings</Link></li>
            <li><Link to="/wishlist" className="hover:text-gold-light">Wishlist</Link></li>
            <li><Link to="/profile" className="hover:text-gold-light">My Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-light mb-4">Reach Us</h4>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li>Chennai, Tamil Nadu</li>
            <li>hello@mangalaarangam.in</li>
            <li>+91 90000 12345</li>
          </ul>
          <div className="flex gap-3 mt-4">
            {[FaInstagram, FaFacebookF, FaYoutube].map((Icon, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold-light hover:text-gold-light transition-colors"
              >
                <Icon size={14} />
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} Mangala Arangam. All rights reserved.
      </div>
    </footer>
  )
}
