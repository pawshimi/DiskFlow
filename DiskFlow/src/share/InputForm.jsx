// Semua kolom wajib diisi (kosong di awal); placeholder menjelaskan format isiannya
export default function InputForm({ form, setForm, useDir = false }) {
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="form">
      <label className="wide">Antrian request <i>*</i>
        <input value={form.queue} onChange={set('queue')}
          placeholder="Isi angka silinder dipisah koma, contoh: 98, 183, 37, 122" />
      </label>
      <label>Posisi awal head <i>*</i>
        <input value={form.head} onChange={set('head')} inputMode="numeric"
          placeholder="Isi satu angka, contoh: 53" />
      </label>
      <label>Silinder maksimum <i>*</i>
        <input value={form.max} onChange={set('max')} inputMode="numeric"
          placeholder="Isi angka silinder terakhir, contoh: 199" />
      </label>
      {useDir && (
        <label>Arah awal sapuan
          <select value={form.dir} onChange={set('dir')}>
            <option value="up">Menuju silinder besar</option>
            <option value="down">Menuju silinder kecil (0)</option>
          </select>
        </label>
      )}
    </div>
  )
}
