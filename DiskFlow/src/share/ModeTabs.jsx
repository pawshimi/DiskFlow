import { NavLink } from 'react-router-dom'

// Tab pindah antara tampilan grafik dan animasi disk untuk satu algoritma
export default function ModeTabs({ base }) {
  return (
    <div className="mode-tabs">
      <NavLink to={base} end>📈 Grafik</NavLink>
      <NavLink to={`${base}/disk`}>💿 Animasi Disk</NavLink>
    </div>
  )
}
