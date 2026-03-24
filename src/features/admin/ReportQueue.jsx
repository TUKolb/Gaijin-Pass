import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ReportQueue() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('reports')
      .select('*, profiles!reporter_id(username), posts(title), comments(content)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReports(data || [])
        setLoading(false)
      })
  }, [])

  async function handleResolve(reportId) {
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
    setReports(reports.filter(r => r.id !== reportId))
  }

  async function handleDeleteContent(report) {
    if (report.post_id) {
      await supabase.from('posts').delete().eq('id', report.post_id)
    }
    if (report.comment_id) {
      await supabase.from('comments').delete().eq('id', report.comment_id)
    }
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', report.id)
    setReports(reports.filter(r => r.id !== report.id))
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Pending Reports ({reports.length})</h2>

      {reports.length === 0 ? (
        <p className="text-gray-500">No pending reports.</p>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="bg-white border border-gray-200 rounded p-4">
              <div className="text-sm text-gray-500 mb-1">
                Reported by: <span className="font-medium">{report.profiles?.username}</span>
                {' · '}{new Date(report.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm mb-1">
                {report.post_id && <span className="text-blue-700">Post: "{report.posts?.title}"</span>}
                {report.comment_id && <span className="text-purple-700">Comment: "{report.comments?.content}"</span>}
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 rounded p-2 mb-3">
                Reason: {report.reason}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleResolve(report.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                  Dismiss
                </button>
                <button onClick={() => handleDeleteContent(report)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                  Delete Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
