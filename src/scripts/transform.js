// scripts/transform-gita.js
// Run: node scripts/transform-gita.js

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseCsv } from "csv-parse/sync"; // npm i csv-parse

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inFile = path.join(__dirname, "..", "data", "bhagavad_gita.csv");
const outFile = path.join(__dirname, "..", "data", "gita.json");

const csvText = fs.readFileSync(inFile, "utf8");

const rows = parseCsv(csvText, { columns: true, skip_empty_lines: true });

// "Chapter 1, Verse 4-6" -> { chapter: 1, verses: [4,5,6] }
function parseRef(ref = "") {
  const m = ref.match(/Chapter\s*(\d+)\s*,\s*Verse\s*([\d-]+)/i);
  if (!m) return null;
  const ch = Number(m[1]);
  const part = m[2].trim();
  if (part.includes("-")) {
    const [a, b] = part.split("-").map(s => Number(s.trim()));
    if (Number.isFinite(a) && Number.isFinite(b)) {
      const list = [];
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) list.push(i);
      return { chapter: ch, verses: list };
    }
  }
  const n = Number(part);
  return Number.isFinite(n) ? { chapter: ch, verses: [n] } : null;
}

function cleanSanskrit(s = "") {
  return s.replace(/\|\|\s*\d+(\s*-\s*\d+)?\s*\|\|/g, "").replace(/\s+/g, " ").trim();
}
const clean = s => (s || "").replace(/\s+/g, " ").trim();

const chaptersMap = new Map();
const seen = new Set();

for (const r of rows) {
  const ref = parseRef(r.verse_number || "");
  if (!ref) continue;

  const sanskrit = cleanSanskrit(r.verse_in_sanskrit || "");
  const translit = clean(r.sanskrit_verse_transliteration || "");
  const en = clean(r.translation_in_english || "");
  const enMeaning = (r.meaning_in_english || "").trim();
  const hi = (r.translation_in_hindi || "").trim();
  const hiMeaning = (r.meaning_in_hindi || "").trim();

  for (const vno of ref.verses) {
    const key = `${ref.chapter}-${vno}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (!chaptersMap.has(ref.chapter)) {
      chaptersMap.set(ref.chapter, {
        number: ref.chapter,
        title_english: "",
        title_sanskrit: "",
        verses: [],
      });
    }

    chaptersMap.get(ref.chapter).verses.push({
      number: vno,
      translation: en,
      transliteration: translit,
      sanskrit: sanskrit,
      meaningEn: enMeaning,
      translationHi: hi,
      meaningHi: hiMeaning,
    });
  }
}

const chapters = Array.from(chaptersMap.values())
  .map(ch => ({ ...ch, verses: ch.verses.sort((a, b) => a.number - b.number) }))
  .sort((a, b) => a.number - b.number);

fs.writeFileSync(outFile, JSON.stringify({ chapters }, null, 2), "utf8");

const verseCount = chapters.reduce((acc, ch) => acc + ch.verses.length, 0);
console.log({ chapters: chapters.length, verses: verseCount, outFile });
