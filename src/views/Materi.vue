<template>
  <div class="materi-page py-4">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-book display-4 text-primary me-3"></i>
          <div>
            <h1 class="mb-0">Materi Pembelajaran</h1>
            <p class="text-muted mb-0">{{ getSubjectName() }}</p>
          </div>
        </div>
        <router-link to="/dashboard" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left me-2"></i>Kembali
        </router-link>
      </div>

      <!-- Materials List -->
      <div class="row g-4">
        <div v-for="material in materials" :key="material.id" class="col-md-6 col-lg-4">
          <div class="card h-100 material-card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <div class="material-icon me-3">
                  <i class="bi bi-file-text display-4 text-primary"></i>
                </div>
                <h5 class="card-title mb-0">{{ material.title }}</h5>
              </div>
              <p class="card-text text-muted">{{ material.description }}</p>
              <div class="d-flex gap-2">
                <button @click="startQuiz(material.id)" class="btn btn-primary flex-grow-1">
                  <i class="bi bi-pencil-square me-2"></i>Mulai Quiz
                </button>
                <button @click="viewMaterial(material.id)" class="btn btn-outline-primary">
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Materials Message -->
      <div v-if="materials.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h3>Belum ada materi</h3>
        <p class="text-muted">Materi untuk mata pelajaran ini akan segera ditambahkan.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const materials = ref([])

const subjects = {
  1: 'Matematika',
  2: 'IPA',
  3: 'IPS',
  4: 'Bahasa Indonesia',
  5: 'Bahasa Inggris',
  6: 'Pendidikan Agama'
}

// Dummy materials for each subject
const allMaterials = [
  // Matematika
  { id: 101, subjectId: 1, title: 'Pengenalan Aljabar', description: 'Materi dasar tentang konsep aljabar dan persamaan linear.' },
  { id: 102, subjectId: 1, title: 'Geometri Dasar', description: 'Mempelajari bentuk-bentuk geometri dan perhitungannya.' },
  { id: 103, subjectId: 1, title: 'Statistika Dasar', description: 'Pengenalan statistik dan cara membaca data.' },
  // IPA
  { id: 201, subjectId: 2, title: 'Sistem Tata Surya', description: 'Mengenal planet dan benda langit dalam tata surya.' },
  { id: 202, subjectId: 2, title: 'Sistem Pencernaan', description: 'Mempelajari organ dan proses pencernaan manusia.' },
  { id: 203, subjectId: 2, title: 'Perubahan Wujud Zat', description: 'Mengenal perubahan wujud zat dan contohnya.' },
  // IPS
  { id: 301, subjectId: 3, title: 'Sejarah Kemerdekaan', description: 'Peristiwa penting dalam sejarah kemerdekaan Indonesia.' },
  { id: 302, subjectId: 3, title: 'Peta dan Atlas', description: 'Belajar membaca peta dan atlas.' },
  { id: 303, subjectId: 3, title: 'Kegiatan Ekonomi', description: 'Jenis-jenis kegiatan ekonomi di masyarakat.' },
  // Bahasa Indonesia
  { id: 401, subjectId: 4, title: 'Teks Narasi', description: 'Pengertian dan contoh teks narasi.' },
  { id: 402, subjectId: 4, title: 'Teks Deskripsi', description: 'Mengenal ciri dan struktur teks deskripsi.' },
  { id: 403, subjectId: 4, title: 'Puisi', description: 'Belajar membuat dan memahami puisi.' },
  // Bahasa Inggris
  { id: 501, subjectId: 5, title: 'Simple Present Tense', description: 'Penggunaan simple present tense dalam kalimat.' },
  { id: 502, subjectId: 5, title: 'Vocabulary: Animals', description: 'Kosakata bahasa Inggris tentang hewan.' },
  { id: 503, subjectId: 5, title: 'Daily Activities', description: 'Menyusun kalimat tentang aktivitas sehari-hari.' },
  // Pendidikan Agama
  { id: 601, subjectId: 6, title: 'Akhlak Terpuji', description: 'Contoh akhlak terpuji dalam kehidupan sehari-hari.' },
  { id: 602, subjectId: 6, title: 'Rukun Islam', description: 'Penjelasan tentang lima rukun Islam.' },
  { id: 603, subjectId: 6, title: 'Kisah Nabi', description: 'Kisah-kisah teladan dari para nabi.' },
]

const getSubjectName = () => {
  const subjectId = parseInt(route.query.subject)
  return subjects[subjectId] || 'Mata Pelajaran'
}

onMounted(() => {
  const subjectId = parseInt(route.query.subject)
  materials.value = allMaterials.filter(m => m.subjectId === subjectId)
})

const startQuiz = (materialId) => {
  console.log('Starting quiz for material:', materialId) // Debug log
  router.push({ 
    name: 'kuis', 
    query: { materi: materialId },
    params: { id: materialId }
  })
}

const viewMaterial = (materialId) => {
  // TODO: Implement material viewing functionality
  console.log('View material:', materialId)
}
</script>

<style scoped>
.materi-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.material-card {
  transition: all 0.3s ease;
  background: white;
  border-radius: 15px;
  overflow: hidden;
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.material-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: rgba(0,0,0,0.05);
}

.btn {
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(45deg, #0d6efd, #0a58ca);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(45deg, #0a58ca, #084298);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
}

.btn-outline-primary {
  border-width: 2px;
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.1);
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
}

.text-muted {
  color: #6c757d !important;
}

.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem;
  }
  
  .material-icon {
    width: 50px;
    height: 50px;
  }
}
</style> 