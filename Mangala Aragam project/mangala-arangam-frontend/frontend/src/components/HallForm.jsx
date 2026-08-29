import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCloudUploadAlt, FaImages } from 'react-icons/fa'
import Reveal from './Reveal'

const ALL_FACILITIES = ['AC', 'Dining Hall', 'Stage', 'Parking', 'Generator', 'Rooms', 'Decoration', 'Catering', 'WiFi']

export default function HallForm({ initial, onSubmit, submitLabel = 'Save Hall' }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    googleMapLink: '',
    price: '',
    capacity: '',
    rooms: '',
    parking: '',
    facilities: [],
    status: 'AVAILABLE',
    ...initial,
  })
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggleFacility = (f) => {
    setForm((prev) => {
      const has = prev.facilities.includes(f)
      return { ...prev, facilities: has ? prev.facilities.filter((x) => x !== f) : [...prev.facilities, f] }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Map local form state to the exact HallRequest shape the backend expects.
    const payload = {
      name: form.name,
      description: form.description,
      location: form.location,
      address: form.address,
      googleMapLink: form.googleMapLink,
      price: Number(form.price),
      guestCapacity: Number(form.capacity),
      numberOfRooms: Number(form.rooms) || 0,
      parkingCapacity: Number(form.parking) || 0,
      mainImageUrl: form.mainImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      galleryImages: form.galleryImages || [],
      facilities: form.facilities,
    }
    Promise.resolve(onSubmit?.(payload)).finally(() => setSubmitting(false))
  }

  return (
    <Reveal>
      <form onSubmit={handleSubmit} className="bg-white border border-stone/10 rounded-2xl p-6 space-y-6">
        <Section title="Basic Details">
          <Field label="Hall Name">
            <input required value={form.name} onChange={update('name')} className="input" />
          </Field>
          <Field label="Description">
            <textarea required value={form.description} onChange={update('description')} rows={4} className="input resize-none" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Location">
              <input required value={form.location} onChange={update('location')} placeholder="e.g. Mylapore, Chennai" className="input" />
            </Field>
            <Field label="Google Map Link">
              <input value={form.googleMapLink} onChange={update('googleMapLink')} placeholder="https://maps.google.com/…" className="input" />
            </Field>
          </div>
          <Field label="Full Address">
            <textarea required value={form.address} onChange={update('address')} rows={2} className="input resize-none" />
          </Field>
        </Section>

        <div className="kolam-divider" />

        <Section title="Capacity & Pricing">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Price (₹)"><input required type="number" min="0" value={form.price} onChange={update('price')} className="input" /></Field>
            <Field label="Guest Capacity"><input required type="number" min="1" value={form.capacity} onChange={update('capacity')} className="input" /></Field>
            <Field label="Rooms"><input type="number" min="0" value={form.rooms} onChange={update('rooms')} className="input" /></Field>
            <Field label="Parking Capacity"><input type="number" min="0" value={form.parking} onChange={update('parking')} className="input" /></Field>
          </div>
        </Section>

        <div className="kolam-divider" />

        <Section title="Facilities">
          <div className="flex flex-wrap gap-2">
            {ALL_FACILITIES.map((f) => (
              <motion.button
                type="button"
                key={f}
                onClick={() => toggleFacility(f)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  form.facilities.includes(f) ? 'bg-gold/15 text-gold-dark border-gold/50' : 'border-stone/15 text-stone/60'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </Section>

        <div className="kolam-divider" />

        <Section title="Images">
          <Field label="Main Image URL">
            <input
              type="url"
              value={form.mainImageUrl || ''}
              onChange={update('mainImageUrl')}
              placeholder="https://images.unsplash.com/..."
              className="input"
            />
          </Field>
          <p className="text-[11px] text-stone/40 -mt-2">
            File upload isn't wired to the backend yet — paste an image URL for now (e.g. from Unsplash).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-40 pointer-events-none">
            <UploadBox icon={<FaCloudUploadAlt size={22} />} label="Main Hall Image" hint="Coming soon" />
            <UploadBox icon={<FaImages size={22} />} label="Gallery Images" hint="Coming soon" />
          </div>
        </Section>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.97 }}
          className="w-full py-3.5 rounded-full bg-kumkum text-ivory font-semibold hover:bg-kumkum-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </motion.button>
      </form>
    </Reveal>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-lg text-stone mb-4">{title}</h2>
      <div className="space-y-5">{children}</div>
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

function UploadBox({ icon, label, hint }) {
  return (
    <motion.label
      whileHover={{ scale: 1.01, borderColor: '#C9962B' }}
      className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone/20 rounded-xl py-8 cursor-pointer text-stone/45 transition-colors"
    >
      <input type="file" className="hidden" accept="image/*" multiple={label === 'Gallery Images'} />
      <span className="text-gold-dark">{icon}</span>
      <span className="text-sm font-semibold text-stone/60">{label}</span>
      <span className="text-[11px]">{hint}</span>
    </motion.label>
  )
}
