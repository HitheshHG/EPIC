import Footer from "../components/Footer"

export default function About() {
  const profile = {
    name: "Hithesh HG",
    role: "Web Developer",
    photo: "/favicon.ico",
    linkedin: "https://linkedin.com/in/gurudattajr",
    x: "https://x.com/gurudattajr",
    location: "Karnataka, India"
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.2)_0%,_rgba(255,255,255,0.02)_60%,_transparent_70%)]" />
        <div className="absolute -bottom-48 -right-48 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-25 bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(255,255,255,0.12)_0%,_rgba(255,255,255,0.02)_60%,_transparent_80%,_rgba(255,255,255,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />
      </div>

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
          <h1 className="text-4xl md:text-5xl tracking-tight">About EPIC</h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            EPIC is a serene space to learn and read the Bhagavad Gita with clean typography, accurate transliteration, and faithful translations that honor tradition.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 grid lg:grid-cols-3 gap-8 items-start pb-16">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border border-white/10">
                <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 text-xl">{profile.name}</div>
              <div className="text-sm text-white/60">{profile.role}</div>
              <div className="mt-2 text-sm text-white/60">{profile.location}</div>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.76h5V24H0V8.76zM7.5 8.76H12v2.08h.07c.63-1.2 2.17-2.48 4.47-2.48 4.78 0 5.66 3.14 5.66 7.22V24h-5v-6.96c0-1.66-.03-3.79-2.31-3.79-2.31 0-2.66 1.8-2.66 3.67V24h-5V8.76z" />
                  </svg>
                </a>
                <a
                  href={profile.x}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
                  aria-label="X"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2H21l-6.5 7.43L22.5 22H15.93l-5.09-6.65L4.84 22H2l7.03-8.02L1.5 2h6.75l4.58 6.04L18.244 2zM16.8 20h1.72L7.28 4H5.5l11.3 16z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl">Why EPIC</h2>
              <p className="mt-3 text-white/70">
                EPIC centers scripture with a modern, respectful canvas where reading the Gita is clear, quiet, and immersive without distractions.
              </p>
              <p className="mt-2 text-white/70">
                The interface curates Sanskrit, transliteration, and translation side‑by‑side to support careful study and effortless navigation.
              </p>
              <p className="mt-2 text-white/70">
                The aim is to uphold cultural heritage through typography, layout, and fidelity to text so study feels purposeful and unrushed.
              </p>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/60">Reading</div>
                <div className="mt-2 text-lg">Scripture‑first</div>
                <p className="mt-2 text-sm text-white/60">
                  Sanskrit with transliteration and translation in a steady, readable rhythm.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/60">Study</div>
                <div className="mt-2 text-lg">Clarity & flow</div>
                <p className="mt-2 text-sm text-white/60">
                  Clean hierarchy and spacing to follow verses without friction.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-white/60">Heritage</div>
                <div className="mt-2 text-lg">Tradition‑honoring</div>
                <p className="mt-2 text-sm text-white/60">
                  Minimal, monochrome design that keeps meaning and culture at the center.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
