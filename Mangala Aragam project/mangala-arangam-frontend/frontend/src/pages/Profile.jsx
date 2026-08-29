import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCamera } from 'react-icons/fa'
import Reveal from '../components/Reveal'

export default function Profile() {
  const [form, setForm] = useState({
    name: 'Divya Ramesh',
    email: 'divya.ramesh@example.com',
    phone: '+91 90000 12345',
    address: '12 Luz Church Road, Mylapore, Chennai',
    password: '',
  })
  const [saved, setSaved] = useState(false)
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
      <Reveal>
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Account</p>
        <h1 className="font-display text-3xl text-stone mb-8">My Profile</h1>
      </Reveal>

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 rounded-full bg-blush flex items-center justify-center font-display text-2xl text-kumkum"
            >
              {form.name.charAt(0)}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-kumkum text-ivory flex items-center justify-center text-xs"
            >
              <FaCamera size={11} />
            </motion.button>
          </div>
          <div>
            <p className="font-display text-lg text-stone">{form.name}</p>
            <p className="text-xs text-stone/45">Customer since 2025</p>
          </div>
        </div>

        <div className="kolam-divider mb-6" />

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Name">
            <input value={form.name} onChange={update('name')} className="input" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={update('email')} className="input" />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={update('phone')} className="input" />
          </Field>
          <Field label="Address">
            <textarea value={form.address} onChange={update('address')} rows={2} className="input resize-none" />
          </Field>
          <Field label="New Password">
            <input type="password" value={form.password} onChange={update('password')} placeholder="Leave blank to keep current password" className="input" />
          </Field>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={saved ? { backgroundColor: '#46603C' } : { backgroundColor: '#7A1B3D' }}
            className="px-6 py-3 rounded-full text-ivory font-semibold transition-colors"
          >
            {saved ? 'Saved ✓' : 'Save Changes'}
          </motion.button>
        </form>
      </Reveal>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">{label}</span>
      {children}
    </label>
  )
}
