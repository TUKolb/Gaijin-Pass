import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../components/ImageUpload'

export default function PostForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', content: '', category_id: '' })
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { data, error } = await supabase.from('posts').insert({
      user_id: user.id,
      title: form.title,
      content: form.content,
      category_id: form.category_id || null,
      image_url: imageUrl || null,
    }).select().single()

    if (error) {
      setError(error.message)
    } else {
      navigate(`/posts/${data.id}`)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Share Your Experience</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. How I opened a bank account at Japan Post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category_id}
            onChange={e => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
          <textarea
            required
            rows={8}
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share what you went through, tips, and what you wish you knew..."
          />
        </div>

        <ImageUpload onUpload={url => setImageUrl(url)} />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded font-medium"
        >
          {saving ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}
