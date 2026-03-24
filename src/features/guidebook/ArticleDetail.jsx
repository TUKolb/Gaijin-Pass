import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import ChecklistItem from './ChecklistItem'

export default function ArticleDetail() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [{ data: cat }, { data: arts }] = await Promise.all([
        supabase.from('categories').select('*').eq('id', categoryId).single(),
        supabase.from('guidebook_articles')
          .select('*')
          .eq('category_id', categoryId)
          .order('order'),
      ])
      setCategory(cat)
      setArticles(arts || [])
      setLoading(false)
    }
    fetchData()
  }, [categoryId])

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>
  if (!category) return <div className="text-center py-8 text-red-500">Category not found</div>

  return (
    <div>
      <Link to="/guidebook" className="text-blue-600 hover:underline text-sm">← Back to Guidebook</Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{category.name}</h1>

      {articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          No articles yet for this category.
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">{article.title}</h2>
              {article.content && (
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{article.content}</p>
              )}
              {article.checklist_items?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Checklist:</h3>
                  <ul className="space-y-1">
                    {article.checklist_items.map((item, i) => (
                      <ChecklistItem key={i} text={item} storageKey={`checklist-${article.id}-${i}`} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
