import GuidebookManager from '../features/admin/GuidebookManager'
import ReportQueue from '../features/admin/ReportQueue'

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <GuidebookManager />
      <ReportQueue />
    </div>
  )
}
