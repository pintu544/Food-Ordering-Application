'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const predefinedUsers = [
  { email: 'nick.fury@shield.com', name: 'Nick Fury (Admin)' },
  { email: 'captain.marvel@shield.com', name: 'Captain Marvel (Manager-India)' },
  { email: 'captain.america@shield.com', name: 'Captain America (Manager-America)' },
  { email: 'thanos@shield.com', name: 'Thanos (Member-India)' },
  { email: 'thor@shield.com', name: 'Thor (Member-India)' },
  { email: 'travis@shield.com', name: 'Travis (Member-America)' }
]

export default function SignIn() {
  const [selectedEmail, setSelectedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    if (!selectedEmail) return

    setLoading(true)
    const result = await signIn('credentials', {
      email: selectedEmail,
      password: 'dummy', // In real app, use actual password
      redirect: false
    })

    if (result?.ok) {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Skoob
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select User
            </label>
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a user...</option>
              {predefinedUsers.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSignIn}
            disabled={!selectedEmail || loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
