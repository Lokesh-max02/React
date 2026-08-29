import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function RatingStars({ rating = 0, reviewCount, size = 14 }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-gold" style={{ fontSize: size }}>
        {Array.from({ length: full }).map((_, i) => (
          <FaStar key={`f${i}`} />
        ))}
        {hasHalf && <FaStarHalfAlt />}
        {Array.from({ length: empty }).map((_, i) => (
          <FaRegStar key={`e${i}`} />
        ))}
      </div>
      <span className="text-sm font-semibold text-stone">{rating.toFixed(1)}</span>
      {reviewCount != null && (
        <span className="text-xs text-stone/50">({reviewCount})</span>
      )}
    </div>
  )
}
