import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  httpOnly: false, // Allow client-side access
}

export const cookieUtils = {
  setToken(token: string) {
    Cookies.set('auth-token', token, COOKIE_OPTIONS)
  },

  getToken(): string | undefined {
    if (typeof window === 'undefined') return undefined
    try {
      const token = Cookies.get('auth-token')
      return token
    } catch (error) {
      return undefined
    }
  },

  removeToken() {
    Cookies.remove('auth-token', { path: '/' })
  },

  setUser(user: any) {
    // Store only user ID to avoid cookie size limits
    // Full user data will be fetched from API when needed
    const userInfo = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
    Cookies.set('auth-user', JSON.stringify(userInfo), COOKIE_OPTIONS)
  },

  getUser(): any | null {
    try {
      if (typeof window === 'undefined') return null
      const user = Cookies.get('auth-user')
      return user ? JSON.parse(user) : null
    } catch (error) {
      return null
    }
  },

  removeUser() {
    Cookies.remove('auth-user', { path: '/' })
  },

  clearAuth() {
    this.removeToken()
    this.removeUser()
  }
}
