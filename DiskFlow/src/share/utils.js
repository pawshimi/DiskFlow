export const COLORS = { FCFS: '#e74c3c', SSTF: '#27ae60', SCAN: '#2980b9' }
export const DEFAULTS = { queue: '98, 183, 37, 122, 14, 124, 65, 67', head: '53', max: '199', dir: 'up' }

// Titik jalur: req=false berarti ujung sapuan (bukan request)
export const pt = (cyl, req = true) => ({ cyl, req })

export const totalMovement = (path) =>
  path.slice(1).reduce((sum, p, i) => sum + Math.abs(p.cyl - path[i].cyl), 0)

// Validasi form -> { reqs, head, max } atau throw Error
export function parseInputs({ queue, head, max }) {
  const reqs = queue.split(/[\s,]+/).filter(Boolean).map(Number)
  const h = Number(head)
  const m = Number(max)
  if ([h, m, ...reqs].some((v) => !Number.isInteger(v)))
    throw new Error('Semua input harus berupa angka bulat.')
  if (m <= 0) throw new Error('Silinder maksimum harus lebih dari 0.')
  if (!reqs.length) throw new Error('Antrian request tidak boleh kosong.')
  if (h < 0 || h > m) throw new Error(`Posisi head harus di antara 0 dan ${m}.`)
  if (reqs.some((r) => r < 0 || r > m)) throw new Error(`Semua request harus di antara 0 dan ${m}.`)
  return { reqs, head: h, max: m }
}
