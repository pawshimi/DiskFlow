import { useState } from 'react'
import { Link } from 'react-router-dom'
import InputForm from '../../shared/InputForm.jsx'
import DiskChart from '../../shared/DiskChart.jsx'
import { COLORS, DEFAULTS, parseInputs, totalMovement } from '../../shared/utils.js'
import { fcfs } from '../FCFS/fcfs.js'
import { sstf } from '../SSTF/sstf.js'
import { scan } from '../SCAN/scan.js'

const ALGOS = { FCFS: fcfs, SSTF: sstf, SCAN: scan }
const MENU = [
  ['/fcfs', 'FCFS', 'First Come First Served: layani request sesuai urutan datang.'],
  ['/sstf', 'SSTF', 'Shortest Seek Time First: selalu pilih request terdekat dari head.'],
  ['/scan', 'SCAN', 'Head menyapu ke satu ujung disk, lalu berbalik arah.'],
]

// Halaman Beranda: pilih metode + perbandingan metrik efisiensi antar algoritma
export default function Home() {
  const [form, setForm] = useState(DEFAULTS)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const compare = () => {
    try {
      const { reqs, head, max } = parseInputs(form)
      const rows = Object.entries(ALGOS).map(([name, fn]) => {
        const path = fn(reqs, head, max, form.dir)
        return { name, path, total: totalMovement(path) }
      })
      setData({ rows, max, n: reqs.length }); setError('')
    } catch (e) { setError(e.message) }
  }

  const sorted = data && [...data.rows].sort((a, b) => a.total - b.total)
  const best = sorted && sorted[0].total
  const worst = sorted && sorted[sorted.length - 1].total

  return (
    <section>
      <h1>DiskFlow</h1>
      <p className="lead">
        Simulator interaktif penjadwalan disk. Visualisasikan pergerakan head disk, hitung total
        head movement secara otomatis, dan bandingkan efisiensi FCFS, SSTF, dan SCAN.
        Pilih metode yang ingin kamu pelajari:
      </p>
      <div className="cards">
        {MENU.map(([to, title, desc]) => (
          <Link key={to} to={to} className="card">
            <h3>{title}</h3>
            <p>{desc}</p>
            <span>Buka →</span>
          </Link>
        ))}
      </div>

      <h2 style={{ marginTop: 36 }}>Perbandingan Efisiensi</h2>
      <p className="lead">Jalankan ketiga algoritma pada input yang sama, lalu lihat mana yang paling efisien.</p>
      <InputForm form={form} setForm={setForm} useDir />
      <div className="controls"><button className="primary" onClick={compare}>📊 Bandingkan</button></div>
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          <table>
            <thead><tr><th>Algoritma</th><th>Total Head Movement</th><th>Rata-rata / Request</th><th>Selisih vs Terbaik</th></tr></thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.name} className={r.total === best ? 'best' : ''}>
                  <td>{r.name}</td><td>{r.total}</td><td>{(r.total / data.n).toFixed(2)}</td>
                  <td>{r.total === best ? 'Terbaik ✓' : `+${r.total - best} (+${(((r.total - best) / best) * 100).toFixed(1)}%)`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total Head Movement (makin pendek makin efisien)</h3>
          {sorted.map((r) => (
            <div className="bar-row" key={r.name}>
              <span className="bar-name">{r.name}</span>
              <div className="bar" style={{ width: `${(r.total / worst) * 75}%`, background: COLORS[r.name] }} />
              <span>{r.total}{r.total === best ? ' ★' : ''}</span>
            </div>
          ))}
          <h3>Grafik Pergerakan (ketiga algoritma)</h3>
          <DiskChart max={data.max} title="Perbandingan jalur head"
            series={data.rows.map((r) => ({ name: r.name, path: r.path, color: COLORS[r.name] }))} />
        </>
      )}
    </section>
  )
}
