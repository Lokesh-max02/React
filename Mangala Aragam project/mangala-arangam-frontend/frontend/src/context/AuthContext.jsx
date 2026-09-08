import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient'

const AuthContext = createContext(null)

function persistSession(authResponse) {
  const user = {
    id: authResponse.userId,
    fullName: authResponse.fullName,
    email: authResponse.email,
    role: authResponse.role, // 'ROLE_CUSTOMER' | 'ROLE_OWNER' | 'ROLE_ADMIN'
  }
  localStorage.setItem('ma_token', authResponse.token)
  localStorage.setItem('ma_user', JSON.stringify(user))
  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on first load.
  useEffect(() => {
    const stored = localStorage.getItem('ma_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('ma_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await apiClient.post('/api/auth/login', { email, password })
    const loggedInUser = persistSession(data)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  // payload: { fullName, email, phone, password, address, businessName?, role }
  const register = useCallback(async (payload) => {
    const { data } = await apiClient.post('/api/auth/register', payload)
    const newUser = persistSession(data)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ma_token')
    localStorage.removeItem('ma_user')
    setUser(null)
  }, [])

  // Keeps the navbar/session in sync after a profile edit changes the display name.
  const updateUserName = useCallback((fullName) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, fullName }
      localStorage.setItem('ma_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUserName,
    }),
    [user, loading, login, register, logout, updateUserName]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
