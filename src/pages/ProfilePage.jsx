import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('posts')
      .select('*, categories(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold">{profile?.username || 'Loading...'}</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        {profile?.role === 'admin' && (
          <span className="mt-2 inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded">
            Admin
          </span>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">My Posts ({posts.length})</h2>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't posted yet.{' '}
          <Link to="/posts/new" className="text-blue-600 hover:underline">Share your first experience!</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <Link key={post.id} to={`/posts/${post.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{post.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {post.categories?.name && <span className="mr-2">{post.categories.name}</span>}
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-sm text-gray-500">❤️ {post.likes_count}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
