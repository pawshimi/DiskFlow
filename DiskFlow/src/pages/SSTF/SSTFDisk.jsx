import { useEffect, useRef, useState } from 'react'
import DiskScene from '../../shared/DiskScene.jsx'
import InputForm from '../../shared/InputForm.jsx'
import ModeTabs from '../../shared/ModeTabs.jsx'
import { DEFAULTS, parseInputs } from '../../shared/utils.js'
import { sstf } from './sstf.js'

// Overlay SSTF: jarak live dari head ke tiap request tersisa, yang terdekat disorot
const overlay = ({ X, CY, pos, reached, path }) => {
  const pending = path.filter((p, i) => i > reached && p.req)
  if (!pending.length) return null
  const near = pending.reduce((b, p) => (Math.abs(p.cyl - pos) < Math.abs(b.cyl - pos) ? p : b), pending[0])
  return (
    <g>
      {pending.map((p, i) => (
        <text key={i} x={X(p.cyl)} y={CY - 20 - (i % 2) * 13} textAnchor="middle"
          className={p === near ? 'ov-next' : 'ov-txt'}>{Math.round(Math.abs(p.cyl - pos))}</text>
      ))}
      <line x1={X(pos)} x2={X(near.cyl)} y1={CY - 52} y2={CY - 52}
        stroke="#e67e22" strokeDasharray="5 4" strokeWidth="2" />
    </g>
  )
}

// Halaman SSTF (animasi disk): head bergerak di dalam piringan yang berputar
export default function SSTFDisk() {
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
      const path = sstf(reqs, head, max, form.dir)
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
      <h1>SSTF <small>Shortest Seek Time First</small></h1>
      <ModeTabs base="/sstf" />
      <p className="lead">Angka di atas piringan adalah jarak head ke tiap request yang tersisa, dan terus berubah saat head bergerak. Head selalu menuju angka terkecil (warna oranye).</p>
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
