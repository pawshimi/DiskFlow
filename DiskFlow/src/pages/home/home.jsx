import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../../share/Mascot.jsx'
import InputForm from '../../share/InputForm.jsx'
import DiskChart from '../../share/DiskChart.jsx'
import { COLORS, DEFAULTS, parseInputs, totalMovement } from '../../share/utils.js'
import { fcfs } from '../FCFS/fcfs.js'
import { sstf } from '../SSTF/sstf.js'
import { scan } from '../SCAN/scan.js'

const ALGOS = { FCFS: fcfs, SSTF: sstf, SCAN: scan }
const MENU = [
  ['/fcfs', '🍜', 'FCFS', 'First Come First Served: yang datang duluan dilayani duluan.'],
  ['/sstf', '🎯', 'SSTF', 'Shortest Seek Time First: selalu pilih request terdekat dari head.'],
  ['/scan', '🛗', 'SCAN', 'Head menyapu ke satu ujung disk seperti lift, lalu berbalik arah.'],
]

// Halaman Beranda: maskot interaktif, pilih metode, dan perbandingan metrik efisiensi
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
    } catch (e) { setError(e.message); setData(null) }
  }

  const sorted = data && [...data.rows].sort((a, b) => a.total - b.total)
  const best = sorted && sorted[0].total
  const worst = sorted && sorted[sorted.length - 1].total

  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <span className="sticker">✨ Simulator Penjadwalan Disk</span>
          <h1 className="hero-title">Disk<span>Flow</span></h1>
          <p className="lead">
            Lihat bagaimana head disk bergerak, hitung total head movement otomatis, dan bandingkan
            efisiensi FCFS, SSTF, dan SCAN, lengkap dengan animasi disk 3D dari zaman ke zaman.
          </p>
          <div className="hero-cta">
            <Link className="btn primary" to="/fcfs">Mulai belajar 🌸</Link>
            <button className="btn" onClick={() => document.getElementById('bandingkan')?.scrollIntoView({ behavior: 'smooth' })}>
              Bandingkan algoritma
            </button>
          </div>
        </div>
        <Mascot size={380} />
      </section>
      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C180 90 360 0 540 40 S900 90 1080 40 S1300 10 1440 40 V80 H0Z" fill="#fff8f0" />
      </svg>

      <section className="home-body">
        <h2>Pilih metode</h2>
        <div className="cards">
          {MENU.map(([to, icon, title, desc]) => (
            <Link key={to} to={to} className="card">
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span>Grafik + animasi disk 3D →</span>
            </Link>
          ))}
        </div>

        <h2 id="bandingkan" style={{ marginTop: 40 }}>Perbandingan efisiensi</h2>
        <p className="lead">Isi data di bawah, lalu lihat algoritma mana yang paling hemat gerakan head.</p>
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
                <div className="bar" style={{ width: `${worst ? (r.total / worst) * 75 : 0}%`, background: COLORS[r.name] }} />
                <span>{r.total}{r.total === best ? ' ★' : ''}</span>
              </div>
            ))}
            <h3>Grafik pergerakan (ketiga algoritma)</h3>
            <DiskChart max={data.max} title="Perbandingan jalur head"
              series={data.rows.map((r) => ({ name: r.name, path: r.path, color: COLORS[r.name] }))} />
          </>
        )}
      </section>
    </div>
  )
}
