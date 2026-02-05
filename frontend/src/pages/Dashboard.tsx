import { UserButton, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useUser()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-indigo-900 hover:text-indigo-700 transition"
          >
            Cendara
          </button>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your survey platform is ready. Start creating surveys and gathering insights.
          </p>
          <div className="bg-white rounded-lg shadow-md p-12 max-w-2xl mx-auto">
            <div className="text-gray-500">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-indigo-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-medium text-gray-700">
                Dashboard content coming soon
              </p>
              <p className="mt-2 text-gray-500">
                This is where you'll manage your surveys, view responses, and analyze data.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
