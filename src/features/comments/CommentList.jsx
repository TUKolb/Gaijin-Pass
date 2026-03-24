import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function CommentList({ postId }) {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState([])

  useEffect(() => {
    supabase.from('comments')
      .select('*, profiles(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setComments(data || []))
  }, [postId])

  async function handleDelete(commentId) {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(comments.filter(c => c.id !== commentId))
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm mb-4">No comments yet.</p>
  }

  return (
    <div className="space-y-3 mb-6">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-50 rounded p-3 text-sm">
          <div className="flex justify-between items-start">
            <span className="font-medium text-gray-700">{comment.profiles?.username || 'Anonymous'}</span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              {user && (user.id === comment.user_id || profile?.role === 'admin') && (
                <button onClick={() => handleDelete(comment.id)} className="text-red-400 hover:text-red-600">
                  Delete
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-1">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
