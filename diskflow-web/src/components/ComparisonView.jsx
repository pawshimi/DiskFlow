import { COLORS } from '../algorithms.js'

export default function ComparisonView({ data }) {
  if (!data) return <p className="empty">Klik “Bandingkan Semua” untuk melihat perbandingan efisiensi.</p>
  const rows = [...data.rows].sort((a, b) => a.total - b.total)
  const best = rows[0].total
  const maxTotal = rows[rows.length - 1].total

  return (
    <div>
      <table>
        <thead>
          <tr><th>Algoritma</th><th>Total Head Movement</th><th>Rata-rata / Request</th><th>Selisih vs Terbaik</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className={r.total === best ? 'best' : ''}>
              <td>{r.name}</td>
              <td>{r.total}</td>
              <td>{(r.total / data.n).toFixed(2)}</td>
              <td>{r.total === best ? 'Terbaik ✓' : `+${r.total - best} (+${(((r.total - best) / best) * 100).toFixed(1)}%)`}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total Head Movement (makin pendek makin efisien)</h3>
      {rows.map((r) => (
        <div className="bar-row" key={r.name}>
          <span className="bar-name">{r.name}</span>
          <div className="bar" style={{ width: `${(r.total / maxTotal) * 80}%`, background: COLORS[r.name] }} />
          <span>{r.total}{r.total === best ? ' ★' : ''}</span>
        </div>
      ))}
    </div>
  )
}
