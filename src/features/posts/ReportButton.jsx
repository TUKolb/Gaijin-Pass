import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function ReportButton({ postId, commentId }) {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!user || submitted) {
    return submitted ? <span className="text-xs text-gray-400">Reported</span> : null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('reports').insert({
      reporter_id: user.id,
      post_id: postId || null,
      comment_id: commentId || null,
      reason,
    })
    setSubmitted(true)
    setSaving(false)
  }

  return (
    <div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="text-xs text-gray-400 hover:text-red-500">
          Report
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 bg-gray-50 border border-gray-200 rounded p-3">
          <textarea
            required
            rows={2}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for reporting..."
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={saving}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs">
              Submit
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
