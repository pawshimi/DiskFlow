import { useEffect, useState } from 'react'
import DiskChart from '../../shared/DiskChart.jsx'
import StepTable from '../../shared/StepTable.jsx'
import InputForm from '../../shared/InputForm.jsx'
import ModeTabs from '../../shared/ModeTabs.jsx'
import { COLORS, DEFAULTS, parseInputs, totalMovement } from '../../shared/utils.js'
import { scan } from './scan.js'

// Halaman SCAN (tampilan grafik): simulasi langkah demi langkah dengan grafik garis dan titik
export default function SCANGraph() {
  const [form, setForm] = useState(DEFAULTS)
  const [res, setRes] = useState(null)
  const [step, setStep] = useState(1) // jumlah titik yang sudah tampil
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const { reqs, head, max } = parseInputs(form)
      setRes({ path: scan(reqs, head, max, form.dir), max, n: reqs.length })
      setStep(1); setPlaying(true); setError('')
    } catch (e) { setError(e.message) }
  }

  useEffect(() => {
    if (!playing || !res) return
    if (step >= res.path.length) { setPlaying(false); return }
    const id = setTimeout(() => setStep((s) => s + 1), 600)
    return () => clearTimeout(id)
  }, [playing, step, res])

  const last = res ? res.path.length : 0
  const total = res ? totalMovement(res.path) : 0

  return (
    <section>
      <h1>SCAN <small>Algoritma Elevator</small></h1>
      <ModeTabs base="/scan" />
      <p className="lead">Head bergerak ke satu arah sambil melayani semua request di jalurnya sampai ujung disk, lalu berbalik arah dan melayani sisanya.</p>
      <div className="two">
        <div><h3>Kelebihan</h3><ul><li>Tidak ada starvation</li><li>Variasi waktu tunggu lebih rendah dari SSTF</li></ul></div>
        <div><h3>Kekurangan</h3><ul><li>Head tetap ke ujung disk walau tidak ada request di sana</li><li>Request yang baru dilewati harus menunggu sapuan balik</li></ul></div>
      </div>

      <InputForm form={form} setForm={setForm} useDir={true} />
      <div className="controls">
        <button className="primary" onClick={run}>▶ Jalankan</button>
        <button disabled={!res} onClick={() => { setPlaying(false); setStep(1) }}>⏮ Awal</button>
        <button disabled={!res} onClick={() => { setPlaying(false); setStep((s) => Math.max(1, s - 1)) }}>◀ Mundur</button>
        <button disabled={!res} onClick={() => { setPlaying(false); setStep((s) => Math.min(last, s + 1)) }}>Maju ▶</button>
        <button disabled={!res} onClick={() => { if (step >= last) setStep(1); setPlaying((p) => !p) }}>
          {playing ? '⏸ Jeda' : '⏯ Putar'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {!res && !error && <p className="empty">Atur input lalu klik “Jalankan”.</p>}
      {res && (
        <>
          <div className="metrics">
            <div><small>Total head movement</small><b>{total}</b></div>
            <div><small>Rata-rata / request</small><b>{(total / res.n).toFixed(2)}</b></div>
            <div><small>Langkah</small><b>{step - 1} / {last - 1}</b></div>
          </div>
          <DiskChart series={[{ name: 'SCAN', path: res.path, color: COLORS['SCAN'] }]}
            max={res.max} count={step} title="Pergerakan Head Disk - SCAN" />
          <StepTable path={res.path} step={step} />
        </>
      )}
    </section>
  )
}
