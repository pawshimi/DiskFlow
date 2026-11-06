import { useEffect, useState } from 'react'
import { COLORS } from '../algorithms.js'

const ML = 40, W = 900, PW = 820, TOP = 60, STEP = 46

export default function DiskChart({ path, name, max, speed }) {
  const [count, setCount] = useState(1) // jumlah titik yang sudah tergambar

  useEffect(() => {
    setCount(1)
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= path.length) { clearInterval(id); return c }
        return c + 1
      })
    }, 700 / speed)
    return () => clearInterval(id)
  }, [path, speed])

  const color = COLORS[name]
  const x = (cyl) => ML + (cyl / max) * PW
  const y = (i) => TOP + i * STEP
  const H = TOP + (path.length - 1) * STEP + 30
  const ticks = Array.from({ length: 11 }, (_, t) => Math.round((max * t) / 10))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart">
      <text x={ML} y="20" className="chart-title">Pergerakan Head Disk - {name}</text>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={TOP - 15} y2={H - 15} stroke="#eee" />
          <text x={x(v)} y={TOP - 25} textAnchor="middle" className="tick">{v}</text>
        </g>
      ))}
      {path.slice(0, count).map((p, i) => i > 0 && (
        <line key={`l${i}`} x1={x(path[i - 1].cyl)} y1={y(i - 1)} x2={x(p.cyl)} y2={y(i)}
          stroke={color} strokeWidth="2.5" />
      ))}
      {path.slice(0, count).map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={x(p.cyl)} cy={y(i)} r={i === 0 ? 7 : 5.5}
            fill={i === 0 ? '#222' : p.req ? color : '#fff'} stroke={color} strokeWidth="2">
            <title>
              {i === 0 ? 'Posisi awal' : `Langkah ${i}`}: silinder {p.cyl}
              {i > 0 ? ` (jarak ${Math.abs(p.cyl - path[i - 1].cyl)})` : ''}
            </title>
          </circle>
          <text x={x(p.cyl)} y={y(i) - 11} textAnchor="middle" className="pt-label">{p.cyl}</text>
        </g>
      ))}
    </svg>
  )
}
