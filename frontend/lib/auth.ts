import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-hackathon'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  return token
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const result = jwt.verify(token, JWT_SECRET) as { userId: string }
    return result
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }
  
  return payload.userId
}
