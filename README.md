# DiskFlow
Aplikasi simulasi interaktif berbasis web yang memvisualisasikan pergerakan head disk dan menghitung total head movement (jarak pencarian) secara otomatis menggunakan algoritma FCFS, SSTF, dan SCAN. Dilengkapi dengan grafik pergerakan interaktif dan perbandingan metrik efisiensi antar algoritma.

**Cara instalasi:**
1. Clone Repositori
   Buka terminal di laptop kamu, lalu jalankan perintah:
   ```bash
   git clone [https://github.com/(username)/DiskFlow.git](https://github.com/(username)/DiskFlow.git)
   cd DiskFlow

**Cara penggunaan:**
1. Jalankan Aplikasi
   Ketik perintah ini di terminal untuk menjalankan server lokal:
   npm run dev
2. Buka di Browser
   Buka browser (Google Chrome disarankan) dan akses tautan lokal yang muncul di terminal (http://localhost:5173).
3. Simulasi Algoritma Disk
   - Posisi Head Awal: Masukkan angka titik awal head (misal: 53).
   - Batas Maksimum Trek: Masukkan batas maksimum cylinder/track disk (misal: 199).
   - Antrean Request: Input deretan angka track yang dipisahkan koma (misal: 98, 183, 37, 122, 14, 124, 65, 67).
   - Arah Scan: Tentukan arah pergerakan awal (Kanan atau Kiri) khusus untuk algoritma SCAN.
   - Klik Hitung / Simulasi untuk melihat visualisasi pergerakan head secara otomatis beserta tabel & grafik perbandingan total head movement antara FCFS, SSTF,   dan SCAN.


**Anggota kelompok:**
1. Fawwaz Faadhilah Braliana - 257006111134
2. Nita Rismayani - 257006111185
3. Raisya Zahra Salsabila - 257006111179
4. Salsa Billa Setiawan Putri - 257006111183
5. Wijdan Maula Hidayat - 257006111127
6. Muhammad Nibras Zahran Irawan - 257006111167
