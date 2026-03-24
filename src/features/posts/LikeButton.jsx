import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function LikeButton({ post, onLikeChange }) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(post.likes_count || 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data))
  }, [user, post.id])

  async function handleToggle() {
    if (!user || loading) return
    setLoading(true)

    const { data } = await supabase.rpc('toggle_like', {
      p_post_id: post.id,
      p_user_id: user.id,
    })

    if (data) {
      setLiked(data.liked)
      setCount(data.likes_count)
      onLikeChange?.(data.likes_count)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!user || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
        liked
          ? 'bg-red-50 border-red-300 text-red-600'
          : 'bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'
      } disabled:opacity-50 disabled:cursor-default`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  )
}
