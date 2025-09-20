import { useRef, useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { signInWithGoogle } from "../lib/auth"

function fmt(t) {
  if (!Number.isFinite(t)) return "00:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function GitaReadPanel() {
  const [expanded, setExpanded] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">Bhagavad Gita • Chapter 1</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={showOriginal}
              aria-controls="gita-original"
              onClick={() => setShowOriginal(v => !v)}
              className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs hover:bg-white/10 transition"
            >
              {showOriginal ? "Hide original" : "Show original"}
            </button>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="gita-content"
              onClick={() => setExpanded(v => !v)}
              className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs hover:bg-white/10 transition"
            >
              {expanded ? "Collapse" : "Read"}
            </button>
          </div>
        </div>

        <div
          id="gita-content"
          className={[
            "mt-3 transition-[max-height] duration-300 ease-in-out",
            expanded ? "max-h-none overflow-visible" : "max-h-64 overflow-hidden"
          ].join(" ")}
        >
          <article className="space-y-6 text-sm leading-7 text-white/80">
            <div>
              <div className="text-xs text-white/60 mb-1">1.1</div>
              <p className="text-white/90">
                Dhritarashtra said: O Sanjaya, assembled on the holy field of Kurukshetra and eager for battle, what did my sons and the sons of Pandu do?
              </p>
              <div
                id="gita-original"
                className={showOriginal ? "mt-3 space-y-2" : "mt-3 hidden"}
              >
                <p className="whitespace-pre-wrap text-white/70">
                  dhṛtarāṣṭra uvāca: dharmakṣetre kurukṣetre samavetā yuyutsavaḥ |{"\n"}
                  māmakāḥ pāṇḍavāś caiva kim akurvata sañjaya || 1.1 ||
                </p>
                <p className="whitespace-pre-wrap text-white/60">
                  धृतराष्ट्र उवाच ।{"\n"}
                  धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।{"\n"}
                  मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ १-१॥
                </p>
              </div>
            </div>

            <div>
              <div className="text-xs text-white/60 mb-1">1.2</div>
              <p className="text-white/90">
                Sanjaya said: Seeing the Pandava army drawn up in formation, King Duryodhana approached his teacher and spoke.
              </p>
              <div className={showOriginal ? "mt-3 space-y-2" : "mt-3 hidden"}>
                <p className="whitespace-pre-wrap text-white/70">
                  sañjaya uvāca: dṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanas tadā |{"\n"}
                  ācāryam upasaṅgamya rājā vacanam abravīt || 1.2 ||
                </p>
                <p className="whitespace-pre-wrap text-white/60">
                  सञ्जय उवाच ।{"\n"}
                  दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा ।{"\n"}
                  आचार्यमुपसंगम्य राजा वचनमब्रवीत् ॥ १-२॥
                </p>
              </div>
            </div>

            <p className="text-white/60">
              The Bhagavad Gita spans 18 chapters and roughly 700 verses, opening with Arjuna’s despair on Kurukshetra before unfolding teachings on action, knowledge, and devotion.
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}

export default function Landing({ onGoogleSignIn = signInWithGoogle, onGuest = () => { localStorage.setItem("guest", "1"); window.location.assign("/dashboard"); } }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setCurrent(a.currentTime || 0)
    const onMeta = () => setDuration(a.duration || 0)
    const onEnd = () => setPlaying(false)
    const onErr = () => setError(true)
    a.addEventListener("timeupdate", onTime)
    a.addEventListener("loadedmetadata", onMeta)
    a.addEventListener("ended", onEnd)
    a.addEventListener("error", onErr)
    return () => {
      a.removeEventListener("timeupdate", onTime)
      a.removeEventListener("loadedmetadata", onMeta)
      a.removeEventListener("ended", onEnd)
      a.removeEventListener("error", onErr)
    }
  }, [])

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      const p = a.play()
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() => {
          setError(true)
          setPlaying(false)
        })
      } else {
        setPlaying(true)
      }
    }
  }

  const progressPct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.2)_0%,_rgba(255,255,255,0.02)_60%,_transparent_70%)]" />
        <div className="absolute -bottom-48 -right-48 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-25 bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(255,255,255,0.12)_0%,_rgba(255,255,255,0.02)_60%,_transparent_80%,_rgba(255,255,255,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />
      </div>

      <Header />

      <audio ref={audioRef} src="/audio/theme.mp3" preload="metadata" />

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Bhagavad Gita • Read & listen
              <span className="h-1 w-1 rounded-full bg-white/40" />
              Ad‑free focus
            </div>
            <h1 className="text-5xl md:text-6xl leading-[1.05] tracking-tight">
              EPIC - Bhagavad Gita
              <span className="block text-white/60">Read. Understand. Contemplate.</span>
            </h1>
            <p className="text-white/70 max-w-xl">
              A serene canvas presenting English translations first with optional original shlokas for focused study.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onGoogleSignIn}
                type="button"
                className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white text-black hover:bg-white/90 transition"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px]">
                  <svg viewBox="0 0 533.5 544.3" className="h-5 w-5">
                    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.3H272.1v95.1h146.9c-6.3 33.9-25 62.6-53.4 81.8v67h86.4c50.5-46.5 81.5-115.1 81.5-193.6z" />
                    <path fill="#34A853" d="M272.1 544.3c72.6 0 133.7-24 178.3-65.2l-86.4-67c-24 16.1-54.7 25.7-91.9 25.7-70.7 0-130.5-47.7-152-111.8h-89.5v70.2c44.2 87.7 134.9 148.1 241.5 148.1z" />
                    <path fill="#FBBC05" d="M120.1 326c-10.5-31.5-10.5-65.5 0-97l.1-70.2H30.7C-10.2 215.2-10.2 329 30.7 408.2L120.1 326z" />
                    <path fill="#EA4335" d="M272.1 107.7c39.5-.6 77.3 13.4 106.4 39.5l79.2-79.2C415.3 24.1 346.2-.3 272.1 0 165.6 0 74.9 60.4 30.7 148.1l89.4 70.9c21.5-64.1 81.3-111.3 152-111.3z" />
                  </svg>
                </span>
                <span className="text-sm font-medium">Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={onGuest}
                className="px-5 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
              >
                Browse as guest
              </button>
            </div>

            <GitaReadPanel />

            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Now Playing</span>
                  <span>{fmt(current)} / {fmt(duration)}</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                  <div className="h-1.5 rounded-full bg-white/70" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggle}
                    className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90 transition grid place-items-center"
                  >
                    {playing ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 5V19" />
                        <path d="M16 5V19" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 9L15 12L10 15V9Z" />
                        <path d="M8 9L13 12L8 15V9Z" />
                      </svg>
                    )}
                  </button>
                  <div className="ml-auto text-xs text-white/60">
                    {error ? "Audio unavailable" : "Ramayana Theme — Hans Zimmer"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img src="/images/krishna.jpeg" alt="Krishna and Arjuna" className="h-full w-full object-cover grayscale contrast-110" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/10" />
                <div className="flex-1">
                  <div className="text-sm">Ramayana (The Introduction Theme)</div>
                  <div className="text-xs text-white/60">Song by A. R. Rahman and Hans Zimmer</div>
                </div>
                <button type="button" onClick={toggle} className="px-3 py-2 rounded-md bg-white text-black text-xs hover:bg-white/90 transition">
                  {playing ? "Pause" : "Play"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/60">Shloka</div>
            <div className="mt-2 text-lg">Sanskrit/Hindi verse</div>
            <p className="mt-2 text-sm text-white/60">Original shloka in Devanagari for authentic recital and heritage.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/60">English</div>
            <div className="mt-2 text-lg">Translation with shloka</div>
            <p className="mt-2 text-sm text-white/60">Clear English meaning shown alongside the verse for understanding.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/60">Transliteration</div>
            <div className="mt-2 text-lg">Read and pronounce</div>
            <p className="mt-2 text-sm text-white/60">IAST/Latin transliteration to read the shloka accurately.</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
