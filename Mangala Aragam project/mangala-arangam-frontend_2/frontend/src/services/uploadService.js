import apiClient from './apiClient'

// Uploads a single main image. Returns the public URL string.
export async function uploadHallImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/api/uploads/hall-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}

// Uploads multiple gallery images in one request. Returns an array of public URLs.
export async function uploadHallGallery(files) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  const { data } = await apiClient.post('/api/uploads/hall-gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
