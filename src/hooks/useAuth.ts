'use client'

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || '로그인에 실패했습니다')
    }

    await fetchUser()
  }

  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || '회원가입에 실패했습니다')
    }

    return res.json()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isSeller: user?.role === 'seller',
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    refresh: fetchUser,
  }
}
