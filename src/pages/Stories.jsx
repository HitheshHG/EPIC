import { useEffect, useMemo, useState, useId } from "react"
import gita from "../data/gita.json"

function decodeLines(s = "") {
  return s.replace(/\r\n/g, "\n")
}

function stripDiacritics(s = "") {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function buildRows(data) {
  const chapters = Array.isArray(data?.chapters) ? data.chapters : []
  const rows = []
  for (const ch of chapters) {
    const list = Array.isArray(ch?.verses) ? ch.verses : []
    for (const v of list) {
      rows.push({
        chapter: ch.number,
        number: v.number,
        chapterTitleEn: ch.title_english || "",
        chapterTitleSa: ch.title_sanskrit || "",
        translation: decodeLines(v.translation || ""),
        transliteration: decodeLines(v.transliteration || ""),
        sanskrit: decodeLines(v.sanskrit || ""),
        meaningEn: decodeLines(v.meaningEn || ""),
        translationHi: decodeLines(v.translationHi || ""),
        meaningHi: decodeLines(v.meaningHi || ""),
      })
    }
  }
  rows.sort((a, b) => (a.chapter - b.chapter) || (a.number - b.number))
  return rows
}

function VerseIcon({ className = "" }) {
  const rid = useId()
  const gid = `g-${String(rid).replace(/[:]/g, "")}`
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.8" />
          <stop offset="1" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="10" fill="none" stroke="rgba(255,255,255,0.2)" />
      <circle cx="24" cy="16" r="6" fill={`url(#${gid})`} />
      <path d="M10 34c3-6 8-10 14-10s11 4 14 10" stroke={`url(#${gid})`} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30.5 14c0 1.7-1.4 3-3 3s-3-1.3-3-3 1.4-3 3-3" fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  )
}

function VerseCard({ item, onOpen }) {
  const preview =
    item.translation ||
    item.meaningEn ||
    item.translationHi ||
    item.meaningHi ||
    item.transliteration ||
    item.sanskrit ||
    "No content"
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <VerseIcon className="h-10 w-10 rounded-lg grayscale contrast-110 brightness-90" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white/60 truncate">
              Chapter {item.chapter} • Verse {item.number}
            </div>
            <div className="mt-1 text-xs text-white/50 truncate">
              {item.chapterTitleEn || item.chapterTitleSa || `Chapter ${item.chapter}`}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="px-3 py-2 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-sm transition"
          >
            Read
          </button>
        </div>
        <div className="mt-4 text-sm text-white/80 whitespace-pre-wrap max-h-28 overflow-hidden">
          {preview}
        </div>
      </div>
    </div>
  )
}

function Modal({ open, onClose, item }) {
  if (!open || !item) return null
  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verse-title"
      onClick={onBackdrop}
    >
      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <div
            className="relative rounded-2xl border border-white/10 bg-black/90 backdrop-blur p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 h-8 w-8 rounded-md bg-white text-black hover:bg-white/90 transition grid place-items-center"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

            <div className="pr-10">
              <h2 id="verse-title" className="text-2xl">
                Chapter {item.chapter} • Verse {item.number}
              </h2>
              <div className="mt-1 text-xs text-white/60">
                {item.chapterTitleEn || item.chapterTitleSa}
              </div>
            </div>

            <div className="mt-6 space-y-6 text-sm leading-7">
              {item.translation ? (
                <section>
                  <h3 className="text-white/80 font-medium">Translation (English)</h3>
                  <div className="mt-2 rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="text-white/90 whitespace-pre-wrap">{item.translation}</p>
                  </div>
                </section>
              ) : null}

              {item.meaningEn ? (
                <section className="pt-4 border-t border-white/10">
                  <h3 className="text-white/80 font-medium">Meaning (English)</h3>
                  <div className="mt-2 rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="text-white/80 whitespace-pre-wrap">{item.meaningEn}</p>
                  </div>
                </section>
              ) : null}

              {item.transliteration ? (
                <section className="pt-4 border-t border-white/10">
                  <h3 className="text-white/80 font-medium">Transliteration</h3>
                  <div className="mt-2 rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="text-white/80 whitespace-pre-wrap">{item.transliteration}</p>
                  </div>
                </section>
              ) : null}

              {item.sanskrit ? (
                <section className="pt-4 border-t border-white/10">
                  <h3 className="text-white/80 font-medium">Shloka (Devanagari)</h3>
                  <div className="mt-2 rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="whitespace-pre-wrap leading-8 font-serif">{item.sanskrit}</p>
                  </div>
                </section>
              ) : null}

              {item.translationHi ? (
                <section className="pt-4 border-t border-white/10">
                  <h3 className="text-white/80 font-medium">अनुवाद (Hindi)</h3>
                  <div className="mt-2 rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="text-white/80 whitespace-pre-wrap">{item.translationHi}</p>
                  </div>
                </section>
              ) : null}

              {item.meaningHi ? (
                <section className="pt-4 border-t border-white/10">
                  <h3 className="text-white/80 font-medium">भावार्थ (Hindi)</h3>
                  <div className="mt-2 rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="text-white/80 whitespace-pre-wrap">{item.meaningHi}</p>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pager({ page, pages, onPage }) {
  if (pages <= 1) return null
  const numbers = []
  const maxButtons = 7
  let start = Math.max(1, page - 3)
  let end = Math.min(pages, start + maxButtons - 1)
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)
  for (let i = start; i <= end; i++) numbers.push(i)
  return (
    <div className="flex items-center gap-2 justify-center">
      <button type="button" onClick={() => onPage(Math.max(1, page - 1))} className="px-3 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-sm">
        Prev
      </button>
      {start > 1 ? (
        <>
          <button type="button" onClick={() => onPage(1)} className="px-3 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-sm">1</button>
          <span className="text-white/40 px-1">…</span>
        </>
      ) : null}
      {numbers.map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onPage(n)}
          className={`px-3 py-1.5 rounded-md text-sm ${n === page ? "bg-white text-black" : "border border-white/15 bg-white/5 hover:bg-white/10"}`}
        >
          {n}
        </button>
      ))}
      {end < pages ? (
        <>
          <span className="text-white/40 px-1">…</span>
          <button type="button" onClick={() => onPage(pages)} className="px-3 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-sm">{pages}</button>
        </>
      ) : null}
      <button type="button" onClick={() => onPage(Math.min(pages, page + 1))} className="px-3 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-sm">
        Next
      </button>
    </div>
  )
}

