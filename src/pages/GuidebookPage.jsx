import { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'

// ─── Placeholder data (replace with Supabase queries) ───────────────────────
const PLACEHOLDER_CATEGORIES = [
  { id: 1, name: 'Administrative Registration', icon: '🏛️' },
  { id: 2, name: 'Daily Living',                icon: '🏠' },
  { id: 3, name: 'Transportation',              icon: '🚃' },
  { id: 4, name: 'Healthcare',                  icon: '🏥' },
  { id: 5, name: 'Banking & Money',             icon: '💴' },
  { id: 6, name: 'Social Life',                 icon: '🤝' },
]

const PLACEHOLDER_CHECKLIST = [
  { id: 1, category_id: 1, title: 'Register at your local ward office (住民登録)', done: false },
  { id: 2, category_id: 1, title: 'Obtain your Residence Card (在留カード)',       done: false },
  { id: 3, category_id: 2, title: 'Set up utilities (electricity, gas, water)',    done: false },
  { id: 4, category_id: 2, title: 'Register for National Health Insurance',        done: false },
  { id: 5, category_id: 3, title: 'Get a Suica / IC transit card',                 done: false },
  { id: 6, category_id: 5, title: 'Open a Japanese bank account',                  done: false },
]

export default function GuidebookPage() {
  const [categories, setCategories]   = useState(PLACEHOLDER_CATEGORIES)
  const [checklist, setChecklist]     = useState(PLACEHOLDER_CHECKLIST)
  const [activeCategory, setActive]   = useState(null)
  const [loading, setLoading]         = useState(false)

  // TODO: fetch categories and articles from Supabase
  // useEffect(() => {
  //   async function load() {
  //     setLoading(true)
  //     const { data } = await supabase.from('guidebook_categories').select('*')
  //     setCategories(data ?? [])
  //     setLoading(false)
  //   }
  //   load()
  // }, [])

  const visibleItems = activeCategory
    ? checklist.filter(i => i.category_id === activeCategory)
    : checklist

  const toggle = (id) => {
    // TODO: persist checklist state per-user in Supabase or localStorage
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  return (
    <div>
      <h1 className="page-title">Guidebook</h1>
      <p className="page-subtitle">Browse topics and work through your setup checklist.</p>

      {/* Category filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button
          className={`btn btn-sm ${!activeCategory ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActive(null)}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActive(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Checklist */}
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>📋 Checklist</h2>
        {loading && <p>Loading…</p>}
        {!loading && visibleItems.length === 0 && (
          <div className="empty-state"><p>No items in this category yet.</p></div>
        )}
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleItems.map(item => (
            <li
              key={item.id}
              style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              onClick={() => toggle(item.id)}
            >
              <span style={{
                width: 20, height: 20, borderRadius: 4,
                border: '2px solid var(--border)',
                background: item.done ? 'var(--red)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.15s'
              }}>
                {item.done && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}
              </span>
              <span style={{
                textDecoration: item.done ? 'line-through' : 'none',
                color: item.done ? 'var(--ink-faint)' : 'var(--ink)',
                fontSize: '0.95rem'
              }}>
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder: Guidebook Articles */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>📄 Articles</h2>
        <div className="empty-state card">
          <p>Guidebook articles will appear here.</p>
          <p style={{ fontSize: '0.85rem' }}>
            Connect Supabase and populate the <code>guidebook_articles</code> table to see content.
          </p>
        </div>
      </div>
    </div>
  )
}
