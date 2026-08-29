import { useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from '../../components/Reveal'
import { useAuth } from '../../context/AuthContext'

export default function OwnerProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    businessName: '',
    address: '',
  })
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="max-w-2xl">
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Account</p>
        <h1 className="font-display text-3xl text-stone">Owner Profile</h1>
      </Reveal>

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center font-display text-2xl text-kumkum">
            {form.name.charAt(0)}
          </div>
          <div>
            <p className="font-display text-lg text-stone">{form.name}</p>
            <p className="text-xs text-stone/45">{form.email}</p>
          </div>
        </div>

        <div className="kolam-divider mb-6" />

        <div className="bg-gold/10 border border-gold/25 rounded-xl px-4 py-3 mb-6 text-xs text-stone/60">
          Profile editing isn't wired to the backend yet — there's no update-profile endpoint
          on the API. This form shows your real name and email from login; the other fields
          are local-only until that endpoint exists.
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Field label="Name"><input value={form.name} onChange={update('name')} className="input" disabled /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={update('email')} className="input" disabled /></Field>
          <Field label="Phone"><input type="tel" value={form.phone} onChange={update('phone')} className="input" placeholder="Not available yet" /></Field>
          <Field label="Business Name"><input value={form.businessName} onChange={update('businessName')} className="input" placeholder="Not available yet" /></Field>
          <Field label="Address"><textarea value={form.address} onChange={update('address')} rows={2} className="input resize-none" placeholder="Not available yet" /></Field>

          <motion.button
            type="submit"
            disabled
            className="px-6 py-3 rounded-full bg-stone/20 text-stone/50 font-semibold cursor-not-allowed"
          >
            Save Changes (unavailable)
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
