import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function GuidebookManager() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', checklist_items: '', order: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  useEffect(() => {
    if (!selectedCategory) return
    supabase.from('guidebook_articles')
      .select('*')
      .eq('category_id', selectedCategory.id)
      .order('order')
      .then(({ data }) => setArticles(data || []))
  }, [selectedCategory])

  function parseChecklist(text) {
    return text.split('\n').map(s => s.trim()).filter(Boolean)
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      category_id: selectedCategory.id,
      title: form.title,
      content: form.content,
      checklist_items: parseChecklist(form.checklist_items),
      order: Number(form.order),
    }

    let result
    if (editingArticle) {
      result = await supabase.from('guidebook_articles').update(payload).eq('id', editingArticle.id)
    } else {
      result = await supabase.from('guidebook_articles').insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      setShowForm(false)
      setEditingArticle(null)
      setForm({ title: '', content: '', checklist_items: '', order: 0 })
      const { data } = await supabase.from('guidebook_articles')
        .select('*').eq('category_id', selectedCategory.id).order('order')
      setArticles(data || [])
    }
    setSaving(false)
  }

  async function handleDelete(articleId) {
    if (!confirm('Delete this article?')) return
    await supabase.from('guidebook_articles').delete().eq('id', articleId)
    setArticles(articles.filter(a => a.id !== articleId))
  }

  function startEdit(article) {
    setEditingArticle(article)
    setForm({
      title: article.title,
      content: article.content,
      checklist_items: (article.checklist_items || []).join('\n'),
      order: article.order,
    })
    setShowForm(true)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Guidebook Manager</h2>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat); setShowForm(false) }}
            className={`px-3 py-1 rounded border text-sm ${
              selectedCategory?.id === cat.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">{selectedCategory.name}</h3>
            <button
              onClick={() => { setShowForm(true); setEditingArticle(null); setForm({ title: '', content: '', checklist_items: '', order: 0 }) }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              + New Article
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSave} className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 space-y-3">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Checklist Items (one per line)</label>
                <textarea rows={3} value={form.checklist_items} onChange={e => setForm({ ...form, checklist_items: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder={"Bring your passport\nFill out registration form\nGet a stamp"} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })}
                  className="w-24 border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  {saving ? 'Saving...' : editingArticle ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {articles.map(article => (
              <div key={article.id} className="bg-white border border-gray-200 rounded p-4 flex justify-between items-start">
                <div>
                  <div className="font-medium">{article.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {article.checklist_items?.length || 0} checklist items · order: {article.order}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(article)}
                    className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
