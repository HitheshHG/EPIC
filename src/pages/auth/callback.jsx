import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          window.location.assign('/?error=auth_failed')
          return
        }

        if (data?.session?.user) {
          // Clean redirect to dashboard
          window.location.assign('/dashboard')
        } else {
          // No session found, redirect to landing
          window.location.assign('/')
        }
      } catch (err) {
        console.error('Auth callback exception:', err)
        window.location.assign('/?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg mb-4">Completing sign in...</div>
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  )
}
