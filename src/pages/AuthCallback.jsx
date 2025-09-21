import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Get session multiple times to ensure it's processed
        let session = null
        let attempts = 0
        const maxAttempts = 5
        
        while (!session && attempts < maxAttempts) {
          const { data, error } = await supabase.auth.getSession()
          session = data?.session
          
          if (!session) {
            await new Promise(resolve => setTimeout(resolve, 200))
            attempts++
          }
        }
        
        if (session?.user) {
          // Force navigation to dashboard with user data
          navigate('/dashboard', { replace: true, state: { user: session.user } })
        } else {
          // Check if there's an error in URL
          const urlParams = new URLSearchParams(window.location.search)
          const error = urlParams.get('error')
          
          if (error) {
            console.error('OAuth error:', error)
            navigate('/?error=auth_failed', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        }
      } catch (err) {
        console.error('Auth callback exception:', err)
        navigate('/?error=auth_failed', { replace: true })
      } finally {
        setIsProcessing(false)
      }
    }

    handleAuthCallback()
  }, [navigate])

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Completing sign in...</div>
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return null
}
