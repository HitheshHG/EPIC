import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { supabase } from "../lib/supabaseClient"
import { signOut } from "../lib/auth"
import { getDisplayName } from "../lib/userName"
import Stories from "./Stories"

export default function Dashboard() {
  const [displayName, setDisplayName] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function checkUser() {
      try {
        // Check if user data was passed from AuthCallback
        const userFromState = location.state?.user

        if (userFromState) {
          const name = userFromState.user_metadata?.full_name || userFromState.email || "User"
          setDisplayName(name)
          setLoading(false)
          return
        }

        // Otherwise check session normally
        const { data, error } = await supabase.auth.getSession()
        const user = data?.session?.user ?? null
        const isGuest = localStorage.getItem("guest") === "1"

        if (user) {
          localStorage.removeItem("guest")
          const name = user.user_metadata?.full_name || user.email || await getDisplayName()
          setDisplayName(name || "User")
          setLoading(false)
          return
        }

        if (isGuest) {
          setDisplayName("Guest")
          setLoading(false)
          return
        }

        // Redirect to landing page if no valid session
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Error checking user session:', error)
        navigate('/', { replace: true })
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session)

      if (event === 'SIGNED_IN' && session) {
        const name = session.user.user_metadata?.full_name ||
          session.user.email ||
          "User"
        setDisplayName(name)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem("guest")
        navigate('/', { replace: true })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, location.state])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Loading...</div>
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="h-full w-full bg-[url('/images/mahabharata-bg.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]"></div>
      </div>

      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 space-y-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Bhagavad Gita</div>
          <div className="mt-2 text-lg">{displayName ? `Welcome, ${displayName}` : "Loading..."}</div>
          <button
            onClick={signOut}
            type="button"
            className="mt-6 px-4 py-2 rounded-md bg-white text-black text-sm hover:bg-white/90 transition"
          >
            Sign out
          </button>
        </div>

        <div className="pt-2">
          <div className="text-sm text-white/60 mb-2">All Verses</div>
          <Stories embedded />
        </div>
      </main>

      <Footer />
    </div>
  )
}
