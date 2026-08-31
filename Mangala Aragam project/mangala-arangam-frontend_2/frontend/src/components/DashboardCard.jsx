import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'

export default function DashboardCard({ icon, label, value, prefix = '', suffix = '', accent = 'kumkum', delay = 0 }) {
  const accentClasses = {
    kumkum: 'bg-kumkum/10 text-kumkum',
    gold: 'bg-gold/15 text-gold-dark',
    leaf: 'bg-leaf/10 text-leaf',
    blue: 'bg-blue-50 text-blue-700',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3 }}
      className="bg-white border border-stone/10 rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center ${accentClasses[accent]}`}>
          {icon}
        </span>
      </div>
      <p className="font-display text-2xl text-stone">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="text-xs text-stone/50 mt-1">{label}</p>
    </motion.div>
  )
}
