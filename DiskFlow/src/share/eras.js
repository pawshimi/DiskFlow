// Data tiap zaman. visual = jumlah piringan yang digambar di 3D.
export const ERAS = [
  { id: '1956', label: '1956', title: 'IBM 350 RAMAC', visual: 12, platters: '50 (digambar 12)', size: '24 inci', rpm: '1.200 RPM', cap: '± 5 MB',
    note: 'Hard disk pertama di dunia, seukuran lemari. Head harus bergerak mekanis antar piringan, jadi seek sangat mahal dan urutan layanan sangat berpengaruh.' },
  { id: '1980', label: '1980-an', title: 'Awal era PC', visual: 2, platters: '≈ 2–4', size: '5,25 inci', rpm: '3.600 RPM', cap: 'puluhan MB',
    note: 'OS masih tahu geometri disk (cylinder, head, sector), jadi algoritma seperti SCAN langsung berpengaruh pada kecepatan.' },
  { id: '1990', label: '1990-an', title: 'Era IDE / ATA', visual: 3, platters: '≈ 2–4', size: '3,5 inci', rpm: '5.400 RPM', cap: 'ratusan MB – beberapa GB',
    note: 'Muncul alamat logis (LBA): OS melihat disk sebagai urutan blok, bukan lagi silinder asli.' },
  { id: '2000', label: '2000-an', title: 'Era SATA', visual: 4, platters: '≈ 2–5', size: '3,5 inci', rpm: '7.200 RPM', cap: 'hingga ± 1 TB',
    note: 'Fitur NCQ: drive boleh menyusun ulang antrian request sendiri di firmware, mirip ide SSTF di dalam disk.' },
  { id: '2010', label: '2010-an', title: 'Era helium dan SSD', visual: 5, platters: '≈ 1–7', size: '3,5 inci', rpm: '5.400–7.200 RPM', cap: '1 – 10+ TB',
    note: 'HDD berisi helium memungkinkan lebih banyak piringan. SSD mulai menggantikan HDD sebagai disk sistem.' },
  { id: 'sekarang-laptop', label: 'Sekarang: Laptop', modern: true, title: 'HDD laptop 2,5 inci', visual: 2, platters: '1–2', size: '2,5 inci', rpm: '5.400 RPM', cap: 'hingga ± 5 TB',
    note: 'Laptop modern umumnya sudah memakai SSD. HDD 2,5 inci tinggal dipakai untuk penyimpanan murah dan cadangan.' },
  { id: 'sekarang-desktop', label: 'Sekarang: Desktop', modern: true, title: 'HDD desktop / NAS 3,5 inci', visual: 4, platters: '≈ 1–5', size: '3,5 inci', rpm: '5.400–7.200 RPM', cap: 'beberapa TB – puluhan TB',
    note: 'Dipakai untuk penyimpanan besar dan murah (arsip, NAS). Sistem operasi biasanya di SSD.' },
  { id: 'sekarang-server', label: 'Sekarang: Server', modern: true, title: 'HDD data center (helium)', visual: 10, platters: '10–11', size: '3,5 inci', rpm: '7.200 RPM', cap: '30 – 40+ TB',
    note: 'Seagate memakai 10 piringan (30 TB, HAMR) dan Western Digital 11 piringan. Peta jalan produsen menyebut 12–14 piringan.' },
]

export const OS_INFO = [
  { id: 'linux', name: 'Linux', icon: '🐧', points: [
    'Pilihan scheduler: none, mq-deadline, kyber, dan bfq. Bisa diganti per perangkat lewat /sys/block/<perangkat>/queue/scheduler.',
    'HDD: umumnya mq-deadline, yang mengurutkan request berdasarkan nomor blok (LBA) naik, mirip SCAN, ditambah batas waktu supaya tidak terjadi starvation. bfq cocok untuk desktop yang harus tetap responsif.',
    'SSD/NVMe: biasanya none, karena tidak ada seek yang perlu dioptimalkan.'] },
  { id: 'windows', name: 'Windows', icon: '🪟', points: [
    'Pengguna tidak bisa memilih scheduler. Antrian dikelola driver penyimpanan, dan algoritma detailnya tidak dipublikasikan.',
    'Proses bisa memberi prioritas I/O (misalnya mode background). Ada juga Optimize Drives: defrag untuk HDD dan TRIM untuk SSD.',
    'Drive HDD tetap menyusun ulang antrian sendiri lewat NCQ.'] },
  { id: 'macos', name: 'macOS', icon: '🍎', points: [
    'Mac modern hampir semuanya memakai SSD dengan APFS, sehingga urutan seek nyaris tidak berpengaruh.',
    'Apple tidak mendokumentasikan scheduler tingkat blok. Yang tersedia hanya pengaturan prioritas atau throttle I/O per proses.',
    'Mac lama dengan Fusion Drive menggabungkan SSD kecil dan HDD, lalu memindahkan data yang sering dipakai ke SSD secara otomatis.'] },
]
