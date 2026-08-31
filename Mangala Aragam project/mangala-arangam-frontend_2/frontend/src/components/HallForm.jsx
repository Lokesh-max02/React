import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCloudUploadAlt, FaImages, FaTimes, FaCheck } from 'react-icons/fa'
import Reveal from './Reveal'
import { uploadHallImage, uploadHallGallery } from '../services/uploadService'
import { extractErrorMessage } from '../services/apiClient'

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
    mainImageUrl: '',
    galleryImages: [],
    ...initial,
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggleFacility = (f) => {
    setForm((prev) => {
      const has = prev.facilities.includes(f)
      return { ...prev, facilities: has ? prev.facilities.filter((x) => x !== f) : [...prev.facilities, f] }
    })
  }

  const handleMainImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploadingMain(true)
    try {
      const url = await uploadHallImage(file)
      setForm((f) => ({ ...f, mainImageUrl: url }))
    } catch (err) {
      setUploadError(extractErrorMessage(err, 'Could not upload that image.'))
    } finally {
      setUploadingMain(false)
      e.target.value = '' // allow re-selecting the same file later
    }
  }

  const handleGallerySelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploadError('')
    setUploadingGallery(true)
    try {
      const urls = await uploadHallGallery(files)
      setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ...urls] }))
    } catch (err) {
      setUploadError(extractErrorMessage(err, 'Could not upload those images.'))
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const removeGalleryImage = (url) => {
    setForm((f) => ({ ...f, galleryImages: f.galleryImages.filter((g) => g !== url) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.mainImageUrl) {
      setUploadError('Please upload a main hall image before submitting.')
      return
    }
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
      mainImageUrl: form.mainImageUrl,
      galleryImages: form.galleryImages,
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
          <AnimatePresence>
            {uploadError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 overflow-hidden"
              >
                {uploadError}
              </motion.p>
            )}
          </AnimatePresence>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">
              Main Hall Image
            </span>
            {form.mainImageUrl ? (
              <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-stone/15 group">
                <img src={form.mainImageUrl} alt="Main hall" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, mainImageUrl: '' }))}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 text-kumkum flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove main image"
                >
                  <FaTimes size={11} />
                </button>
              </div>
            ) : (
              <UploadBox
                icon={<FaCloudUploadAlt size={22} />}
                label={uploadingMain ? 'Uploading…' : 'Click to upload main image'}
                hint="JPG, PNG, or WEBP — up to 10MB"
                onChange={handleMainImageSelect}
                disabled={uploadingMain}
                multiple={false}
              />
            )}
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wide text-stone/45 mb-1.5">
              Gallery Images
            </span>
            {form.galleryImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.galleryImages.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone/15 group">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(url)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-kumkum flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove gallery image"
                    >
                      <FaTimes size={9} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <UploadBox
              icon={<FaImages size={22} />}
              label={uploadingGallery ? 'Uploading…' : 'Click to add gallery photos'}
              hint="Select multiple images at once"
              onChange={handleGallerySelect}
              disabled={uploadingGallery}
              multiple
            />
          </div>
        </Section>

        <motion.button
          type="submit"
          disabled={submitting || uploadingMain || uploadingGallery}
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

function UploadBox({ icon, label, hint, onChange, disabled, multiple }) {
  return (
    <motion.label
      whileHover={disabled ? {} : { scale: 1.01, borderColor: '#C9962B' }}
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 transition-colors ${
        disabled ? 'border-stone/15 text-stone/30 cursor-wait' : 'border-stone/20 text-stone/45 cursor-pointer'
      }`}
    >
      <input type="file" className="hidden" accept="image/*" multiple={multiple} onChange={onChange} disabled={disabled} />
      <span className="text-gold-dark">{icon}</span>
      <span className="text-sm font-semibold text-stone/60">{label}</span>
      <span className="text-[11px]">{hint}</span>
    </motion.label>
  )
}
