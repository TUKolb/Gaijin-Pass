import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function CommentForm({ postId, onCommentAdded }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content,
    })

    if (error) {
      setError(error.message)
    } else {
      setContent('')
      onCommentAdded?.()
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <textarea
        required
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={saving}
        className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded text-sm"
      >
        {saving ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}
