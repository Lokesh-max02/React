import { useEffect, useState } from 'react'
import Reveal from '../../components/Reveal'
import UserTable from '../../components/UserTable'
import { getCustomers, setUserActive } from '../../services/index'
import { extractErrorMessage } from '../../services/apiClient'

export default function ManageCustomers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    getCustomers()
      .then((data) => !cancelled && setUsers(data))
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load customers.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleToggle = async (id, active) => {
    setTogglingId(id)
    try {
      const updated = await setUserActive(id, active)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update this customer.'))
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div>
      <Reveal className="mb-6">
        <p className="text-gold-dark text-xs font-semibold uppercase tracking-[0.2em] mb-2">Users</p>
        <h1 className="font-display text-3xl text-stone">Manage Customers</h1>
      </Reveal>

      {error && <div className="bg-white rounded-xl border border-kumkum/20 p-4 mb-6 text-sm text-kumkum">{error}</div>}

      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-stone/10 animate-pulse" />
      ) : (
        <UserTable users={users} onToggleActive={handleToggle} togglingId={togglingId} />
      )}
    </div>
  )
}
