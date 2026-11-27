import { useState } from 'react'
import DiskScene from './DiskScene.jsx'
import DiskScene3D from './DiskScene3D.jsx'
import { EraPicker, EraInfo } from './EraPanel.jsx'
import { ERAS } from './eras.js'

// Tampilan animasi: 3D (pilih zaman) atau 2D dari atas dengan label khas tiap algoritma
export default function DiskView({ overlay, rpm, ...scene }) {
  const [mode, setMode] = useState('3d')
  const [eraId, setEraId] = useState('sekarang-desktop')
  const era = ERAS.find((e) => e.id === eraId)
  return (
    <div>
      <div className="view-switch">
        <button className={mode === '3d' ? 'on' : ''} onClick={() => setMode('3d')}>🧊 Tampilan 3D</button>
        <button className={mode === '2d' ? 'on' : ''} onClick={() => setMode('2d')}>🔍 2D + label algoritma</button>
      </div>
      {mode === '3d' && <EraPicker eraId={eraId} setEraId={setEraId} />}
      {mode === '3d'
        ? <DiskScene3D {...scene} rpm={rpm} platters={era.visual} />
        : <DiskScene {...scene} overlay={overlay} />}
      {mode === '3d' && <EraInfo era={era} />}
    </div>
  )
}
