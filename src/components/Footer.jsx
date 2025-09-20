export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
        <div className="text-white/60 text-sm">© {new Date().getFullYear()} EPIC</div>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <a href="/terms" className="hover:text-white transition">Terms</a>
          <a href="/privacy" className="hover:text-white transition">Privacy</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  )
}
