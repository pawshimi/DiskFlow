// ===== Logika algoritma penjadwalan disk =====
// Tiap algoritma mengembalikan array { cyl, req }.
// req=false artinya titik itu hanya ujung sapuan SCAN (bukan request).

export const COLORS = { FCFS: '#e74c3c', SSTF: '#27ae60', SCAN: '#2980b9' }
const pt = (cyl, req = true) => ({ cyl, req })

export function fcfs(reqs, head) {
  return [pt(head), ...reqs.map((r) => pt(r))]
}

export function sstf(reqs, head) {
  const pending = [...reqs]
  const path = [pt(head)]
  let cur = head
  while (pending.length) {
    let bi = 0
    pending.forEach((r, i) => {
      if (Math.abs(r - cur) < Math.abs(pending[bi] - cur)) bi = i
    })
    cur = pending.splice(bi, 1)[0]
    path.push(pt(cur))
  }
  return path
}

// SCAN klasik: selalu jalan sampai ujung disk (0 atau max), lalu berbalik
export function scan(reqs, head, max, dir) {
  const path = [pt(head)]
  if (dir === 'up') {
    const upper = reqs.filter((r) => r >= head).sort((a, b) => a - b)
    const lower = reqs.filter((r) => r < head).sort((a, b) => b - a)
    upper.forEach((r) => path.push(pt(r)))
    if (path[path.length - 1].cyl !== max) path.push(pt(max, false))
    lower.forEach((r) => path.push(pt(r)))
  } else {
    const lower = reqs.filter((r) => r <= head).sort((a, b) => b - a)
    const upper = reqs.filter((r) => r > head).sort((a, b) => a - b)
    lower.forEach((r) => path.push(pt(r)))
    if (path[path.length - 1].cyl !== 0) path.push(pt(0, false))
    upper.forEach((r) => path.push(pt(r)))
  }
  return path
}

export const ALGOS = { FCFS: fcfs, SSTF: sstf, SCAN: scan }

export const totalMovement = (path) =>
  path.slice(1).reduce((sum, p, i) => sum + Math.abs(p.cyl - path[i].cyl), 0)

// Validasi input form -> { reqs, head, max } atau throw Error
export function parseInputs({ queue, head, max }) {
  const reqs = queue.split(/[\s,]+/).filter(Boolean).map(Number)
  const h = Number(head)
  const m = Number(max)
  if ([h, m, ...reqs].some((v) => !Number.isInteger(v)))
    throw new Error('Semua input harus berupa angka bulat.')
  if (m <= 0) throw new Error('Silinder maksimum harus lebih dari 0.')
  if (!reqs.length) throw new Error('Antrian request tidak boleh kosong.')
  if (h < 0 || h > m) throw new Error(`Posisi head harus di antara 0 dan ${m}.`)
  if (reqs.some((r) => r < 0 || r > m))
    throw new Error(`Semua request harus di antara 0 dan ${m}.`)
  return { reqs, head: h, max: m }
}
