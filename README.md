# SMP Quiz App

Aplikasi quiz untuk siswa SMP dengan fitur materi pembelajaran dan kuis.

## Fitur

- Autentikasi (Login/Register)
- Dashboard mata pelajaran
- Materi pembelajaran
- Kuis interaktif
- Sistem scoring
- Panel admin untuk manajemen konten

## Teknologi

- Vue.js 3
- Vue Router
- Axios
- Bootstrap 5
- Vite

## Instalasi

1. Clone repository

```bash
git clone https://github.com/username/smp-quiz-app.git
cd smp-quiz-app
```

2. Install dependencies

```bash
npm install
```

3. Buat file .env

```bash
VITE_API_URL=http://localhost:3000/api
```

4. Jalankan development server

```bash
npm run dev
```

## Build untuk Production

```bash
npm run build
```

## Deployment

Aplikasi ini di-deploy menggunakan Vercel. Untuk deployment:

1. Push ke GitHub
2. Hubungkan repository dengan Vercel
3. Atur environment variables di Vercel dashboard

## Struktur Proyek

```
src/
├── assets/        # Static assets
├── components/    # Vue components
├── router/        # Vue Router configuration
├── services/      # API services
├── views/         # Page components
└── App.vue        # Root component
```

## API Endpoints

### Auth

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

## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

MIT License
