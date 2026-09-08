import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../../components/Reveal'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../../services/profileService'
import { extractErrorMessage } from '../../services/apiClient'

export default function OwnerProfile() {
  const { updateUserName } = useAuth()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', businessName: '', address: '', currentPassword: '', newPassword: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getMyProfile()
      .then((data) => {
        if (cancelled) return
        setForm((f) => ({
          ...f,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || '',
          businessName: data.businessName || '',
          address: data.address || '',
        }))
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load your profile.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        businessName: form.businessName,
        address: form.address,
      }
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }
      const updated = await updateMyProfile(payload)
      updateUserName(updated.fullName)
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '' }))
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save changes.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-2xl"><div className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" /></div>
  }

  return (
    <div className="max-w-2xl">
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Account</p>
        <h1 className="font-display text-3xl text-stone">Owner Profile</h1>
      </Reveal>

      <Reveal delay={0.1} className="bg-white border border-stone/10 rounded-2xl p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center font-display text-2xl text-kumkum">
            {form.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-display text-lg text-stone">{form.fullName}</p>
            <p className="text-xs text-stone/45">{form.businessName || form.email}</p>
          </div>
        </div>

        <div className="kolam-divider mb-6" />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-kumkum bg-kumkum/5 border border-kumkum/20 rounded-lg px-3 py-2 mb-5 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Name">
            <input value={form.fullName} onChange={update('fullName')} className="input" required />
          </Field>
          <Field label="Business Name">
            <input value={form.businessName} onChange={update('businessName')} className="input" required />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email">
              <input type="email" value={form.email} className="input" disabled title="Email cannot be changed" />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={update('phone')} className="input" required />
            </Field>
          </div>
          <Field label="Address">
            <textarea value={form.address} onChange={update('address')} rows={2} className="input resize-none" />
          </Field>

          <div className="kolam-divider" />

          <p className="text-xs font-semibold uppercase tracking-wide text-stone/45">Change Password (optional)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Current Password">
              <input type="password" value={form.currentPassword} onChange={update('currentPassword')} className="input" />
            </Field>
            <Field label="New Password">
              <input type="password" value={form.newPassword} onChange={update('newPassword')} className="input" placeholder="Leave blank to keep current password" />
            </Field>
          </div>

          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            animate={saved ? { backgroundColor: '#46603C' } : { backgroundColor: '#7A1B3D' }}
            className="px-6 py-3 rounded-full text-ivory font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
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
