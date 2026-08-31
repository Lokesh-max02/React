import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch } from 'react-icons/fa'

export default function UserTable({ users, onToggleActive, togglingId, showBusinessName = false }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return users
    const q = query.toLowerCase()
    return users.filter(
      (u) => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q)
    )
  }, [users, query])

  return (
    <div>
      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/30" size={13} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone/15 text-sm outline-none focus-visible:border-kumkum bg-white"
        />
      </div>

      <div className="bg-white border border-stone/10 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg text-stone">No matches found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-stone/40 border-b border-stone/10">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  {showBusinessName && <th className="px-5 py-3 font-semibold">Business</th>}
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <motion.tbody initial="hidden" animate="show" transition={{ staggerChildren: 0.03 }}>
                {filtered.map((u) => (
                  <motion.tr
                    key={u.id}
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                    className="border-b border-stone/5 last:border-0 hover:bg-parchment/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-stone">{u.fullName}</td>
                    <td className="px-5 py-3.5 text-stone/60">{u.email}</td>
                    <td className="px-5 py-3.5 text-stone/60">{u.phone || '—'}</td>
                    {showBusinessName && <td className="px-5 py-3.5 text-stone/60">{u.businessName || '—'}</td>}
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                        u.active ? 'bg-leaf/10 text-leaf border-leaf/30' : 'bg-kumkum/10 text-kumkum border-kumkum/30'
                      }`}>
                        {u.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <motion.button
                        onClick={() => onToggleActive(u.id, !u.active)}
                        disabled={togglingId === u.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors disabled:opacity-50 ${
                          u.active
                            ? 'border-kumkum/30 text-kumkum hover:bg-kumkum/5'
                            : 'border-leaf/30 text-leaf hover:bg-leaf/5'
                        }`}
                      >
                        {togglingId === u.id ? '…' : u.active ? 'Deactivate' : 'Activate'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
