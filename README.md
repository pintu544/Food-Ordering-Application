# Skoob Food Ordering Application

A Next.js-based food ordering application with role-based access control (RBAC) and location-based restrictions featuring a modern, responsive UI with glass morphism design.

## Features

- **Role-Based Access Control**: Admin, Manager, and Member roles with different permissions
- **Location-Based Access**: Country-specific data access (India/America)
- **Food Ordering System**: Browse restaurants, create orders, checkout, and manage payments
- **User Management**: Predefined users with specific roles and locations
- **Modern UI/UX**: Glass morphism design with smooth animations and responsive layout
- **Real-time Statistics**: Dashboard with live order and restaurant counts

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Prisma ORM with SQLite
- NextAuth.js for authentication
- Tailwind CSS for styling
- Modern CSS animations and transitions

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Database**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Access Application**
Open [http://localhost:3000](http://localhost:3000)

## Available Pages

- `/` - Enhanced Dashboard with statistics and role-based navigation (All users)
- `/restaurants` - Browse restaurants and create orders with modern cart interface (All users)
- `/orders` - View and manage orders with advanced filtering (All users, filtered by permissions)
- `/payment` - Manage payment methods with beautiful table design (Admin only)
- `/auth/signin` - Elegant sign-in page with user selection

## UI Features

- **Glass Morphism Design**: Modern translucent cards with backdrop blur effects
- **Gradient Backgrounds**: Beautiful color transitions throughout the application
- **Smooth Animations**: Hover effects, scale transforms, and loading animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Enhanced buttons, cards, and navigation with visual feedback
- **Role-based Styling**: Different visual indicators for Admin, Manager, and Member roles

## User Accounts

The application comes with predefined users:

| User | Role | Country | Email |
|------|------|---------|-------|
| Nick Fury | Admin | America | nick.fury@shield.com |
| Captain Marvel | Manager | India | captain.marvel@shield.com |
| Captain America | Manager | America | captain.america@shield.com |
| Thanos | Member | India | thanos@shield.com |
| Thor | Member | India | thor@shield.com |
| Travis | Member | America | travis@shield.com |

## Access Control Matrix

| Function | Admin | Manager | Member |
|----------|-------|---------|--------|
| View restaurants & menu | ✅ | ✅ | ✅ |
| Create order | ✅ | ✅ | ✅ |
| Place order (checkout) | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Update payment method | ✅ | ❌ | ❌ |

## Location-Based Access

- **Admin**: Can access data from all countries
- **Manager/Member**: Can only access data from their assigned country

## API Endpoints

- `GET /api/users` - Get all users (Admin only)
- `GET /api/restaurants` - Get restaurants (filtered by country)
- `GET /api/orders` - Get orders (filtered by role and country)
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Cancel order
- `PUT /api/users/[id]/payment` - Update payment method (Admin only)

## Troubleshooting

### Common Issues

1. **Prisma Client Error**: Run `npx prisma generate` after any schema changes
2. **Database Issues**: Delete `prisma/dev.db` and run setup commands again
3. **Module Not Found**: Ensure `tsconfig.json` has correct path mappings
4. **NextAuth Error**: Verify `.env.local` has `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
5. **UI Rendering Issues**: Clear browser cache and restart development server

### Reset Database
```bash
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Performance Optimization
```bash
# Build optimized version
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── users/        # User management APIs
│   │   ├── restaurants/  # Restaurant APIs
│   │   └── orders/       # Order management APIs
│   ├── auth/             # Authentication pages
│   ├── restaurants/      # Restaurant browsing
│   ├── orders/           # Order management
│   ├── payment/          # Payment management (Admin)
│   ├── page.tsx          # Dashboard
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
├── lib/                  # Utilities and configurations
├── prisma/              # Database schema and seeds
├── types/               # TypeScript type definitions
└── .env          # Environment variables
```

## Development

- Run `npm run dev` for development
- Run `npm run build` for production build
- Run `npm run db:studio` to view database
- Run `npm run db:seed` to reset and seed database
