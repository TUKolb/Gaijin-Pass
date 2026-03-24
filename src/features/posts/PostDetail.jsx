import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import LikeButton from './LikeButton'
import CommentList from '../comments/CommentList'
import CommentForm from '../comments/CommentForm'
import ReportButton from './ReportButton'

export default function PostDetail() {
  const { postId } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentKey, setCommentKey] = useState(0)

  useEffect(() => {
    supabase.from('posts')
      .select('*, categories(name), profiles(username)')
      .eq('id', postId)
      .single()
      .then(({ data }) => {
        setPost(data)
        setLoading(false)
      })
  }, [postId])

  async function handleDelete() {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', postId)
    navigate('/posts')
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>
  if (!post) return <div className="text-center py-8 text-red-500">Post not found</div>

  const canDelete = user && (user.id === post.user_id || profile?.role === 'admin')

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/posts" className="text-blue-600 hover:underline text-sm">&larr; Back to Posts</Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
        {post.categories && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {post.categories.name}
          </span>
        )}
        <h1 className="text-2xl font-bold mt-2 mb-1">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          by {post.profiles?.username || 'Anonymous'} · {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.image_url && (
          <img src={post.image_url} alt="" className="w-full rounded mb-4 border border-gray-200" />
        )}

        <p className="text-gray-700 whitespace-pre-wrap mb-6">{post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LikeButton post={post} />
            <ReportButton postId={postId} />
          </div>
          {canDelete && (
            <button onClick={handleDelete} className="text-red-500 hover:underline text-sm">
              Delete Post
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <CommentList postId={postId} key={commentKey} />
        {user ? (
          <CommentForm postId={postId} onCommentAdded={() => setCommentKey(k => k + 1)} />
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  )
}
