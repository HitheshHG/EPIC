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
    const { data } = await supabase.auth.getSession()
    const user = data?.session?.user ?? null
    const isGuest = localStorage.getItem("guest") === "1"

    if (user) {
      localStorage.removeItem("guest")
      const name = await getDisplayName()
      setDisplayName(name || "User")
      return
    }

    if (isGuest) {
      setDisplayName("Guest")
      return
    }
    window.location.assign("/")
  }

  checkUser()
}, [])


  useEffect(() => {
    async function load() {
      const name = await getDisplayName()
      if (name) setDisplayName(name)
    }
    load()
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
