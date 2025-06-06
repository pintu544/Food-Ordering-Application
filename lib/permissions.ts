export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER'
export type Country = 'INDIA' | 'AMERICA'

export interface User {
  id: string
  role: Role
  country: Country
}

export const permissions = {
  viewRestaurants: (user: User) => true,
  createOrder: (user: User) => true,
  placeOrder: (user: User) => user.role === 'ADMIN' || user.role === 'MANAGER',
  cancelOrder: (user: User) => user.role === 'ADMIN' || user.role === 'MANAGER',
  updatePaymentMethod: (user: User) => user.role === 'ADMIN',
  
  // Location-based permissions
  accessCountryData: (user: User, dataCountry: Country) => {
    if (user.role === 'ADMIN') return true
    return user.country === dataCountry
  }
}

export function hasPermission(user: User, action: keyof typeof permissions, ...args: any[]) {
  const permissionFn = permissions[action] as (...args: any[]) => boolean
  return permissionFn(user, ...args)
}

// Helper functions for validation
export const VALID_ROLES: Role[] = ['ADMIN', 'MANAGER', 'MEMBER']
export const VALID_COUNTRIES: Country[] = ['INDIA', 'AMERICA']
export const VALID_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERED', 'CANCELLED']

export function isValidRole(role: string): role is Role {
  return VALID_ROLES.includes(role as Role)
}

export function isValidCountry(country: string): country is Country {
  return VALID_COUNTRIES.includes(country as Country)
}

export function isValidOrderStatus(status: string): boolean {
  return VALID_ORDER_STATUSES.includes(status)
}
