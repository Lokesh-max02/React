import { motion } from 'framer-motion'
import RatingStars from './RatingStars'

export default function ReviewCard({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="border-b border-stone/10 py-5 last:border-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blush text-kumkum font-display flex items-center justify-center text-sm">
            {review.customer.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold text-stone">{review.customer}</p>
            <p className="text-[11px] text-stone/40">{review.date}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="text-sm text-stone/65 leading-relaxed mt-3">{review.text}</p>
    </motion.div>
  )
}
