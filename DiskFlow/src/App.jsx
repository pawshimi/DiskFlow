import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import FCFSGraph from './pages/FCFS/FCFSGraph.jsx'
import FCFSDisk from './pages/FCFS/FCFSDisk.jsx'
import SSTFGraph from './pages/SSTF/SSTFGraph.jsx'
import SSTFDisk from './pages/SSTF/SSTFDisk.jsx'
import SCANGraph from './pages/SCAN/scangraph.jsx'
import SCANDisk from './pages/SCAN/SCANDisk.jsx'
import ChatBot from './share/ChatBot.jsx'
import { MascotIcon } from './share/Mascot.jsx'

export default function App() {
  return (
    <>
      <nav className="nav">
        <b className="brand"><MascotIcon size={34} /> DiskFlow</b>
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
      <ChatBot />
    </>
  )
}
