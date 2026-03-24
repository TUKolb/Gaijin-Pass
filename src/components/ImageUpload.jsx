import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ImageUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB')
      return
    }

    setError('')
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file)

    if (uploadError) {
      setError(uploadError.message)
      setPreview(null)
    } else {
      const { data } = supabase.storage.from('post-images').getPublicUrl(fileName)
      onUpload(data.publicUrl)
    }

    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Image (optional, max 5MB)
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {uploading && <p className="text-gray-500 text-sm mt-1">Uploading...</p>}

      {preview && (
        <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded border border-gray-200" />
      )}
    </div>
  )
}
