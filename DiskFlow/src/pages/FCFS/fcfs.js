import { pt } from '../../shared/utils.js'

// FCFS: layani request sesuai urutan kedatangan
export function fcfs(reqs, head) {
  return [pt(head), ...reqs.map((r) => pt(r))]
}
