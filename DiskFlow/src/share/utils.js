export const COLORS = { FCFS: '#e8789f', SSTF: '#4fbf8f', SCAN: '#7c9ee0' }
export const DEFAULTS = { queue: '', head: '', max: '', dir: 'up' } // sengaja kosong: pengguna wajib mengisi

// Titik jalur: req=false berarti ujung sapuan (bukan request)
export const pt = (cyl, req = true) => ({ cyl, req })

export const totalMovement = (path) =>
  path.slice(1).reduce((sum, p, i) => sum + Math.abs(p.cyl - path[i].cyl), 0)

// Validasi form -> { reqs, head, max } atau throw Error
export function parseInputs({ queue, head, max }) {
  if (!queue.trim()) throw new Error('Antrian request wajib diisi. Contoh: 98, 183, 37, 122')
  if (!String(head).trim()) throw new Error('Posisi awal head wajib diisi. Contoh: 53')
  if (!String(max).trim()) throw new Error('Silinder maksimum wajib diisi. Contoh: 199')
  const reqs = queue.split(/[\s,]+/).filter(Boolean).map(Number)
  const h = Number(head)
  const m = Number(max)
  if ([h, m, ...reqs].some((v) => !Number.isInteger(v)))
    throw new Error('Semua input harus berupa angka bulat, tanpa huruf atau desimal.')
  if (m <= 0) throw new Error('Silinder maksimum harus lebih dari 0.')
  if (h < 0 || h > m) throw new Error(`Posisi head harus di antara 0 dan ${m}.`)
  if (reqs.some((r) => r < 0 || r > m)) throw new Error(`Semua request harus di antara 0 dan ${m}.`)
  return { reqs, head: h, max: m }
}
