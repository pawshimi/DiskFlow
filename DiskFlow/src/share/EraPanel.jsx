import { useState } from 'react'
import { ERAS, OS_INFO } from './eras.js'

// Pilihan zaman (di atas scene 3D)
export function EraPicker({ eraId, setEraId }) {
  return (
    <div className="era-picker">
      <b>Pilih zaman:</b>
      {ERAS.map((e) => (
        <button key={e.id} className={e.id === eraId ? 'on' : ''} onClick={() => setEraId(e.id)}>{e.label}</button>
      ))}
    </div>
  )
}

// Kartu info zaman + perbandingan OS (hanya untuk zaman sekarang)
export function EraInfo({ era }) {
  const [os, setOs] = useState('linux')
  const info = OS_INFO.find((o) => o.id === os)
  return (
    <div className="era-info">
      <h3>{era.title} <small>{era.label}</small></h3>
      <div className="era-stats">
        <div><small>Piringan</small><b>{era.platters}</b></div>
        <div><small>Ukuran</small><b>{era.size}</b></div>
        <div><small>Putaran</small><b>{era.rpm}</b></div>
        <div><small>Kapasitas</small><b>{era.cap}</b></div>
      </div>
      <p>{era.note}</p>
      {era.modern && (
        <div className="os-box">
          <b>Penjadwalan disk di sistem operasi zaman sekarang</b>
          <div className="os-tabs">
            {OS_INFO.map((o) => (
              <button key={o.id} className={o.id === os ? 'on' : ''} onClick={() => setOs(o.id)}>{o.icon} {o.name}</button>
            ))}
          </div>
          <ul>{info.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <small>SSD tidak punya head dan piringan, jadi simulasi seek hanya relevan untuk HDD.</small>
        </div>
      )}
    </div>
  )
}
