import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ComingSoon({ title = 'Coming Soon' }) {
  return (
    <div className="max-w-lg mx-auto px-5 py-32 text-center">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-3"
      >
        Under Construction
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-display text-3xl text-stone mb-3"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-sm text-stone/55 mb-8"
      >
        This part of Mangala Arangam (the hall owner and admin dashboards) is built in the next pass.
        This one covers the customer booking journey end to end.
      </motion.p>
      <Link to="/">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="inline-block px-6 py-3 rounded-full bg-kumkum text-ivory font-semibold"
        >
          Back to Home
        </motion.span>
      </Link>
    </div>
  )
}
