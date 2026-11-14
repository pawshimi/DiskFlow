const ML = 40, W = 900, PW = 820, TOP = 60, STEP = 46

// series: [{ name, path, color }]. 1 series = grafik detail; >1 = overlay perbandingan.
// count: jumlah titik yang ditampilkan (default semua).
export default function DiskChart({ series, max, count = Infinity, title }) {
  const longest = Math.max(...series.map((s) => s.path.length))
  const x = (cyl) => ML + (cyl / max) * PW
  const y = (i) => TOP + i * STEP
  const H = TOP + (longest - 1) * STEP + 30
  const ticks = Array.from({ length: 11 }, (_, t) => Math.round((max * t) / 10))
  const single = series.length === 1

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart">
        <text x={ML} y="20" className="chart-title">{title}</text>
        {!single && series.map((s, k) => (
          <g key={s.name}>
            <rect x={W - 260 + k * 85} y="9" width="12" height="12" fill={s.color} />
            <text x={W - 244 + k * 85} y="20" className="tick">{s.name}</text>
          </g>
        ))}
        {ticks.map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={TOP - 15} y2={H - 15} stroke="#eee" />
            <text x={x(v)} y={TOP - 25} textAnchor="middle" className="tick">{v}</text>
          </g>
        ))}
        {series.map((s) => {
          const shown = s.path.slice(0, count)
          return (
            <g key={s.name} opacity={single ? 1 : 0.85}>
              {shown.map((p, i) => i > 0 && (
                <line key={i} x1={x(s.path[i - 1].cyl)} y1={y(i - 1)} x2={x(p.cyl)} y2={y(i)}
                  stroke={s.color} strokeWidth="2.5" />
              ))}
              {shown.map((p, i) => (
                <g key={i}>
                  <circle cx={x(p.cyl)} cy={y(i)} r={i === 0 ? 7 : 5}
                    fill={i === 0 ? '#222' : p.req ? s.color : '#fff'} stroke={s.color} strokeWidth="2">
                    <title>
                      {s.name} - {i === 0 ? 'Posisi awal' : `Langkah ${i}`}: silinder {p.cyl}
                      {i > 0 ? ` (jarak ${Math.abs(p.cyl - s.path[i - 1].cyl)})` : ''}
                    </title>
                  </circle>
                  {single && <text x={x(p.cyl)} y={y(i) - 11} textAnchor="middle" className="pt-label">{p.cyl}</text>}
                </g>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
