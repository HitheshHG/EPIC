import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { supabase } from "../lib/supabaseClient"
import { signOut } from "../lib/auth"
import { getDisplayName } from "../lib/userName"
import Stories from "./Stories"

export default function Dashboard() {
  const [displayName, setDisplayName] = useState(null)

  useEffect(() => {
    async function checkUser() {
      // Clean up hash from URL more thoroughly
      if (window.location.hash) {
        const cleanUrl = window.location.protocol + '//' + 
                        window.location.host + 
                        window.location.pathname + 
                        window.location.search
        window.history.replaceState(null, '', cleanUrl)
      }

      // Handle OAuth callback parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const searchParams = new URLSearchParams(window.location.search)
      
      if (hashParams.get('access_token') || searchParams.get('code')) {
        // OAuth callback detected, let Supabase handle the session
        const { data, error } = await supabase.auth.getSession()
        if (data?.session?.user) {
          // Clear URL parameters after successful auth
          window.history.replaceState(null, '', '/dashboard')
        }
      }

      const { data, error } = await supabase.auth.getSession()
      const user = data?.session?.user ?? null
      const isGuest = localStorage.getItem("guest") === "1"

      if (user) {
        localStorage.removeItem("guest")
        const name = user.user_metadata?.full_name || user.email || await getDisplayName()
        setDisplayName(name || "User")
        return
      }

      if (isGuest) {
        setDisplayName("Guest")
        return
      }

      // Redirect to landing page if no valid session
      window.location.assign("/")
    }

    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const name = session.user.user_metadata?.full_name || 
                    session.user.email || 
                    "User"
        setDisplayName(name)
        // Ensure clean URL after sign in
        if (window.location.hash || window.location.search.includes('code=')) {
          window.history.replaceState(null, '', '/dashboard')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
