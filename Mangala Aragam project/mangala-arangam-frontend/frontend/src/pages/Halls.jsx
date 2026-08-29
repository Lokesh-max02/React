import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import HallCard from '../components/HallCard'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { searchHalls } from '../services/hallService'
import { extractErrorMessage } from '../services/apiClient'

export default function Halls() {
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState('popular')
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: searchParams.get('budget') || '',
    capacity: searchParams.get('guests') || '',
    minRating: '',
    facilities: [],
    date: searchParams.get('date') || '',
  })

  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Re-fetch from the backend whenever a filter changes. The backend does the
  // heavy filtering (location/price/capacity/rating/facilities/date); sort
  // stays client-side since the API doesn't take a sort param.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    searchHalls(filters)
      .then((data) => {
        if (!cancelled) setHalls(data)
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, 'Could not load wedding halls.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.location, filters.minPrice, filters.maxPrice, filters.capacity, filters.minRating, filters.date, filters.facilities.join(',')])

  const sorted = useMemo(() => {
    const result = [...halls]
    switch (sort) {
      case 'price_low':
        return result.sort((a, b) => a.price - b.price)
      case 'price_high':
        return result.sort((a, b) => b.price - a.price)
      case 'rated':
        return result.sort((a, b) => b.rating - a.rating)
      case 'popular':
      default:
        return result.sort((a, b) => b.reviewCount - a.reviewCount)
    }
  }, [halls, sort])

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <Reveal className="mb-8">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Browse</p>
        <h1 className="font-display text-3xl sm:text-4xl text-stone mb-6">Wedding Halls in Chennai</h1>
        <SearchBar variant="inline" />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-stone/55">{loading ? 'Searching…' : `${sorted.length} halls found`}</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-stone/15 px-3 py-2 text-sm outline-none focus-visible:border-kumkum bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="rated">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white rounded-2xl border border-kumkum/20"
              >
                <p className="font-display text-xl text-kumkum mb-2">Couldn't load halls</p>
                <p className="text-sm text-stone/50">{error}</p>
              </motion.div>
            ) : loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl bg-white border border-stone/10 animate-pulse" />
                ))}
              </motion.div>
            ) : sorted.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white rounded-2xl border border-stone/10"
              >
                <p className="font-display text-xl text-stone mb-2">No halls match those filters</p>
                <p className="text-sm text-stone/50">Try widening your budget or clearing a filter.</p>
              </motion.div>
            ) : (
              <RevealGroup
                key={`${filters.location}-${filters.minPrice}-${filters.maxPrice}-${filters.capacity}-${filters.minRating}-${filters.facilities.join(',')}-${filters.date}-${sort}`}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                stagger={0.05}
              >
                {sorted.map((h) => (
                  <RevealItem key={h.id}>
                    <HallCard hall={h} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
