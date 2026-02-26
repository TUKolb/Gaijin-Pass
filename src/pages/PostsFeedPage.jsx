import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
// import { supabase } from '../lib/supabase'

const PLACEHOLDER_POSTS = [
  { id: 1, title: 'How I set up my bank account at Japan Post', category: 'Banking & Money', author: 'alex_t', likes: 24, created_at: '2024-03-10', preview: 'I was nervous about this but it turned out to be simpler than expected. Here\'s exactly what I brought...' },
  { id: 2, title: 'Tips for the ward office registration',       category: 'Administrative', author: 'yuki_foreigner', likes: 18, created_at: '2024-03-08', preview: 'Go first thing in the morning to avoid the queue. Bring your passport, residence card, and a pen.' },
  { id: 3, title: 'Finding an apartment as a foreigner',         category: 'Daily Living',   author: 'maria_k',   likes: 31, created_at: '2024-03-05', preview: 'Not all agencies work with foreigners. I\'ll list the ones that helped me most.' },
]

const SORT_OPTIONS = ['Newest', 'Most Liked']

export default function PostsFeedPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [posts, setPosts]     = useState(PLACEHOLDER_POSTS)
  const [sort, setSort]       = useState('Newest')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(false)

  // TODO: fetch posts from Supabase
  // useEffect(() => {
  //   async function load() {
  //     setLoading(true)
  //     let query = supabase.from('experience_posts').select('*')
  //     if (sort === 'Most Liked') query = query.order('likes', { ascending: false })
  //     else query = query.order('created_at', { ascending: false })
  //     const { data } = await query
  //     setPosts(data ?? [])
  //     setLoading(false)
  //   }
  //   load()
  // }, [sort, category])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Community Posts</h1>
          <p style={{ color: 'var(--ink-muted)' }}>Real experiences from foreigners living in Japan.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => user ? navigate('/posts/new') : navigate('/login')}
        >
          + New Post
        </button>
      </div>

      {/* Sort & filter controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt}
            className={`btn btn-sm ${sort === opt ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSort(opt)}
          >
            {opt === 'Newest' ? '🕒' : '🔥'} {opt}
          </button>
        ))}
      </div>

      {/* Post list */}
      {loading && <p>Loading posts…</p>}
      {!loading && posts.length === 0 && (
        <div className="empty-state card">
          <p>No posts yet. Be the first!</p>
          <Link to="/posts/new"><button className="btn btn-primary">Write a Post</button></Link>
        </div>
      )}
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card" onClick={() => navigate(`/posts/${post.id}`)}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span className="badge">{post.category}</span>
            </div>
            <div className="post-card-title">{post.title}</div>
            <div className="post-card-preview">{post.preview}</div>
            <div className="post-card-meta">
              <span>👤 {post.author}</span>
              <span>❤️ {post.likes}</span>
              <span>🗓 {post.created_at}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
