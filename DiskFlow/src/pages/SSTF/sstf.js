import { pt } from '../../shared/utils.js'

// SSTF: selalu pilih request dengan jarak terdekat dari posisi head saat ini
export function sstf(reqs, head) {
  const pending = [...reqs]
  const path = [pt(head)]
  let cur = head
  while (pending.length) {
    let best = 0
    pending.forEach((r, i) => {
      if (Math.abs(r - cur) < Math.abs(pending[best] - cur)) best = i
    })
    cur = pending.splice(best, 1)[0]
    path.push(pt(cur))
  }
  return path
}
