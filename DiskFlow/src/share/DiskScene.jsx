const CX = 250, CY = 215, ROUT = 200, RIN = 55

// Silinder 0 = tepi luar piringan, silinder max = dekat poros (seperti hard disk asli)
const radius = (cyl, max) => ROUT - (cyl / max) * (ROUT - RIN)

// Pemandangan "di dalam disk": piringan berputar, track, request, dan lengan head
// overlay: fungsi opsional untuk menggambar tambahan khusus tiap algoritma
export default function DiskScene({ path, max, pos, reached, spinning, overlay }) {
  const X = (cyl) => CX + radius(cyl, max)
  const rings = Array.from({ length: 11 }, (_, t) => Math.round((max * t) / 10))
  const dots = path.map((p, i) => ({ ...p, i })).filter((p) => p.i > 0 && p.req)
  const hx = X(pos)

  return (
    <svg viewBox="0 0 700 460" className="disk-scene">
      <g className="platter" style={{ animationPlayState: spinning ? 'running' : 'paused' }}>
        <circle cx={CX} cy={CY} r={ROUT + 8} fill="#dfe5ea" stroke="#9aa5b1" strokeWidth="3" />
        {rings.map((v) => (
          <circle key={v} cx={CX} cy={CY} r={radius(v, max)} fill="none" stroke="#c3ccd4" />
        ))}
        {[0, 60, 120].map((a) => (
          <line key={a} x1={CX - ROUT} y1={CY} x2={CX + ROUT} y2={CY} stroke="#b8c2cc"
            transform={`rotate(${a} ${CX} ${CY})`} />
        ))}
        {dots.map((p) => {
          const a = (p.i * 137.5 * Math.PI) / 180
          const r = radius(p.cyl, max)
          return (
            <circle key={p.i} cx={CX + r * Math.cos(a)} cy={CY + r * Math.sin(a)} r="6"
              fill={p.i <= reached ? '#27ae60' : '#e74c3c'} stroke="#fff" strokeWidth="2">
              <title>Request silinder {p.cyl}</title>
            </circle>
          )
        })}
        <circle cx={CX} cy={CY} r={RIN - 12} fill="#566573" />
      </g>

      {dots.map((p) => (
        <line key={p.i} x1={X(p.cyl)} x2={X(p.cyl)} y1={CY - 10} y2={CY + 10}
          stroke={p.i <= reached ? '#27ae60' : '#e74c3c'} strokeWidth="2" />
      ))}

      {overlay && overlay({ X, CY, pos, reached, path, max })}

      <rect x={CX + ROUT + 40} y={CY - 20} width="70" height="40" rx="8" fill="#34495e" />
      <line x1={CX + ROUT + 45} y1={CY} x2={hx} y2={CY} stroke="#34495e" strokeWidth="8" strokeLinecap="round" />
      <circle cx={hx} cy={CY} r="10" fill="#e67e22" stroke="#fff" strokeWidth="3" />
      <text x={hx} y={CY + 32} textAnchor="middle" className="head-label">{Math.round(pos)}</text>

      <line x1={X(max)} x2={X(0)} y1="438" y2="438" stroke="#999" />
      {rings.map((v) => (
        <g key={v}>
          <line x1={X(v)} x2={X(v)} y1="434" y2="442" stroke="#999" />
          <text x={X(v)} y="455" textAnchor="middle" className="tick">{v}</text>
        </g>
      ))}
    </svg>
  )
}
