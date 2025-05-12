# Aplikasi Kuis SMP

Aplikasi kuis berbasis web modern yang dibangun dengan Vue.js untuk siswa SMP. Aplikasi ini menyediakan platform interaktif bagi siswa untuk menguji pengetahuan mereka melalui kuis pada berbagai mata pelajaran.

## Fitur

- 📚 Berbagai mata pelajaran dan materi
- ✍️ Antarmuka kuis interaktif
- ⏱️ Timer untuk setiap sesi kuis
- 📊 Pelacakan skor
- 🎯 Umpan balik langsung untuk jawaban
- 📱 Desain responsif untuk semua perangkat
- 🔒 Panel admin untuk manajemen konten

## Teknologi yang Digunakan

- Vue.js 3
- Vite
- Bootstrap 5
- LocalStorage untuk penyimpanan data

## Demo Langsung

Kunjungi aplikasi langsung di: (https://quis-l3fczso1a-riyan-maulanas-projects.vercel.app/)

## Memulai

### Persyaratan

- Node.js (versi 18 atau lebih tinggi)
- npm (termasuk dalam Node.js)

### Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/Bl4cklotus007/Quis-vue.git
   ```

2. Masuk ke direktori proyek:

   ```bash
   cd Quis-vue
   ```

3. Install dependensi:

   ```bash
   npm install
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka browser dan kunjungi:
   ```
   http://localhost:3000
   ```

## Struktur Proyek

```
src/
├── assets/        # Aset statis
├── components/    # Komponen Vue
├── views/         # Komponen halaman
├── router/        # Konfigurasi Vue Router
├── store/         # Manajemen state
└── App.vue        # Komponen utama
```

## Penggunaan

1. **Akses Siswa**

   - Login dengan kredensial siswa
   - Jelajahi mata pelajaran yang tersedia
   - Pilih materi untuk memulai kuis
   - Selesaikan kuis dalam batas waktu
   - Lihat skor dan performa Anda

2. **Akses Admin**
   - Login dengan kredensial admin
   - Kelola mata pelajaran dan materi
   - Tambah, edit, atau hapus soal kuis
   - Pantau performa siswa

## Berkontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b fitur/FiturMenarik`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan Fitur Menarik'`)
4. Push ke branch (`git push origin fitur/FiturMenarik`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

## Ucapan Terima Kasih

- Tim Vue.js untuk framework yang luar biasa
- Tim Bootstrap untuk komponen UI
- Semua kontributor yang telah membantu meningkatkan proyek ini

## Endpoint API

### Autentikasi

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

### Materi

- GET /api/materi
- GET /api/materi/:id
- POST /api/materi
- PUT /api/materi/:id
- DELETE /api/materi/:id

### Soal

- GET /api/soal
- GET /api/soal/:id
- POST /api/soal
- PUT /api/soal/:id
- DELETE /api/soal/:id

### Skor

- GET /api/skor
- GET /api/skor/user/:userId
- POST /api/skor
- GET /api/skor/stats/:userId
