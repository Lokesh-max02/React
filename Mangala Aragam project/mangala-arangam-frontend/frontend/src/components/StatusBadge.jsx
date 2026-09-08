import { motion } from 'framer-motion'

const STATUS_STYLES = {
  AVAILABLE: { label: 'Available', className: 'bg-leaf/10 text-leaf border-leaf/30' },
  BOOKING_PENDING: { label: 'Booking Pending', className: 'bg-gold/10 text-gold-dark border-gold/40' },
  BOOKED: { label: 'Booked', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNAVAILABLE: { label: 'Unavailable', className: 'bg-kumkum/10 text-kumkum border-kumkum/30' },
  MAINTENANCE: { label: 'Maintenance', className: 'bg-stone/10 text-stone/70 border-stone/20' },
  PENDING: { label: 'Pending', className: 'bg-gold/10 text-gold-dark border-gold/40' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-leaf/10 text-leaf border-leaf/30' },
  COMPLETED: { label: 'Completed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-kumkum/10 text-kumkum border-kumkum/30' },
  REJECTED: { label: 'Rejected', className: 'bg-kumkum/10 text-kumkum border-kumkum/30' },
  PAID: { label: 'Paid', className: 'bg-leaf/10 text-leaf border-leaf/30' },
  AWAITING_OWNER_CONFIRMATION: { label: 'Awaiting Confirmation', className: 'bg-gold/10 text-gold-dark border-gold/40' },
  FAILED: { label: 'Failed', className: 'bg-kumkum/10 text-kumkum border-kumkum/30' },
  REFUNDED: { label: 'Refunded', className: 'bg-stone/10 text-stone/70 border-stone/20' },
}

export default function StatusBadge({ status, size = 'md' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.AVAILABLE
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  const pulses = ['AVAILABLE', 'CONFIRMED', 'PAID'].includes(status)
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-body font-semibold uppercase tracking-wide ${sizeClass} ${style.className}`}
    >
      <span className="relative w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-current" />
        {pulses && (
          <motion.span
            className="absolute inset-0 rounded-full bg-current"
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </span>
      {style.label}
    </motion.span>
  )
}
