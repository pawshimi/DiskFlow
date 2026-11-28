import { useEffect, useRef, useState } from 'react'
import { MascotIcon } from './Mascot.jsx'

// Diisi lewat file .env (lihat .env.example)
const RUN_URL = import.meta.env.VITE_LANGFLOW_URL
const API_KEY = import.meta.env.VITE_LANGFLOW_API_KEY

// Ambil teks balasan dari bentuk respons Langflow (beda versi bisa beda path)
function extractText(data) {
  const out = data?.outputs?.[0]?.outputs?.[0]
  return (
    out?.results?.message?.text ??
    out?.outputs?.message?.message ??
    out?.artifacts?.message ??
    out?.messages?.[0]?.message ??
    null
  )
}

// Chatbot melayang di pojok kanan bawah, terhubung ke flow Langflow
export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: 'Halo, aku Diska! Tanyakan apa saja soal penjadwalan disk (FCFS, SSTF, SCAN) 🌸' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const sessionId = useRef(crypto.randomUUID ? crypto.randomUUID() : String(Date.now()))
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setMsgs((m) => [...m, { from: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      if (!RUN_URL) throw new Error('VITE_LANGFLOW_URL belum diatur di file .env')
      const res = await fetch(RUN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(API_KEY ? { 'x-api-key': API_KEY } : {}) },
        body: JSON.stringify({
          input_value: text,
          input_type: 'chat',
          output_type: 'chat',
          session_id: sessionId.current,
        }),
      })
      if (!res.ok) throw new Error(`Langflow membalas dengan status ${res.status}`)
      const data = await res.json()
      setMsgs((m) => [...m, { from: 'bot', text: extractText(data) ?? 'Maaf, balasan tidak bisa dibaca.' }])
    } catch (e) {
      const msg = e instanceof TypeError ? 'Tidak bisa terhubung ke Langflow (cek URL atau pengaturan CORS).' : e.message
      setMsgs((m) => [...m, { from: 'bot', text: `⚠️ ${msg}`, error: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Buka chatbot">
        {open ? '✕' : <MascotIcon size={46} />}
      </button>
      {open && (
        <div className="chat-panel">
          <div className="chat-head">Asisten DiskFlow</div>
          <div className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}${m.error ? ' err' : ''}`}>{m.text}</div>
            ))}
            {loading && <div className="chat-msg bot">Sedang mengetik…</div>}
            <div ref={endRef} />
          </div>
          <div className="chat-input">
            <input value={input} placeholder="Tulis pertanyaan…" disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()} />
            <button className="primary" onClick={send} disabled={loading}>Kirim</button>
          </div>
        </div>
      )}
    </>
  )
}
