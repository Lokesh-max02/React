import { motion } from 'framer-motion'

const ALL_FACILITIES = ['AC', 'Dining Hall', 'Stage', 'Parking', 'Generator', 'Rooms', 'Decoration', 'Catering', 'WiFi']

export default function FilterSidebar({ filters, setFilters }) {
  const toggleFacility = (f) => {
    setFilters((prev) => {
      const has = prev.facilities.includes(f)
      return {
        ...prev,
        facilities: has ? prev.facilities.filter((x) => x !== f) : [...prev.facilities, f],
      }
    })
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-stone/10 p-5 space-y-6 h-fit sticky top-24">
      <div>
        <h3 className="font-display text-lg text-stone mb-3">Location</h3>
        <input
          value={filters.location}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
          placeholder="e.g. Mylapore"
          className="w-full rounded-lg border border-stone/15 px-3 py-2 text-sm outline-none focus-visible:border-kumkum"
        />
      </div>

      <div className="kolam-divider" />

      <div>
        <h3 className="font-display text-lg text-stone mb-3">Price Range (₹)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
            className="w-1/2 rounded-lg border border-stone/15 px-3 py-2 text-sm outline-none focus-visible:border-kumkum"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
            className="w-1/2 rounded-lg border border-stone/15 px-3 py-2 text-sm outline-none focus-visible:border-kumkum"
          />
        </div>
      </div>

      <div className="kolam-divider" />

      <div>
        <h3 className="font-display text-lg text-stone mb-3">Guest Capacity</h3>
        <input
          type="number"
          placeholder="Minimum guests"
          value={filters.capacity}
          onChange={(e) => setFilters((f) => ({ ...f, capacity: e.target.value }))}
          className="w-full rounded-lg border border-stone/15 px-3 py-2 text-sm outline-none focus-visible:border-kumkum"
        />
      </div>

      <div className="kolam-divider" />

      <div>
        <h3 className="font-display text-lg text-stone mb-3">Minimum Rating</h3>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((r) => (
            <motion.button
              key={r}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? '' : r }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.minRating === r
                  ? 'bg-kumkum text-ivory border-kumkum'
                  : 'border-stone/15 text-stone/60'
              }`}
            >
              {r}+
            </motion.button>
          ))}
        </div>
      </div>

      <div className="kolam-divider" />

      <div>
        <h3 className="font-display text-lg text-stone mb-3">Facilities</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_FACILITIES.map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleFacility(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filters.facilities.includes(f)
                  ? 'bg-gold/15 text-gold-dark border-gold/50'
                  : 'border-stone/15 text-stone/60'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="kolam-divider" />

      <div>
        <h3 className="font-display text-lg text-stone mb-3">Available Date</h3>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
          className="w-full rounded-lg border border-stone/15 px-3 py-2 text-sm outline-none focus-visible:border-kumkum"
        />
      </div>

      <button
        onClick={() =>
          setFilters({
            location: '',
            minPrice: '',
            maxPrice: '',
            capacity: '',
            minRating: '',
            facilities: [],
            date: '',
          })
        }
        className="w-full text-center text-sm font-semibold text-kumkum py-2 hover:underline"
      >
        Clear all filters
      </button>
    </motion.aside>
  )
}
