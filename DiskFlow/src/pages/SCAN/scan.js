import { pt } from '../../shared/utils.js'

// SCAN klasik (elevator): head menyapu ke satu ujung disk (0 atau max), lalu berbalik
export function scan(reqs, head, max, dir = 'up') {
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
