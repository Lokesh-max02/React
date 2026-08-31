import { useEffect, useState } from 'react'
import Reveal, { RevealGroup, RevealItem } from '../../components/Reveal'
import RatingStars from '../../components/RatingStars'
import { getOwnerReviews } from '../../services/index'
import { extractErrorMessage } from '../../services/apiClient'

export default function OwnerReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getOwnerReviews()
      .then((data) => !cancelled && setReviews(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load reviews.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Feedback</p>
        <h1 className="font-display text-3xl text-stone">Reviews</h1>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{[...Array(2)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-white border border-stone/10 animate-pulse" />)}</div>
      ) : error ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-kumkum/20">
          <p className="font-display text-xl text-kumkum mb-2">Couldn't load reviews</p>
          <p className="text-sm text-stone/50">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-stone/10">
          <p className="font-display text-xl text-stone mb-2">No reviews yet</p>
        </div>
      ) : (
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5" stagger={0.06}>
          {reviews.map((r) => (
            <RevealItem key={r.id}>
              <div className="bg-white border border-stone/10 rounded-2xl p-5 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-full bg-blush text-kumkum font-display flex items-center justify-center text-sm">
                      {r.customer?.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-stone">{r.customer}</p>
                      <p className="text-[11px] text-stone/40">{r.hallName}</p>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} />
                </div>
                <p className="text-sm text-stone/65 leading-relaxed mt-3">{r.text}</p>
                <p className="text-[11px] text-stone/35 mt-3">{r.date}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
