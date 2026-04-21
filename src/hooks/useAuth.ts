'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import type { UserRole } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email! })

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setRole(profileData.role as UserRole)
        }
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! })
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (profileData) {
          setProfile(profileData)
          setRole(profileData.role as UserRole)
        }
      } else {
        setUser(null)
        setProfile(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, profile, role, loading }
}
