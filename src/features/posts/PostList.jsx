import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import PostCard from './PostCard'

export default function PostList() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select('*, categories(name), profiles(username)')

      if (selectedCategory) query = query.eq('category_id', selectedCategory)

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else {
        query = query.order('likes_count', { ascending: false })
      }

      const { data } = await query
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [selectedCategory, sortBy])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Experience Posts</h1>
          <p className="text-gray-600 mt-1">Community tips from people who've been there</p>
        </div>
        {user && (
          <Link to="/posts/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm text-center">
            + Share Experience
          </Link>
        )}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts yet. {user ? <Link to="/posts/new" className="text-blue-600 hover:underline">Be the first to share!</Link> : 'Login to share your experience.'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
