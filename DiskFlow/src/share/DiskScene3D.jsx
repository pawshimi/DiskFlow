import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const R = 3, R_IN = 0.9, COL_X = R + 1.5
// f = 0 -> tepi luar (silinder 0), f = 1 -> dekat poros (silinder max)
const rad = (f) => R - 0.2 - f * (R - 0.2 - R_IN)

// Disk 3D: 3 piringan + spindle + arm assembly. Bisa digeser (putar kamera) dan di-zoom.
// Piringan berputar saat spinning=true; arm/head mengikuti posisi silinder (pos).
export default function DiskScene3D({ path, max, pos, reached, spinning, rpm = 7200, platters = 3 }) {
  const mountRef = useRef(null)
  const api = useRef({})
  const live = useRef({})
  live.current = { pos, reached, spinning, rpm, max }

  // Bangun scene sekali
  useEffect(() => {
    const el = mountRef.current
    const gap = platters === 1 ? 0 : Math.min(1.1, 3.4 / (platters - 1))
    const ys = Array.from({ length: platters }, (_, i) => (i - (platters - 1) / 2) * gap)
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true })
    } catch {
      el.textContent = 'Browser kamu tidak mendukung WebGL. Gunakan tampilan 2D.'
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeef2f6)
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(6.5, 5, 8)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(1, 0, 0)
    controls.enableDamping = true
    controls.minDistance = 5
    controls.maxDistance = 20
    controls.update()

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const sun = new THREE.DirectionalLight(0xffffff, 1.1)
    sun.position.set(5, 9, 6)
    scene.add(sun)

    // Bagian yang berputar: piringan, track, sektor, spindle, request
    const rotor = new THREE.Group()
    scene.add(rotor)
    const platterMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.5, roughness: 0.4 })
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x78909c })
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x90a4ae, side: THREE.DoubleSide })
    const sectorMat = new THREE.MeshBasicMaterial({ color: 0x81d4fa, side: THREE.DoubleSide })

    ys.forEach((y) => {
      const platter = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.08, 72), platterMat)
      platter.position.y = y
      rotor.add(platter)
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(R_IN - 0.15, R_IN - 0.15, 0.1, 40), hubMat)
      hub.position.y = y
      rotor.add(hub)
      for (let t = 0; t <= 10; t++) {
        const r = rad(t / 10)
        const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.01, r + 0.01, 96), ringMat)
        ring.rotation.x = -Math.PI / 2
        ring.position.y = y + 0.045
        rotor.add(ring)
      }
      // juring "sector" supaya putaran piringan terlihat jelas
      const sector = new THREE.Mesh(new THREE.RingGeometry(R_IN, R - 0.05, 48, 1, 0, 0.5), sectorMat)
      sector.rotation.x = -Math.PI / 2
      sector.position.y = y + 0.046
      rotor.add(sector)
    })
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, (platters - 1) * gap + 1.6, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e88e5 }))
    rotor.add(spindle)

    // Arm assembly (tidak berputar): kolom biru + 3 arm + 3 read-write head
    const column = new THREE.Mesh(new THREE.BoxGeometry(0.4, (platters - 1) * gap + 1.4, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x1e88e5 }))
    column.position.set(COL_X, 0, 0)
    scene.add(column)
    const armMat = new THREE.MeshStandardMaterial({ color: 0x546e7a })
    const headMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, emissive: 0x7a3d00 })
    const arms = ys.map((y) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1, 0.06, 0.14), armMat)
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.2), headMat)
      scene.add(arm, head)
      return { arm, head, y }
    })

    api.current = { rotor, markers: [], top: ys[ys.length - 1], bottom: ys[0] }

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let raf
    let last = performance.now()
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const s = live.current
      if (s.spinning) rotor.rotation.y -= dt * (s.rpm / 7200) * 0.8 * Math.PI * 2

      const hx = rad(s.pos / s.max)
      arms.forEach(({ arm, head, y }) => {
        const len = COL_X - hx
        arm.scale.x = len
        arm.position.set(hx + len / 2, y + 0.16, 0)
        head.position.set(hx, y + 0.1, 0)
      })

      api.current.markers.forEach((m) => {
        const done = m.i <= s.reached
        if (done !== m.done) {
          m.done = done
          m.box.material.color.set(done ? 0x27ae60 : 0xe74c3c)
          m.box.material.emissive.set(done ? 0x0b3d1d : 0x551100)
        }
      })
      controls.update()
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose() })
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [platters])

  // Pasang request di piringan teratas (kotak merah -> hijau saat dilayani)
  useEffect(() => {
    const { rotor } = api.current
    if (!rotor) return
    const group = new THREE.Group()
    rotor.add(group)
    const markers = []
    path.forEach((p, i) => {
      if (i === 0 || !p.req) return
      const a = (i * 137.5 * Math.PI) / 180
      const r = rad(p.cyl / max)
      const x = r * Math.cos(a), z = r * Math.sin(a)
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xe74c3c, emissive: 0x551100 }))
      box.position.set(x, api.current.top + 0.08, z)
      box.rotation.y = -a
      group.add(box)
      // garis putus-putus vertikal = satu silinder menembus semua piringan
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, api.current.top, z), new THREE.Vector3(x, api.current.bottom, z)]),
        new THREE.LineDashedMaterial({ color: 0x607d8b, dashSize: 0.1, gapSize: 0.08 }))
      line.computeLineDistances()
      group.add(line)
      markers.push({ box, i, done: false })
    })
    api.current.markers = markers
    return () => {
      api.current.markers = []
      rotor.remove(group)
      group.traverse((o) => { o.geometry?.dispose(); o.material?.dispose() })
    }
  }, [path, max, platters])

  return (
    <div className="scene3d-wrap">
      <div ref={mountRef} className="scene3d" />
      <div className="scene3d-hud">Head di silinder {Math.round(pos)}</div>
      <div className="scene3d-hint">Geser = putar kamera · scroll = zoom</div>
      <div className="legend">
        <span><i style={{ background: '#cfd8dc' }} />Platter</span>
        <span><i style={{ background: '#1e88e5' }} />Spindle &amp; arm assembly</span>
        <span><i style={{ background: '#546e7a' }} />Arm</span>
        <span><i style={{ background: '#e67e22' }} />Read-write head</span>
        <span><i style={{ background: '#81d4fa' }} />Sector</span>
        <span><i style={{ background: '#e74c3c' }} />Request</span>
        <span><i style={{ background: '#27ae60' }} />Terlayani</span>
      </div>
    </div>
  )
}