export default function GitaExplorer({ embedded = false }) {
  const [q, setQ] = useState("")
  const [chapter, setChapter] = useState("all")
  const [perPage, setPerPage] = useState(25)
  const [page, setPage] = useState(1)
  const [active, setActive] = useState(null)

  useEffect(() => { setPage(1) }, [q, chapter, perPage])

  const allVerses = useMemo(() => buildRows(gita), [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const needlePlain = stripDiacritics(needle)
    return allVerses.filter(v => {
      if (chapter !== "all" && String(v.chapter) !== String(chapter)) return false
      if (!needle) return true
      const hay = [
        v.translation,
        v.meaningEn,
        v.translationHi,
        v.meaningHi,
        v.transliteration,
        v.sanskrit,
      ].join(" ").toLowerCase()
      const hayPlain = stripDiacritics(hay)
      return hay.includes(needle) || hayPlain.includes(needlePlain)
    })
  }, [allVerses, q, chapter])

  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const start = (page - 1) * perPage
  const slice = filtered.slice(start, start + perPage)

  return (
    <div className={embedded ? "" : "min-h-screen bg-black text-white relative"}>
      {!embedded && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="h-full w-full bg-[url('/images/mahabharata-bg.jpg')] bg-cover bg-center opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]"></div>
        </div>
      )}

      <div className={embedded ? "" : "mx-auto max-w-7xl px-6 py-12"}>
        {!embedded && (
          <div className="mb-4">
            <div className="text-sm text-white/60">Bhagavad Gita</div>
            <h1 className="mt-1 text-2xl">All Verses</h1>
          </div>
        )}

        <div className={`rounded-2xl border border-white/10 bg-white/5 ${embedded ? "mb-4" : "mb-6"} sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:backdrop-blur`}>
          <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search EN/HI translation, meaning, transliteration, or Sanskrit"
              className="w-full md:flex-1 px-3 py-2 rounded-md bg-black/40 border border-white/15 text-sm outline-none"
            />
            <div className="flex items-center gap-3">
              <select value={chapter} onChange={e => setChapter(e.target.value)} className="px-3 py-2 rounded-md bg-black/40 border border-white/15 text-sm">
                <option value="all">All chapters</option>
                {Array.from({ length: 18 }, (_, i) => i + 1).map(n => (<option key={n} value={n}>Chapter {n}</option>))}
              </select>
              <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className="px-3 py-2 rounded-md bg-black/40 border border-white/15 text-sm">
                {[25, 50, 75, 100].map(n => <option key={n} value={n}>{n}/page</option>)}
              </select>
            </div>
            <div className="text-xs text-white/60 md:ml-auto">
              {filtered.length} verses • Page {page} / {pages}
            </div>
          </div>
        </div>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slice.map(v => (
            <VerseCard key={`${v.chapter}-${v.number}`} item={v} onOpen={setActive} />
          ))}
        </section>

        <div className="mt-6">
          <Pager page={page} pages={pages} onPage={setPage} />
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} item={active} />
    </div>
  )
}
