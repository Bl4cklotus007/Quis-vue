<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <router-link to="/dashboard" class="btn btn-outline-secondary me-3">
          <i class="bi bi-arrow-left me-2"></i>Kembali
        </router-link>
        <h1 class="mb-0">Admin Panel</h1>
      </div>
      <div>
        <button class="btn btn-outline-primary me-2" @click="showAddMateriModal = true">
          <i class="bi bi-plus-circle me-2"></i>Tambah Materi
        </button>
        <button class="btn btn-outline-success" @click="showAddSoalModal = true">
          <i class="bi bi-plus-circle me-2"></i>Tambah Soal
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = ''"></button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Daftar Materi -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Daftar Materi</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mata Pelajaran</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materi in materiList" :key="materi.id">
                <td>{{ materi.id }}</td>
                <td>{{ materi.subject }}</td>
                <td>{{ materi.title }}</td>
                <td>{{ materi.description }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="editMateri(materi)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteMateri(materi.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Daftar Soal -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Daftar Soal</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID Materi</th>
                <th>Pertanyaan</th>
                <th>Jawaban Benar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="soal in soalList" :key="soal.id">
                <td>{{ soal.materiId }}</td>
                <td>{{ soal.question }}</td>
                <td>{{ soal.correctAnswer }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="editSoal(soal)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteSoal(soal.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Materi -->
    <div class="modal fade" id="materiModal" tabindex="-1" ref="materiModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditingMateri ? 'Edit Materi' : 'Tambah Materi' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveMateri">
              <div class="mb-3">
                <label class="form-label">Mata Pelajaran</label>
                <select class="form-select" v-model="currentMateri.subject" required>
                  <option value="Matematika">Matematika</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Pendidikan Agama">Pendidikan Agama</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Judul</label>
                <input type="text" class="form-control" v-model="currentMateri.title" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Deskripsi</label>
                <textarea class="form-control" v-model="currentMateri.description" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Konten</label>
                <textarea class="form-control" v-model="currentMateri.content" rows="5" required></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Soal -->
    <div class="modal fade" id="soalModal" tabindex="-1" ref="soalModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditingSoal ? 'Edit Soal' : 'Tambah Soal' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSoal">
              <div class="mb-3">
                <label class="form-label">Materi</label>
                <select class="form-select" v-model="currentSoal.materiId" required>
                  <option v-for="materi in materiList" :key="materi.id" :value="materi.id">
                    {{ materi.subject }} - {{ materi.title }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Pertanyaan</label>
                <textarea class="form-control" v-model="currentSoal.question" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Pilihan Jawaban</label>
                <div v-for="(option, index) in currentSoal.options" :key="index" class="mb-2">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="currentSoal.options[index]" required>
                    <button type="button" class="btn btn-outline-danger" @click="removeOption(index)" v-if="currentSoal.options.length > 2">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="addOption">
                  <i class="bi bi-plus-circle me-2"></i>Tambah Pilihan
                </button>
              </div>
              <div class="mb-3">
                <label class="form-label">Jawaban Benar</label>
                <select class="form-select" v-model="currentSoal.correctAnswer" required>
                  <option v-for="(option, index) in currentSoal.options" :key="index" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'
import { materiAPI, soalAPI } from '@/services/api'

// State
const materiList = ref([])
const soalList = ref([])
const showAddMateriModal = ref(false)
const showAddSoalModal = ref(false)
const isEditingMateri = ref(false)
const isEditingSoal = ref(false)
const materiModal = ref(null)
const soalModal = ref(null)
const loading = ref(false)
const error = ref('')
let modalMateri = null
let modalSoal = null

const currentMateri = ref({
  id: null,
  subject: '',
  title: '',
  description: '',
  content: ''
})

const currentSoal = ref({
  id: null,
  materiId: null,
  question: '',
  options: ['', ''],
  correctAnswer: ''
})

// Methods
onMounted(async () => {
  // Inisialisasi modal
  modalMateri = new Modal(materiModal.value)
  modalSoal = new Modal(soalModal.value)

  // Load data dari API
  await loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const [materiResponse, soalResponse] = await Promise.all([
      materiAPI.getAll(),
      soalAPI.getAll()
    ])
    
    materiList.value = materiResponse.data
    soalList.value = soalResponse.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    loading.value = false
  }
}

const saveMateri = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (isEditingMateri.value) {
      await materiAPI.update(currentMateri.value.id, currentMateri.value)
    } else {
      await materiAPI.create(currentMateri.value)
    }
    
    await loadData()
    modalMateri.hide()
    resetForm()
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan materi'
  } finally {
    loading.value = false
  }
}

const saveSoal = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (isEditingSoal.value) {
      await soalAPI.update(currentSoal.value.id, currentSoal.value)
    } else {
      await soalAPI.create(currentSoal.value)
    }
    
    await loadData()
    modalSoal.hide()
    resetForm()
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan soal'
  } finally {
    loading.value = false
  }
}

const editMateri = (materi) => {
  isEditingMateri.value = true
  currentMateri.value = { ...materi }
  modalMateri.show()
}

const editSoal = (soal) => {
  isEditingSoal.value = true
  currentSoal.value = { ...soal }
  modalSoal.show()
}

const deleteMateri = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
    try {
      loading.value = true
      error.value = ''
      
      await materiAPI.delete(id)
      await loadData()
    } catch (err) {
      error.value = err.response?.data?.message || 'Terjadi kesalahan saat menghapus materi'
    } finally {
      loading.value = false
    }
  }
}

const deleteSoal = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
    try {
      loading.value = true
      error.value = ''
      
      await soalAPI.delete(id)
      await loadData()
    } catch (err) {
      error.value = err.response?.data?.message || 'Terjadi kesalahan saat menghapus soal'
    } finally {
      loading.value = false
    }
  }
}

const addOption = () => {
  currentSoal.value.options.push('')
}

const removeOption = (index) => {
  currentSoal.value.options.splice(index, 1)
  if (currentSoal.value.correctAnswer === currentSoal.value.options[index]) {
    currentSoal.value.correctAnswer = ''
  }
}

const resetForm = () => {
  isEditingMateri.value = false
  isEditingSoal.value = false
  currentMateri.value = {
    id: null,
    subject: '',
    title: '',
    description: '',
    content: ''
  }
  currentSoal.value = {
    id: null,
    materiId: null,
    question: '',
    options: ['', ''],
    correctAnswer: ''
  }
}

// Watch untuk menampilkan modal
watch(showAddMateriModal, (newValue) => {
  if (newValue) {
    resetForm()
    modalMateri.show()
    showAddMateriModal.value = false
  }
})

watch(showAddSoalModal, (newValue) => {
  if (newValue) {
    resetForm()
    modalSoal.show()
    showAddSoalModal.value = false
  }
})
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style> 