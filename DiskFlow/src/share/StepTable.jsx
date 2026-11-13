// Tabel rincian tiap langkah: dari -> ke, jarak, dan akumulasi jarak
export default function StepTable({ path, step }) {
  let cum = 0
  const rows = path.slice(1, step).map((p, i) => {
    const d = Math.abs(p.cyl - path[i].cyl)
    cum += d
    return { n: i + 1, from: path[i].cyl, to: p.cyl, d, cum, req: p.req }
  })
  if (!rows.length) return null
  return (
    <table className="steps">
      <thead><tr><th>Langkah</th><th>Dari</th><th>Ke</th><th>Jarak</th><th>Total sementara</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.n} className={r.n === step - 1 ? 'now' : ''}>
            <td>{r.n}</td><td>{r.from}</td>
            <td>{r.to}{r.req ? '' : ' (ujung disk)'}</td>
            <td>{r.d}</td><td>{r.cum}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
