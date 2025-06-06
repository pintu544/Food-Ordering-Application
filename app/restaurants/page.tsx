// @ts-nocheck
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RestaurantsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState([])
  const [cart, setCart] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchRestaurants()
    }
  }, [session, status])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (menuItemId) => {
    setCart(prev => ({
      ...prev,
      [menuItemId]: (prev[menuItemId] || 0) + 1
    }))
  }

  const removeFromCart = (menuItemId) => {
    setCart(prev => ({
      ...prev,
      [menuItemId]: Math.max(0, (prev[menuItemId] || 0) - 1)
    }))
  }

  const createOrder = async () => {
    const items = Object.entries(cart)
      .filter(([_, quantity]) => quantity > 0)
      .map(([menuItemId, quantity]) => {
        const menuItem = restaurants
          .flatMap(r => r.menuItems)
          .find(item => item.id === menuItemId)
        return {
          menuItemId,
          quantity,
          price: menuItem?.price || 0
        }
      })

    if (items.length === 0) {
      alert('Please add items to cart')
      return
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalAmount })
      })

      if (response.ok) {
        alert('Order created successfully!')
        setCart({})
        router.push('/orders')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert('Error creating order')
    }
  }

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Restaurants & Menu</h1>
          {Object.values(cart).some(qty => qty > 0) && (
            <button
              onClick={createOrder}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Order (₹{Object.entries(cart).reduce((sum, [itemId, qty]) => {
                const item = restaurants.flatMap(r => r.menuItems).find(i => i.id === itemId)
                return sum + (item?.price || 0) * qty
              }, 0).toFixed(2)})
            </button>
          )}
        </div>

        <div className="grid gap-6">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.description}</p>
                <span className="text-sm text-blue-600">📍 {restaurant.country}</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurant.menuItems.map(item => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">₹{item.price}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-500 text-white w-8 h-8 rounded"
                          >
                            -
                          </button>
                          <span>{cart[item.id] || 0}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="bg-green-500 text-white w-8 h-8 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
