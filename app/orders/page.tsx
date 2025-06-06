// @ts-nocheck
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'

// Add a minimal Order type
interface Order {
  id: string
  status: string
  totalAmount: number
  paymentMethod: string | null
  country: string
  createdAt: string
  user: { name: string }
  orderItems: Array<{ quantity: number; price: number; menuItem: { name: string } }>
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  // specify type parameter to avoid `never[]`
  const [orders, setOrders] = useState(/** @type {Order[]} */ ([]))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchOrders()
    }
  }, [session, status])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchOrders()
        alert('Order status updated successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert('Error updating order status')
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      })

      if (response.ok) {
        fetchOrders()
        alert('Order cancelled successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert('Error cancelling order')
    }
  }

  const user = session ? {
    id: session.user.id,
    role: session.user.role,
    country: session.user.country
  } : null

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/')} className="text-xl font-semibold">
                ← Skoob Food Ordering
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session?.user.name} ({session?.user.role}) - {session?.user.country}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                  <p className="text-gray-600">Customer: {order.user.name}</p>
                  <p className="text-gray-600">Country: {order.country}</p>
                  <p className="text-gray-600">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">₹{order.totalAmount}</p>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <ul className="space-y-1">
                  {order.orderItems.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item.quantity}x {item.menuItem.name} - ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {user && (
                <div className="flex space-x-2">
                  {hasPermission(user, 'placeOrder') && order.status === 'PENDING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Confirm Order
                    </button>
                  )}
                  
                  {hasPermission(user, 'cancelOrder') && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
