// @ts-nocheck
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// User type definition using JSDoc comments for type checking
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} country
 * @property {string|null} paymentMethod
 */

export default function PaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [newPaymentMethod, setNewPaymentMethod] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      if (session.user.role !== 'ADMIN') {
        router.push('/')
        return
      }
      fetchUsers()
    }
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentMethod = async (userId) => {
    if (!newPaymentMethod.trim()) {
      alert('Please enter a payment method')
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: newPaymentMethod })
      })

      if (response.ok) {
        alert('Payment method updated successfully!')
        setEditingUser(null)
        setNewPaymentMethod('')
        fetchUsers()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert('Error updating payment method')
    }
  }

  const startEditing = (userId, currentPaymentMethod) => {
    setEditingUser(userId)
    setNewPaymentMethod(currentPaymentMethod || '')
  }

  const cancelEditing = () => {
    setEditingUser(null)
    setNewPaymentMethod('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-600 border-r-purple-600 mx-auto"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-indigo-300 opacity-30"></div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
            <p className="text-lg font-medium text-gray-700">Loading payment data...</p>
            <p className="text-sm text-gray-500">Securing your financial information</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Navigation with Glass Effect */}
      <nav className="backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/')} 
                className="group flex items-center text-xl font-bold text-gray-800 hover:text-indigo-600 transition-all duration-300 hover:scale-105"
              >
                <div className="mr-3 p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Skoob Food Ordering
                </span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg">
                <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  👑 {session?.user.name} • {session?.user.role} • {session?.user.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Enhanced Header Section with Floating Elements */}
        <div className="relative mb-8">
          {/* Background Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                      Payment Method Management
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  As an <span className="font-semibold text-indigo-600">Administrator</span>, you have comprehensive control over user payment methods across all geographical regions. Manage financial preferences with enterprise-grade security.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-sm font-medium opacity-90">Total Users</div>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <div className="text-xs opacity-75 mt-1">Active Accounts</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-sm font-medium opacity-90">Payment Methods</div>
                  <div className="text-3xl font-bold">{users.filter(u => u.paymentMethod).length}</div>
                  <div className="text-xs opacity-75 mt-1">Configured</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Table with Modern Card Design */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 hover:shadow-3xl transition-all duration-500">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  User Payment Information
                </h3>
                <p className="text-indigo-100 text-sm mt-1">Manage financial preferences for all team members</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-white text-sm font-medium">Real-time Updates</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b border-gray-200">
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span>User Details</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span>Role & Access</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span>Location</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <span>Payment Method</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                      <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                  <tr key={user.id} className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-r ${
                            user.role === 'ADMIN' ? 'from-purple-400 to-purple-600' :
                            user.role === 'MANAGER' ? 'from-blue-400 to-blue-600' :
                            'from-green-400 to-green-600'
                          } flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="ml-5">
                          <div className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{user.name}</div>
                          <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                        user.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-2 border-purple-300' :
                        user.role === 'MANAGER' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300' :
                        'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300'
                      } group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                        <span className="mr-2 text-lg">
                          {user.role === 'ADMIN' ? '👑' : user.role === 'MANAGER' ? '🔧' : '👤'}
                        </span>
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {user.country === 'INDIA' ? '🇮🇳' : '🇺🇸'}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{user.country}</div>
                          <div className="text-xs text-gray-500">Geographic Region</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {editingUser === user.id ? (
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="text"
                              value={newPaymentMethod}
                              onChange={(e) => setNewPaymentMethod(e.target.value)}
                              className="w-48 px-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white shadow-lg"
                              placeholder="Enter payment method"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {user.paymentMethod || 'Not configured'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.paymentMethod ? 'Active Payment Method' : 'Setup Required'}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      {editingUser === user.id ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updatePaymentMethod(user.id)}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save</span>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(user.id, user.paymentMethod)}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group"
                        >
                          <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Footer Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-lg">Secure Payment Management</div>
                <div className="text-indigo-100 text-sm">All payment data is encrypted and secured</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-100">Last Updated</div>
              <div className="font-bold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
