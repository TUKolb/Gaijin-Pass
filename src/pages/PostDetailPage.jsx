import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
// import { supabase } from '../lib/supabase'

// Placeholder — replace with real Supabase fetch
const PLACEHOLDER = {
  id: 1,
  title: 'How I set up my bank account at Japan Post',
  category: 'Banking & Money',
  author: 'alex_t',
  likes: 24,
  liked: false,
  created_at: '2024-03-10',
  content: `Setting up a Japan Post (ゆうちょ銀行) account as a foreigner is one of the first things I recommend doing.\n\nYou will need:\n- Residence Card (在留カード)\n- Passport\n- Your registered address (from the ward office)\n\nHead to any Japan Post branch and ask for the 口座開設 (account opening) form. Staff were helpful even with my limited Japanese.`,
}

const PLACEHOLDER_COMMENTS = [
  { id: 1, author: 'yuki_foreigner', text: 'Great guide! I also found it helpful to bring a translation of my address in Japanese.', created_at: '2024-03-11' },
  { id: 2, author: 'maria_k', text: 'Which branch did you go to? Some can be busier than others.', created_at: '2024-03-12' },
]

export default function PostDetailPage() {
  const { id }       = useParams()
  const { user }     = useAuth()
  const navigate     = useNavigate()

  const [post, setPost]         = useState(PLACEHOLDER)
  const [comments, setComments] = useState(PLACEHOLDER_COMMENTS)
  const [newComment, setNew]    = useState('')
  const [liked, setLiked]       = useState(false)
  const [loading, setLoading]   = useState(false)

  // TODO: fetch post by id
  // useEffect(() => { ... }, [id])

  const handleLike = () => {
    // TODO: toggle like in Supabase
    if (!user) { navigate('/login'); return }
    setLiked(prev => !prev)
    setPost(p => ({ ...p, likes: liked ? p.likes - 1 : p.likes + 1 }))
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    // TODO: insert comment into Supabase
    const mock = { id: Date.now(), author: user?.email ?? 'you', text: newComment, created_at: 'just now' }
    setComments(prev => [...prev, mock])
    setNew('')
  }

  const handleDeleteComment = (commentId) => {
    // TODO: delete from Supabase then update state
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  const handleDeletePost = () => {
    // TODO: delete post from Supabase, then navigate away
    if (window.confirm('Delete this post?')) navigate('/posts')
  }

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>
  if (!post)   return <p style={{ padding: 40 }}>Post not found.</p>

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate('/posts')}>
        ← Back to Posts
      </button>

      {/* Post header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <span className="badge" style={{ marginBottom: 12 }}>{post.category}</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem', color: 'var(--ink-faint)', marginBottom: 16 }}>
          <span>👤 {post.author}</span>
          <span>🗓 {post.created_at}</span>
        </div>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: 'var(--ink)' }}>{post.content}</p>

        <hr className="divider" />

        {/* Like + owner actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className={`btn btn-sm ${liked ? 'btn-primary' : 'btn-ghost'}`}
            onClick={handleLike}
          >
            ❤️ {post.likes} {liked ? 'Liked' : 'Like'}
          </button>

          {/* Show edit/delete if this is the author — TODO: check user.id === post.author_id */}
          {user && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Edit not yet implemented')}>
                ✏️ Edit
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={handleDeletePost}>
                🗑 Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.05rem' }}>
          💬 Comments ({comments.length})
        </h2>

        {comments.length === 0 && (
          <p style={{ color: 'var(--ink-faint)', marginBottom: 16 }}>No comments yet.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {comments.map(c => (
            <div key={c.id} style={{ borderLeft: '3px solid var(--border)', paddingLeft: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.author}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-faint)' }}>{c.created_at}</span>
              </div>
              <p style={{ marginTop: 4, fontSize: '0.92rem' }}>{c.text}</p>
              {/* Show delete if owner — TODO: check user.id */}
              {user && (
                <button
                  style={{ fontSize: '0.78rem', color: 'var(--red)', background: 'none', border: 'none', marginTop: 4, cursor: 'pointer' }}
                  onClick={() => handleDeleteComment(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add comment */}
        {user ? (
          <div>
            <div className="form-group">
              <label>Add a comment</label>
              <textarea
                value={newComment}
                onChange={e => setNew(e.target.value)}
                placeholder="Share your experience or ask a question…"
                rows={3}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddComment}>
              Post Comment
            </button>
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
            <a href="/login">Log in</a> to leave a comment.
          </p>
        )}
      </div>
    </div>
  )
}
