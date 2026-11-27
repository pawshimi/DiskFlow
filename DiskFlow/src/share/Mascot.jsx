import { useEffect, useRef, useState } from 'react'

const LINES = [
  'Halo! Aku Diska 🌸 Yuk belajar penjadwalan disk bareng!',
  'FCFS itu kayak antre di kantin: yang datang duluan dilayani duluan!',
  'SSTF selalu pilih yang paling dekat. Cepat sih, tapi hati-hati starvation ya~',
  'SCAN mirip lift: naik sampai ujung dulu, baru turun lagi!',
  'Total head movement = jumlah jarak yang ditempuh head disk.',
  'Klik aku lagi dong! 💕',
]

// Ikon kecil untuk navbar dan tombol chat
export function MascotIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#f29ab8" />
      <ellipse cx="32" cy="37" rx="20" ry="19" fill="#ffe8da" />
      <path d="M12 34 C10 14 26 6 34 6 C48 6 56 18 52 34 C46 24 40 20 32 19 C24 22 18 28 12 34Z" fill="#f7a8c4" />
      <circle cx="24" cy="38" r="4.2" fill="#6cc4d8" /><circle cx="40" cy="38" r="4.2" fill="#6cc4d8" />
      <circle cx="23" cy="36.5" r="1.4" fill="#fff" /><circle cx="39" cy="36.5" r="1.4" fill="#fff" />
      <path d="M28 47 Q32 51 36 47" stroke="#c46a85" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Maskot "Diska" (karakter orisinal): mata mengikuti kursor, berkedip, bergoyang sendiri,
// bicara otomatis, dan bereaksi saat diklik. Isi prop `image` untuk memakai gambar sendiri.
export default function Mascot({ size = 380, talkEvery = 9000, image }) {
  const wrap = useRef(null)
  const timer = useRef(null)
  const idx = useRef(0)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const [say, setSay] = useState(LINES[0])
  const [talking, setTalking] = useState(true)
  const [happy, setHappy] = useState(false)

  const speak = (text, ms = 3800) => {
    setSay(text); setTalking(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setTalking(false), ms)
  }
  const next = () => { idx.current = (idx.current + 1) % LINES.length; speak(LINES[idx.current]) }
  const poke = () => { setHappy(true); setTimeout(() => setHappy(false), 1200); next() }

  useEffect(() => {
    const move = (e) => {
      const r = wrap.current?.getBoundingClientRect()
      if (!r) return
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)
      const dy = (e.clientY - (r.top + r.height * 0.45)) / (window.innerHeight / 2)
      setLook({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) })
    }
    window.addEventListener('pointermove', move)
    speak(LINES[0])
    const id = setInterval(next, talkEvery)
    return () => { window.removeEventListener('pointermove', move); clearInterval(id); clearTimeout(timer.current) }
  }, [])

  const tilt = { transform: `translate(${look.x * 5}px, ${look.y * 3}px) rotate(${look.x * 2}deg)`, transformOrigin: '150px 240px', transition: 'transform .2s' }
  const gaze = { transform: `translate(${look.x * 6}px, ${look.y * 5}px)`, transition: 'transform .12s' }

  return (
    <div ref={wrap} className={`mascot${happy ? ' happy' : ''}`} style={{ width: size }} onClick={poke}
      role="button" tabIndex={0} aria-label="Diska, maskot DiskFlow">
      <div className={`bubble${talking ? ' show' : ''}`}>{say}</div>
      <span className="spark s1">✦</span><span className="spark s2">✿</span><span className="spark s3">✦</span>
      <div className="mascot-blob" />
      {image ? <img className="mascot-svg m-bob" src={image} alt="" draggable="false" /> : (
        <svg viewBox="0 0 300 380" className="mascot-svg">
          <g className="m-bob">
            <g className="m-hair-back">
              <path d="M42 190 C22 92 88 24 150 24 C212 24 278 92 258 190 C254 262 240 312 214 346 L86 346 C60 312 46 262 42 190Z" fill="#f29ab8" />
            </g>
            <path d="M62 380 C62 318 98 292 150 292 C202 292 238 318 238 380Z" fill="#a9dfc3" />
            <path d="M120 292 Q150 326 180 292 L172 288 Q150 308 128 288Z" fill="#fff" />
            <path d="M136 314 L133 348 M164 314 L167 348" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <rect x="132" y="236" width="36" height="62" rx="16" fill="#fde0cf" />
            <g style={tilt}>
              <path d="M64 150 C44 214 54 276 82 318 C72 262 80 206 96 172Z" fill="#f29ab8" />
              <path d="M236 150 C256 214 246 276 218 318 C228 262 220 206 204 172Z" fill="#f29ab8" />
              <ellipse cx="150" cy="168" rx="80" ry="86" fill="#ffe8da" />
              <ellipse cx="100" cy="206" rx="16" ry="9" fill="#ffb3c6" opacity=".7" />
              <ellipse cx="200" cy="206" rx="16" ry="9" fill="#ffb3c6" opacity=".7" />
              <path d="M88 147 Q110 136 132 144" stroke="#d77a9c" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M168 144 Q190 136 212 147" stroke="#d77a9c" strokeWidth="4" fill="none" strokeLinecap="round" />
              {[112, 188].map((cx) => (
                <g key={cx}>
                  {happy ? (
                    <path d={`M${cx - 18} 184 Q${cx} 160 ${cx + 18} 184`} stroke="#8a4b63" strokeWidth="5" fill="none" strokeLinecap="round" />
                  ) : (
                    <>
                      <ellipse cx={cx} cy="178" rx="21" ry="25" fill="#fff" />
                      <g style={gaze}>
                        <ellipse cx={cx} cy="180" rx="15" ry="20" fill="#6cc4d8" />
                        <ellipse cx={cx} cy="173" rx="15" ry="11" fill="#4aa9c4" opacity=".55" />
                        <ellipse cx={cx} cy="182" rx="7" ry="10" fill="#27506b" />
                        <circle cx={cx - 5} cy="172" r="5" fill="#fff" />
                        <circle cx={cx + 5} cy="188" r="2.5" fill="#fff" />
                      </g>
                      <ellipse className="m-lid" cx={cx} cy="178" rx="22" ry="26" fill="#ffe8da" />
                      <path d={`M${cx - 24} 160 Q${cx} 150 ${cx + 24} 160`} stroke="#8a4b63" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </>
                  )}
                </g>
              ))}
              <path d="M148 202 q2 3 4 0" stroke="#e7a58d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {happy
                ? <path d="M132 216 Q150 246 168 216Z" fill="#c75b7a" />
                : talking
                  ? <ellipse className="m-mouth" cx="150" cy="224" rx="9" ry="7" fill="#c75b7a" />
                  : <path d="M138 222 Q150 232 162 222" stroke="#c46a85" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
              <path d="M66 156 C64 78 112 44 150 44 C190 44 238 78 234 156 C214 120 192 98 160 92 C150 118 120 138 66 156Z" fill="#f7a8c4" />
              <path d="M150 46 C146 78 128 112 96 138 C118 124 138 112 150 92 C160 106 182 122 214 134 C186 112 164 84 150 46Z" fill="#f5b9d0" opacity=".9" />
              <path className="m-ahoge" d="M150 46 C138 18 168 8 162 32" stroke="#f29ab8" strokeWidth="7" fill="none" strokeLinecap="round" />
              <circle cx="92" cy="96" r="14" fill="#e3f0f5" stroke="#8fb5c2" strokeWidth="3" />
              <circle cx="92" cy="96" r="4.5" fill="#fff" stroke="#8fb5c2" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}
    </div>
  )
}
