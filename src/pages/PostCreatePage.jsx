import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { supabase } from '../lib/supabase'

const CATEGORIES = [
  'Administrative Registration',
  'Daily Living',
  'Transportation',
  'Healthcare',
  'Banking & Money',
  'Social Life',
  'Other',
]

export default function PostCreatePage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ title: '', category: '', content: '' })
  const [image, setImage]   = useState(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      // TODO: implement post creation
      // 1. If image, upload to Supabase Storage and get URL
      // 2. Insert into 'experience_posts' table via supabase
      // 3. Navigate to the new post's detail page
      alert('Post creation not yet implemented — wire up Supabase.')
      navigate('/posts')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate('/posts')}>
        ← Back
      </button>

      <h1 className="page-title">New Post</h1>
      <p className="page-subtitle">Share your experience to help other newcomers.</p>

      <div className="card">
        <div className="form-group">
          <label>Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. How I got my residence card renewed"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select a category…</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your experience here…"
            rows={8}
          />
        </div>

        <div className="form-group">
          <label>Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0] ?? null)}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Posting…' : 'Publish Post'}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/posts')}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
