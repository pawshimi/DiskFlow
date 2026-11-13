import { useEffect, useRef, useState } from 'react'
import DiskScene from '../../shared/DiskScene.jsx'
import InputForm from '../../shared/InputForm.jsx'
import ModeTabs from '../../shared/ModeTabs.jsx'
import { DEFAULTS, parseInputs } from '../../shared/utils.js'
import { fcfs } from './fcfs.js'

// Overlay FCFS: nomor urut antrian di atas tiap request + garis ke target berikutnya
const overlay = ({ X, CY, pos, reached, path }) => {
  const next = path[reached + 1]
  return (
    <g>
      {path.map((p, i) => i > reached && p.req && (
        <text key={i} x={X(p.cyl)} y={CY - 20 - (i % 2) * 13} textAnchor="middle"
          className={i === reached + 1 ? 'ov-next' : 'ov-txt'}>#{i}</text>
      ))}
      {next && (
        <line x1={X(pos)} x2={X(next.cyl)} y1={CY - 52} y2={CY - 52}
          stroke="#e67e22" strokeDasharray="5 4" strokeWidth="2" />
      )}
    </g>
  )
}

// Halaman FCFS (animasi disk): head bergerak di dalam piringan yang berputar
export default function FCFSDisk() {
  const [form, setForm] = useState(DEFAULTS)
  const [res, setRes] = useState(null)
  const [d, setD] = useState(0) // jarak yang sudah ditempuh head
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [error, setError] = useState('')
  const dRef = useRef(0)
  const speedRef = useRef(5)
  speedRef.current = speed

  const run = () => {
    try {
      const { reqs, head, max } = parseInputs(form)
      const path = fcfs(reqs, head, max, form.dir)
      const cum = [0]
      path.forEach((p, i) => i && cum.push(cum[i - 1] + Math.abs(p.cyl - path[i - 1].cyl)))
      dRef.current = 0; setD(0)
      setRes({ path, cum, max, n: reqs.length, total: cum[cum.length - 1] })
      setPlaying(true); setError('')
    } catch (e) { setError(e.message) }
  }

  useEffect(() => {
    if (!playing || !res) return
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      dRef.current = Math.min(res.total, dRef.current + dt * speedRef.current * (res.max / 6))
      setD(dRef.current)
      if (dRef.current >= res.total) { setPlaying(false); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, res])

  const toggle = () => {
    if (res && dRef.current >= res.total) { dRef.current = 0; setD(0) }
    setPlaying((p) => !p)
  }
  const replay = () => { dRef.current = 0; setD(0); setPlaying(true) }

  let reached = 0, pos = 0, served = 0
  if (res) {
    reached = res.cum.filter((c) => c <= d).length - 1
    const k = Math.min(reached, res.path.length - 2)
    const seg = res.cum[k + 1] - res.cum[k]
    const f = seg ? (d - res.cum[k]) / seg : 1
    pos = res.path[k].cyl + (res.path[k + 1].cyl - res.path[k].cyl) * f
    served = res.path.filter((p, i) => i > 0 && i <= reached && p.req).length
  }

  return (
    <section>
      <h1>FCFS <small>First Come First Served</small></h1>
      <ModeTabs base="/fcfs" />
      <p className="lead">Lihat langsung dari dalam disk: piringan berputar dan head hanya mengikuti nomor urut antrian (#1, #2, ...), walau itu berarti bolak-balik jauh antar track.</p>
      <InputForm form={form} setForm={setForm} useDir={false} />
      <div className="controls">
        <button className="primary" onClick={run}>▶ Jalankan</button>
        <button disabled={!res} onClick={toggle}>{playing ? '⏸ Jeda' : '⏯ Putar'}</button>
        <button disabled={!res} onClick={replay}>↺ Ulangi</button>
        <label className="speed">Kecepatan: {speed}
          <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      {!res && !error && <p className="empty">Atur input lalu klik “Jalankan”.</p>}
      {res && (
        <>
          <div className="metrics">
            <div><small>Jarak ditempuh</small><b>{Math.round(d)} / {res.total}</b></div>
            <div><small>Request terlayani</small><b>{served} / {res.n}</b></div>
            <div><small>Posisi head</small><b>{Math.round(pos)}</b></div>
          </div>
          <DiskScene path={res.path} max={res.max} pos={pos} reached={reached}
            spinning={playing} overlay={overlay} />
          <h3>Urutan layanan</h3>
          <div className="chips">
            {res.path.map((p, i) => i > 0 && p.req && (
              <span key={i} className={`chip ${i <= reached ? 'done' : ''}`}>{i <= reached ? '✓ ' : ''}{p.cyl}</span>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
