import { useState } from 'react'
import { ALGOS, parseInputs, totalMovement } from './algorithms.js'
import InputPanel from './components/InputPanel.jsx'
import DiskChart from './components/DiskChart.jsx'
import ComparisonView from './components/ComparisonView.jsx'

const DEFAULT_FORM = {
  queue: '98, 183, 37, 122, 14, 124, 65, 67',
  head: '53', max: '199', algo: 'FCFS', dir: 'up', speed: 5,
}

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [tab, setTab] = useState('viz')
  const [result, setResult] = useState(null)
  const [cmp, setCmp] = useState(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const { reqs, head, max } = parseInputs(form)
      const path = ALGOS[form.algo](reqs, head, max, form.dir)
      setResult({ path, name: form.algo, max, n: reqs.length })
      setError(''); setTab('viz')
    } catch (e) { setError(e.message) }
  }

  const compare = () => {
    try {
      const { reqs, head, max } = parseInputs(form)
      const rows = Object.entries(ALGOS).map(([name, fn]) => ({
        name, total: totalMovement(fn(reqs, head, max, form.dir)),
      }))
      setCmp({ rows, n: reqs.length })
      setError(''); setTab('cmp')
    } catch (e) { setError(e.message) }
  }

  const reset = () => { setResult(null); setCmp(null); setError('') }

  const info = result && {
    name: result.name,
    order: result.path.slice(1).filter((p) => p.req).map((p) => p.cyl).join(' → '),
    total: totalMovement(result.path),
    avg: (totalMovement(result.path) / result.n).toFixed(2),
  }

  return (
    <div className="app">
      <InputPanel form={form} setForm={setForm} onRun={run} onCompare={compare}
        onReset={reset} error={error} info={info} />
      <main>
        <h1>DiskFlow <small>Simulator Penjadwalan Disk</small></h1>
        <div className="tabs">
          <button className={tab === 'viz' ? 'active' : ''} onClick={() => setTab('viz')}>Visualisasi</button>
          <button className={tab === 'cmp' ? 'active' : ''} onClick={() => setTab('cmp')}>Perbandingan</button>
        </div>
        <div className="content">
          {tab === 'viz'
            ? result
              ? <DiskChart path={result.path} name={result.name} max={result.max} speed={Number(form.speed)} />
              : <p className="empty">Isi input lalu klik “Jalankan Simulasi”.</p>
            : <ComparisonView data={cmp} />}
        </div>
      </main>
    </div>
  )
}
