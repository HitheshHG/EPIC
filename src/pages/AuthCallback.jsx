import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/?error=auth_failed', { replace: true })
          return
        }

        if (data?.session?.user) {
          // Clear any hash from URL and navigate to dashboard
          navigate('/dashboard', { replace: true })
        } else {
          // No session found, redirect to landing
          navigate('/', { replace: true })
        }
      } catch (err) {
        console.error('Auth callback exception:', err)
        navigate('/?error=auth_failed', { replace: true })
      }
    }

    // Small delay to ensure supabase has processed the URL
    const timeout = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timeout)
  }, [navigate])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg mb-4">Completing sign in...</div>
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  )
}
