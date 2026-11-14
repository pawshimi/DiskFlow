export default function InputForm({ form, setForm, useDir = false }) {
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="form">
      <label className="wide">Antrian request (pisah koma/spasi)
        <input value={form.queue} onChange={set('queue')} />
      </label>
      <label>Posisi awal head
        <input value={form.head} onChange={set('head')} />
      </label>
      <label>Silinder maksimum (0 - N)
        <input value={form.max} onChange={set('max')} />
      </label>
      {useDir && (
        <label>Arah awal
          <select value={form.dir} onChange={set('dir')}>
            <option value="up">Kanan (naik)</option>
            <option value="down">Kiri (turun)</option>
          </select>
        </label>
      )}
    </div>
  )
}
