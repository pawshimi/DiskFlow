import { ALGOS } from '../algorithms.js'

export default function InputPanel({ form, setForm, onRun, onCompare, onReset, error, info }) {
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <aside className="panel">
      <h2>Input</h2>
      <label>Antrian request (pisah koma/spasi)
        <input value={form.queue} onChange={set('queue')} />
      </label>
      <label>Posisi awal head
        <input value={form.head} onChange={set('head')} />
      </label>
      <label>Silinder maksimum (0 - N)
        <input value={form.max} onChange={set('max')} />
      </label>
      <label>Algoritma
        <select value={form.algo} onChange={set('algo')}>
          {Object.keys(ALGOS).map((a) => <option key={a}>{a}</option>)}
        </select>
      </label>
      <label>Arah awal (khusus SCAN)
        <select value={form.dir} onChange={set('dir')}>
          <option value="up">Kanan (naik)</option>
          <option value="down">Kiri (turun)</option>
        </select>
      </label>
      <label>Kecepatan animasi: {form.speed}
        <input type="range" min="1" max="10" value={form.speed} onChange={set('speed')} />
      </label>

      <button className="primary" onClick={onRun}>▶ Jalankan Simulasi</button>
      <button onClick={onCompare}>📊 Bandingkan Semua</button>
      <button onClick={onReset}>↺ Reset</button>

      {error && <p className="error">{error}</p>}
      {info && (
        <div className="info">
          <b>{info.name}</b>
          <p>Urutan layanan:<br />{info.order}</p>
          <p>Total head movement: <b>{info.total}</b> silinder<br />
            Rata-rata/request: <b>{info.avg}</b></p>
        </div>
      )}
    </aside>
  )
}
