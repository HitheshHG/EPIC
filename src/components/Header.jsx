import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="relative z-10">
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              role="img"
              aria-label="EPIC logo"
            >
              <defs>
                <radialGradient id="g" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                </radialGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="url(#g)" />
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-white/80"
              />
            </svg>
          </span>
          <span className="text-lg tracking-wide">EPIC</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm text-white/70">
          <Link to="/about" className="hover:text-white transition">About</Link>
        </nav>
      </div>
    </header>
  )
}
