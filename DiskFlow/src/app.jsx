import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import FCFSGraph from './pages/FCFS/FCFSGraph.jsx'
import FCFSDisk from './pages/FCFS/FCFSDisk.jsx'
import SSTFGraph from './pages/SSTF/SSTFGraph.jsx'
import SSTFDisk from './pages/SSTF/SSTFDisk.jsx'
import SCANGraph from './pages/SCAN/SCANGraph.jsx'
import SCANDisk from './pages/SCAN/SCANDisk.jsx'

export default function App() {
  return (
    <>
      <nav className="nav">
        <b className="brand">DiskFlow</b>
        <NavLink to="/" end>Beranda</NavLink>
        <NavLink to="/fcfs">FCFS</NavLink>
        <NavLink to="/sstf">SSTF</NavLink>
        <NavLink to="/scan">SCAN</NavLink>
      </nav>
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fcfs" element={<FCFSGraph />} />
          <Route path="/fcfs/disk" element={<FCFSDisk />} />
          <Route path="/sstf" element={<SSTFGraph />} />
          <Route path="/sstf/disk" element={<SSTFDisk />} />
          <Route path="/scan" element={<SCANGraph />} />
          <Route path="/scan/disk" element={<SCANDisk />} />
        </Routes>
      </main>
    </>
  )
}
