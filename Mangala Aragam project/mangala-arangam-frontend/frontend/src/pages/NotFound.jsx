import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-32 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="font-display text-6xl text-kumkum mb-4"
      >
        404
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <h1 className="font-display text-2xl text-stone mb-3">Page not found</h1>
        <p className="text-sm text-stone/55 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block px-6 py-3 rounded-full bg-kumkum text-ivory font-semibold"
          >
            Back to Home
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}
