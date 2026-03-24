import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id')

      if (error) setError(error.message)
      else setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Guidebook</h1>
      <p className="text-gray-600 mb-6">Step-by-step guides for life in Japan</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/guidebook/${category.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
            <p className="text-sm text-blue-600 mt-1">View guides →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
