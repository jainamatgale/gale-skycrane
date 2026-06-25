import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { db, ensureSeedData } from '../db'
import type { User } from '../types'

type AuthContextValue = {
  currentUser: User | null
  isReady: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const sessionStorageKey = 'gale_skycrane_session_user_id'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const bootstrap = async () => {
      await ensureSeedData()
      const userId = window.localStorage.getItem(sessionStorageKey)
      if (userId) {
        const existingUser = await db.users.get(userId)
        if (existingUser) {
          setCurrentUser(existingUser)
        }
      }
      setIsReady(true)
    }

    void bootstrap()
  }, [])

  const login = async (email: string, password: string) => {
    const user = await db.users.where('email').equalsIgnoreCase(email.trim()).first()
    if (!user || user.password !== password) {
      return false
    }

    setCurrentUser(user)
    window.localStorage.setItem(sessionStorageKey, user.id)
    return true
  }

  const logout = () => {
    window.localStorage.removeItem(sessionStorageKey)
    setCurrentUser(null)
  }

  const value = useMemo(
    () => ({
      currentUser,
      isReady,
      login,
      logout,
    }),
    [currentUser, isReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
