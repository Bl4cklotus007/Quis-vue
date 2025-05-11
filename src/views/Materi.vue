<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Materi Pembelajaran</h1>
        <p class="text-muted" v-if="selectedSubject">
          {{ selectedSubject.name }} - {{ selectedSubject.description }}
        </p>
      </div>
      <router-link to="/dashboard" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>Kembali ke Dashboard
      </router-link>
    </div>

    <!-- Daftar Materi per Mata Pelajaran -->
    <div v-if="selectedSubject" class="row g-4">
      <div v-for="materi in getSubjectMaterials(selectedSubject.id)" :key="materi.id" class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">{{ materi.judul }}</h5>
              <span v-if="materi.isRead" class="badge bg-success">Sudah Dibaca</span>
            </div>
            <p class="card-text">{{ materi.deskripsi }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">{{ materi.kelas }}</span>
              <button class="btn btn-primary" @click="bacaMateri(materi)">
                {{ materi.isRead ? 'Baca Ulang' : 'Baca Materi' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal untuk menampilkan materi -->
    <div class="modal fade" id="materiModal" tabindex="-1" ref="materiModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedMateri?.judul }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedMateri">
            <div class="materi-content" v-html="selectedMateri.konten"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            <router-link 
              v-if="selectedMateri?.isRead"
              :to="{ name: 'kuis', query: { subject: selectedSubject?.id, materi: selectedMateri?.id }}" 
              class="btn btn-success"
              @click="modal.hide()"
            >
              <i class="bi bi-pencil-square me-2"></i>Lanjut ke Kuis
            </router-link>
            <button 
              v-else 
              class="btn btn-success" 
              disabled
              title="Baca materi terlebih dahulu"
            >
              <i class="bi bi-pencil-square me-2"></i>Baca Materi Terlebih Dahulu
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'

const route = useRoute()
const router = useRouter()

const subjects = [
  {
    id: 1,
    name: 'Matematika',
    description: 'Belajar konsep matematika dasar, aljabar, dan geometri',
    icon: 'bi bi-calculator text-primary'
  },
  {
    id: 2,
    name: 'IPA',
    description: 'Mempelajari ilmu pengetahuan alam dan fenomena alam',
    icon: 'bi bi-flask text-success'
  },
  {
    id: 3,
    name: 'IPS',
    description: 'Memahami sejarah, geografi, dan ilmu sosial lainnya',
    icon: 'bi bi-globe text-info'
  },
  {
    id: 4,
    name: 'Bahasa Indonesia',
    description: 'Mengembangkan kemampuan berbahasa Indonesia',
    icon: 'bi bi-translate text-danger'
  },
  {
    id: 5,
    name: 'Bahasa Inggris',
    description: 'Belajar bahasa Inggris untuk komunikasi internasional',
    icon: 'bi bi-translate text-warning'
  },
  {
    id: 6,
    name: 'Pendidikan Agama',
    description: 'Mempelajari nilai-nilai agama dan moral',
    icon: 'bi bi-book text-secondary'
  }
]

const selectedSubject = computed(() => {
  const subjectId = parseInt(route.query.subject)
  return subjects.find(s => s.id === subjectId) || null
})

const materiList = ref([
  // Matematika
  {
    id: 1,
    subjectId: 1,
    judul: 'Pengenalan Aljabar',
    kelas: 'Kelas 7',
    deskripsi: 'Materi dasar tentang aljabar dan persamaan linear.',
    konten: `
      <h4>Pengenalan Aljabar</h4>
      <p>Aljabar adalah cabang matematika yang mempelajari struktur, relasi, dan kuantitas.</p>
      <h5>Konsep Dasar:</h5>
      <ul>
        <li>Variabel dan Konstanta</li>
        <li>Persamaan Linear</li>
        <li>Operasi Aljabar</li>
      </ul>
      <p>Contoh persamaan linear: 2x + 3 = 7</p>
    `
  },
  {
    id: 2,
    subjectId: 1,
    judul: 'Geometri Dasar',
    kelas: 'Kelas 7',
    deskripsi: 'Materi tentang bangun datar dan bangun ruang.',
    konten: `
      <h4>Geometri Dasar</h4>
      <p>Geometri adalah cabang matematika yang mempelajari bentuk, ukuran, dan posisi relatif dari benda-benda.</p>
      <h5>Bangun Datar:</h5>
      <ul>
        <li>Segitiga</li>
        <li>Persegi</li>
        <li>Persegi Panjang</li>
        <li>Lingkaran</li>
      </ul>
    `
  },
  // IPA
  {
    id: 3,
    subjectId: 2,
    judul: 'Sistem Tata Surya',
    kelas: 'Kelas 7',
    deskripsi: 'Materi tentang planet dan benda langit dalam tata surya.',
    konten: `
      <h4>Sistem Tata Surya</h4>
      <p>Tata surya adalah kumpulan benda langit yang terdiri dari matahari dan semua objek yang mengorbitnya.</p>
      <h5>Planet dalam Tata Surya:</h5>
      <ul>
        <li>Merkurius</li>
        <li>Venus</li>
        <li>Bumi</li>
        <li>Mars</li>
        <li>Jupiter</li>
        <li>Saturnus</li>
        <li>Uranus</li>
        <li>Neptunus</li>
      </ul>
    `
  },
  {
    id: 8,
    subjectId: 2,
    judul: 'Sistem Pencernaan Manusia',
    kelas: 'Kelas 8',
    deskripsi: 'Materi tentang organ pencernaan dan proses pencernaan makanan.',
    konten: `
      <h4>Sistem Pencernaan Manusia</h4>
      <p>Sistem pencernaan adalah sistem organ yang berfungsi untuk mencerna makanan.</p>
      <h5>Organ Pencernaan:</h5>
      <ul>
        <li>Mulut</li>
        <li>Kerongkongan</li>
        <li>Lambung</li>
        <li>Usus Halus</li>
        <li>Usus Besar</li>
      </ul>
    `
  },
  // IPS
  {
    id: 4,
    subjectId: 3,
    judul: 'Sejarah Kemerdekaan Indonesia',
    kelas: 'Kelas 8',
    deskripsi: 'Materi tentang perjuangan kemerdekaan Indonesia.',
    konten: `
      <h4>Sejarah Kemerdekaan Indonesia</h4>
      <p>Proklamasi Kemerdekaan Indonesia dilaksanakan pada tanggal 17 Agustus 1945.</p>
      <h5>Peristiwa Penting:</h5>
      <ul>
        <li>Peristiwa Rengasdengklok</li>
        <li>Penyusunan Teks Proklamasi</li>
        <li>Pembacaan Proklamasi</li>
        <li>Penyebaran Berita Kemerdekaan</li>
      </ul>
    `
  },
  // Bahasa Indonesia
  {
    id: 5,
    subjectId: 4,
    judul: 'Teks Narasi',
    kelas: 'Kelas 7',
    deskripsi: 'Materi tentang pengertian dan jenis-jenis teks narasi.',
    konten: `
      <h4>Teks Narasi</h4>
      <p>Teks narasi adalah teks yang menceritakan suatu peristiwa atau kejadian.</p>
      <h5>Jenis-jenis Teks Narasi:</h5>
      <ul>
        <li>Narasi Ekspositoris</li>
        <li>Narasi Sugestif</li>
        <li>Narasi Artistik</li>
      </ul>
    `
  },
  // Bahasa Inggris
  {
    id: 6,
    subjectId: 5,
    judul: 'Simple Present Tense',
    kelas: 'Kelas 7',
    deskripsi: 'Materi tentang penggunaan simple present tense.',
    konten: `
      <h4>Simple Present Tense</h4>
      <p>Simple present tense digunakan untuk menyatakan kebiasaan, fakta umum, dan kebenaran.</p>
      <h5>Rumus:</h5>
      <ul>
        <li>Positif: Subject + Verb1(s/es)</li>
        <li>Negatif: Subject + do/does + not + Verb1</li>
        <li>Interogatif: Do/Does + Subject + Verb1?</li>
      </ul>
    `
  },
  // Pendidikan Agama
  {
    id: 7,
    subjectId: 6,
    judul: 'Akhlak Terpuji',
    kelas: 'Kelas 7',
    deskripsi: 'Materi tentang akhlak terpuji dalam kehidupan sehari-hari.',
    konten: `
      <h4>Akhlak Terpuji</h4>
      <p>Akhlak terpuji adalah perilaku baik yang sesuai dengan ajaran agama.</p>
      <h5>Contoh Akhlak Terpuji:</h5>
      <ul>
        <li>Jujur</li>
        <li>Amanah</li>
        <li>Istiqomah</li>
        <li>Tawadhu</li>
      </ul>
    `
  }
])

const selectedMateri = ref(null)
const materiModal = ref(null)
let modal = null

onMounted(() => {
  modal = new Modal(materiModal.value)
  // Load read status from localStorage
  const readMateri = JSON.parse(localStorage.getItem('readMateri') || '[]')
  materiList.value = materiList.value.map(materi => ({
    ...materi,
    isRead: readMateri.includes(materi.id)
  }))

  // Redirect to dashboard if no subject is selected
  if (!selectedSubject.value) {
    router.push('/dashboard')
  }
})

const getSubjectMaterials = (subjectId) => {
  return materiList.value.filter(materi => materi.subjectId === subjectId)
}

const bacaMateri = (materi) => {
  selectedMateri.value = materi
  modal.show()
  
  // Mark materi as read when modal is shown
  if (!materi.isRead) {
    materi.isRead = true
    // Save to localStorage
    const readMateri = JSON.parse(localStorage.getItem('readMateri') || '[]')
    if (!readMateri.includes(materi.id)) {
      readMateri.push(materi.id)
      localStorage.setItem('readMateri', JSON.stringify(readMateri))
    }
  }
}
</script>

<style scoped>
.materi-content {
  line-height: 1.6;
}

.materi-content h4 {
  color: #0d6efd;
  margin-bottom: 1rem;
}

.materi-content h5 {
  color: #198754;
  margin: 1rem 0;
}

.materi-content ul {
  padding-left: 1.5rem;
}

.materi-content li {
  margin-bottom: 0.5rem;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
</style> 