import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import OwnerAvailabilityCalendar from '../../components/OwnerAvailabilityCalendar'
import { getHallById } from '../../services/hallService'

export default function HallAvailabilityManage() {
  const { id } = useParams()
  const [hall, setHall] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getHallById(id)
      .then((data) => !cancelled && setHall(data))
      .catch(() => !cancelled && setHall(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <div className="max-w-2xl"><div className="h-96 rounded-2xl bg-white border border-stone/10 animate-pulse" /></div>
  }

  if (!hall) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <h1 className="font-display text-2xl text-stone mb-3">Hall not found</h1>
        <Link to="/owner/halls" className="text-kumkum font-semibold">Back to My Halls</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Availability</p>
        <h1 className="font-display text-3xl text-stone">{hall.name}</h1>
        <p className="text-sm text-stone/50 mt-1">
          Set date-wise availability. A date already booked will never appear as available to customers.
        </p>
      </Reveal>

      <OwnerAvailabilityCalendar hallId={hall.id} />
    </div>
  )
}
