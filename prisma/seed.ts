import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data in correct order (respecting foreign key constraints)
    console.log('Clearing existing data...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.menuItem.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.user.deleteMany()

    console.log('Creating users...')
    // Create users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'nick.fury@shield.com',
          name: 'Nick Fury',
          role: 'ADMIN',
          country: 'AMERICA',
          paymentMethod: 'Credit Card'
        }
      }),
      prisma.user.create({
        data: {
          email: 'captain.marvel@shield.com',
          name: 'Captain Marvel',
          role: 'MANAGER',
          country: 'INDIA',
          paymentMethod: 'UPI'
        }
      }),
      prisma.user.create({
        data: {
          email: 'captain.america@shield.com',
          name: 'Captain America',
          role: 'MANAGER',
          country: 'AMERICA',
          paymentMethod: 'Credit Card'
        }
      }),
      prisma.user.create({
        data: {
          email: 'thanos@shield.com',
          name: 'Thanos',
          role: 'MEMBER',
          country: 'INDIA',
          paymentMethod: 'UPI'
        }
      }),
      prisma.user.create({
        data: {
          email: 'thor@shield.com',
          name: 'Thor',
          role: 'MEMBER',
          country: 'INDIA',
          paymentMethod: 'Credit Card'
        }
      }),
      prisma.user.create({
        data: {
          email: 'travis@shield.com',
          name: 'Travis',
          role: 'MEMBER',
          country: 'AMERICA'
        }
      })
    ])

    console.log('Creating restaurants...')
    // Create restaurants
    const restaurants = await Promise.all([
      prisma.restaurant.create({
        data: {
          name: 'Spice Garden',
          description: 'Authentic Indian Cuisine',
          country: 'INDIA'
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'Burger Palace',
          description: 'American Fast Food',
          country: 'AMERICA'
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'Curry House',
          description: 'Traditional Indian Food',
          country: 'INDIA'
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'Pizza Corner',
          description: 'New York Style Pizza',
          country: 'AMERICA'
        }
      })
    ])

    console.log('Creating menu items...')
    // Create menu items - Add more items for better testing
    await Promise.all([
      // Spice Garden (India) items
      prisma.menuItem.create({
        data: {
          name: 'Butter Chicken',
          description: 'Creamy tomato curry with chicken',
          price: 299,
          restaurantId: restaurants[0].id
        }
      }),
      prisma.menuItem.create({
        data: {
          name: 'Biryani',
          description: 'Fragrant rice with spices and meat',
          price: 399,
          restaurantId: restaurants[0].id
        }
      }),
      prisma.menuItem.create({
        data: {
          name: 'Naan Bread',
          description: 'Fresh baked Indian bread',
          price: 59,
          restaurantId: restaurants[0].id
        }
      }),
      // Burger Palace (America) items
      prisma.menuItem.create({
        data: {
          name: 'Classic Burger',
          description: 'Beef patty with lettuce and tomato',
          price: 12.99,
          restaurantId: restaurants[1].id
        }
      }),
      prisma.menuItem.create({
        data: {
          name: 'Chicken Wings',
          description: 'Spicy buffalo wings',
          price: 9.99,
          restaurantId: restaurants[1].id
        }
      }),
      prisma.menuItem.create({
        data: {
          name: 'French Fries',
          description: 'Crispy golden fries',
          price: 5.99,
          restaurantId: restaurants[1].id
        }
      }),
      // Curry House (India) items
      prisma.menuItem.create({
        data: {
          name: 'Dal Tadka',
          description: 'Yellow lentils with spices',
          price: 199,
          restaurantId: restaurants[2].id
        }
      }),
      prisma.menuItem.create({
        data: {
          name: 'Paneer Tikka',
          description: 'Grilled cottage cheese with spices',
          price: 249,
          restaurantId: restaurants[2].id
        }
      }),
      // Pizza Corner (America) items
      prisma.menuItem.create({
        data: {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato and mozzarella',
          price: 14.99,
          restaurantId: restaurants[3].id
        }
      }),
      prisma.menuItem.create({
        data: {
          name: 'Pepperoni Pizza',
          description: 'Pizza with pepperoni and cheese',
          price: 16.99,
          restaurantId: restaurants[3].id
        }
      })
    ])

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
