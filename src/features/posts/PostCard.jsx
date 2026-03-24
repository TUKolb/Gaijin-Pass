import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition">
      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full h-40 object-cover rounded mb-3" />
      )}
      <div className="flex items-center gap-2 mb-2">
        {post.categories && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {post.categories.name}
          </span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{post.title}</h2>
      <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>❤️ {post.likes_count}</span>
        <span>by {post.profiles?.username || 'Anonymous'}</span>
      </div>
    </Link>
  )
}
