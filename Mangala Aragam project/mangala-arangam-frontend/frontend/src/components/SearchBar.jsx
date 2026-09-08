import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaWallet, FaSearch } from 'react-icons/fa'

export default function SearchBar({ variant = 'hero' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ location: '', date: '', guests: '', budget: '' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(form).forEach(([k, v]) => v && params.set(k, v))
    navigate(`/halls?${params.toString()}`)
  }

  const isHero = variant === 'hero'

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={isHero ? { opacity: 0, y: 20, scale: 0.98 } : false}
      animate={isHero ? { opacity: 1, y: 0, scale: 1 } : false}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${
        isHero
          ? 'bg-white/95 backdrop-blur rounded-2xl shadow-soft p-4 sm:p-5'
          : 'bg-white rounded-xl border border-stone/10 p-4'
      } grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3`}
    >
      <Field icon={<FaMapMarkerAlt />} label="Location">
        <input
          value={form.location}
          onChange={update('location')}
          placeholder="Mylapore, Anna Nagar…"
          className="w-full bg-transparent text-sm font-medium text-stone placeholder:text-stone/35 outline-none"
        />
      </Field>
      <Field icon={<FaCalendarAlt />} label="Event Date">
        <input
          type="date"
          value={form.date}
          onChange={update('date')}
          className="w-full bg-transparent text-sm font-medium text-stone outline-none"
        />
      </Field>
      <Field icon={<FaUserFriends />} label="Guests">
        <input
          type="number"
          min="0"
          value={form.guests}
          onChange={update('guests')}
          placeholder="e.g. 500"
          className="w-full bg-transparent text-sm font-medium text-stone placeholder:text-stone/35 outline-none"
        />
      </Field>
      <Field icon={<FaWallet />} label="Budget (₹)">
        <input
          type="number"
          min="0"
          value={form.budget}
          onChange={update('budget')}
          placeholder="e.g. 200000"
          className="w-full bg-transparent text-sm font-medium text-stone placeholder:text-stone/35 outline-none"
        />
      </Field>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center justify-center gap-2 rounded-xl bg-kumkum text-ivory font-semibold text-sm px-5 py-3 hover:bg-kumkum-dark transition-colors"
      >
        <FaSearch size={13} /> Search Halls
      </motion.button>
    </motion.form>
  )
}

function Field({ icon, label, children }) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-stone/10 px-3.5 py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-stone/40 font-semibold">
        <span className="text-gold-dark">{icon}</span> {label}
      </span>
      {children}
    </label>
  )
}
