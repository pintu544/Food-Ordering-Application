'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({ orders: 0, restaurants: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const [ordersRes, restaurantsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/restaurants')
      ])
      
      if (ordersRes.ok && restaurantsRes.ok) {
        const orders = await ordersRes.json()
        const restaurants = await restaurantsRes.json()
        setStats({ orders: orders.length, restaurants: restaurants.length })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your food ordering experience</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role
  const userName = session.user.name
  const userCountry = session.user.country

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Skoob Food Ordering</h1>
                  <p className="text-sm text-gray-500">Your premium food delivery platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-lg px-4 py-2 border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-600">{userRole} • {userCountry}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 inline-block mb-4">
            Welcome back, {userName}!
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Food Ordering Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your food orders, browse restaurants, and enjoy a seamless dining experience with role-based access control
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.restaurants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Location</p>
                <p className="text-2xl font-bold text-gray-900">{userCountry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Restaurants Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Available</div>
                <div className="text-xl font-bold text-gray-900">{stats.restaurants}</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Restaurants & Menu</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Discover amazing restaurants in your area. Browse menus, check prices, and add items to your cart.
            </p>
            <button
              onClick={() => router.push('/restaurants')}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Browse Restaurants</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-bold text-gray-900">{stats.orders}</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Order Management</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Track your orders, view order history, and manage your food deliveries. 
              {userRole === 'ADMIN' || userRole === 'MANAGER' ? ' Cancel orders and update statuses.' : ' View your order status.'}
            </p>
            <button
              onClick={() => router.push('/orders')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Manage Orders</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Payment Card - Admin Only */}
          {userRole === 'ADMIN' && (
            <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-600 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Admin</div>
                  <div className="text-xl font-bold text-gray-900">Only</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Methods</h3>
              <p className="text-gray-600 mb-4 text-sm">
                As an administrator, manage payment methods for all users across different countries.
              </p>
              <button
                onClick={() => router.push('/payment')}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Manage Payments</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Role Information */}
        <div className="mt-12 bg-blue-600 rounded-lg p-6 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Your Access Level</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">View restaurants & menu items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Create and add food items to orders</span>
                </div>
                {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Place orders and checkout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Cancel orders</span>
                    </div>
                  </>
                )}
                {userRole === 'ADMIN' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm">Update payment methods for all users</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="inline-block bg-white bg-opacity-20 rounded-lg px-4 py-3">
                <div className="text-2xl font-bold">{userRole}</div>
                <div className="text-blue-100 text-sm">Role Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
