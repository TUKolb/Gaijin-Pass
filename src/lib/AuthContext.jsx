import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, username) => {
    // TODO: Implement sign up logic
    // 1. supabase.auth.signUp({ email, password })
    // 2. Insert user profile row with username
    throw new Error('Not implemented')
  }

  const signIn = async (email, password) => {
    // TODO: Implement sign in logic
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    throw new Error('Not implemented')
  }

  const signOut = async () => {
    // TODO: Implement sign out
    // await supabase.auth.signOut()
    throw new Error('Not implemented')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
