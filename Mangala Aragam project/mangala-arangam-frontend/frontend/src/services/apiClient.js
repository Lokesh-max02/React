import axios from 'axios'

// In dev, defaults to the Spring Boot backend's default port (8080).
// Override by setting VITE_API_BASE_URL in a .env file (see .env.example).
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT (if we have one) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ma_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On a 401, the token is invalid/expired — clear the stored session so the
// UI can fall back to a logged-out state. We don't hard-redirect here;
// components decide how to react (see AuthContext).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ma_token')
      localStorage.removeItem('ma_user')
    }
    return Promise.reject(error)
  }
)

// Pulls a readable message out of the backend's ApiError shape
// ({ status, error, message, fieldErrors }) for display in forms.
export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (!data) return fallback
  if (data.fieldErrors && Object.keys(data.fieldErrors).length) {
    return Object.values(data.fieldErrors)[0]
  }
  return data.message || fallback
}

export default apiClient
