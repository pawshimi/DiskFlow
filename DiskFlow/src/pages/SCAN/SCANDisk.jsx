import { useEffect, useRef, useState } from 'react'
import DiskView from '../../share/DiskView.jsx'
import InputForm from '../../share/InputForm.jsx'
import ModeTabs from '../../share/ModeTabs.jsx'
import { DEFAULTS, parseInputs } from '../../share/utils.js'
import { scan } from './scan.js'

// Overlay SCAN: panah arah sapuan + garis putus-putus menuju ujung disk
const overlay = ({ X, CY, pos, reached, path }) => {
  const next = path[reached + 1]
  const endIdx = path.findIndex((p, i) => i > 0 && !p.req)
  const end = endIdx > reached ? path[endIdx] : null
  if (!next) return null
  const inward = next.cyl > pos // silinder naik = menuju poros (kiri layar)
  return (
    <g>
      <text x={X(pos)} y={CY - 58} textAnchor="middle" className="ov-next">
        {inward ? '◀◀◀ menuju poros' : 'menuju tepi luar ▶▶▶'}
      </text>
      {end && (
        <line x1={X(pos)} x2={X(end.cyl)} y1={CY - 40} y2={CY - 40}
          stroke="#2980b9" strokeDasharray="5 4" strokeWidth="2" />
      )}
    </g>
  )
}

// Halaman SCAN (animasi disk): head bergerak di dalam piringan yang berputar
export default function SCANDisk() {
  const [form, setForm] = useState(DEFAULTS)
  const [res, setRes] = useState(null)
  const [d, setD] = useState(0) // jarak yang sudah ditempuh head
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [rpm, setRpm] = useState(7200) // kecepatan putar piringan
  const [error, setError] = useState('')
  const dRef = useRef(0)
  const speedRef = useRef(5)
  speedRef.current = speed

  const run = () => {
    try {
      const { reqs, head, max } = parseInputs(form)
      const path = scan(reqs, head, max, form.dir)
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
      const dt = Math.max(0, (now - last) / 1000) // timestamp rAF bisa sedikit lebih kecil dari performance.now()
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
    reached = Math.max(0, res.cum.filter((c) => c <= d).length - 1)
    const k = Math.min(reached, res.path.length - 2)
    const seg = res.cum[k + 1] - res.cum[k]
    const f = seg ? (d - res.cum[k]) / seg : 1
    pos = res.path[k].cyl + (res.path[k + 1].cyl - res.path[k].cyl) * f
    served = res.path.filter((p, i) => i > 0 && i <= reached && p.req).length
  }

  return (
    <section>
      <h1>SCAN <small>Algoritma Elevator</small></h1>
      <ModeTabs base="/scan" />
      <p className="lead">Head menyapu seperti lift: terus ke satu arah sampai ujung disk (garis biru putus-putus), lalu berbalik dan melayani request yang tertinggal.</p>
      <InputForm form={form} setForm={setForm} useDir={true} />
      <div className="controls">
        <button className="primary" onClick={run}>▶ Jalankan</button>
        <button disabled={!res} onClick={toggle}>{playing ? '⏸ Jeda' : '⏯ Putar'}</button>
        <button disabled={!res} onClick={replay}>↺ Ulangi</button>
        <label className="speed">Kecepatan: {speed}
          <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
        <label className="rpm">Putaran piringan
          <select value={rpm} onChange={(e) => setRpm(Number(e.target.value))}>
            <option value={5400}>5400 RPM</option>
            <option value={7200}>7200 RPM</option>
            <option value={10000}>10000 RPM</option>
          </select>
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
          <DiskView path={res.path} max={res.max} pos={pos} reached={reached}
            spinning={playing} overlay={overlay} rpm={rpm} />
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
