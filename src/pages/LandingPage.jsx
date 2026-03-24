import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Gaijin Pass
      </h1>
      <p className="text-xl text-blue-600 font-medium mb-4">
        Your passport into a new life!
      </p>
      <p className="text-gray-600 max-w-lg mx-auto mb-10">
        Everything you need to know about living in Japan — step-by-step guides,
        checklists, and real experiences from people just like you.
      </p>

      <div className="flex justify-center gap-4 mb-16">
        <Link to="/guidebook"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
          Browse Guidebook
        </Link>
        <Link to="/posts"
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium">
          Read Experiences
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold mb-1">Step-by-Step Guides</h3>
          <p className="text-sm text-gray-600">Clear checklists for ward office, banking, and more.</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold mb-1">Community Tips</h3>
          <p className="text-sm text-gray-600">Real stories and advice from fellow residents.</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold mb-1">English First</h3>
          <p className="text-sm text-gray-600">No Japanese required to get started.</p>
        </div>
      </div>

      {!user && (
        <div className="mt-12">
          <p className="text-gray-600 mb-4">Ready to share your experience?</p>
          <Link to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
            Create Free Account
          </Link>
        </div>
      )}
    </div>
  )
}
