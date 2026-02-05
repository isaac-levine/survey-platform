import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-900">Cendara</div>
          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="redirect">
                <button className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition shadow-md">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                Dashboard
              </button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl text-center">
          <h1 className="text-6xl font-bold text-indigo-900 mb-6">
            Cendara Survey Platform
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Create, distribute, and analyze surveys with ease. Build powerful forms,
            gather insights, and make data-driven decisions.
          </p>
          <SignedOut>
            <div className="flex gap-4 justify-center">
              <SignUpButton mode="redirect">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition shadow-lg">
                  Get Started
                </button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 font-semibold text-lg transition shadow-lg border-2 border-indigo-600">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition shadow-lg"
            >
              Go to Dashboard
            </button>
          </SignedIn>
        </div>
      </main>
    </div>
  )
}
