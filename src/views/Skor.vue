<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Riwayat Skor</h1>
      <router-link to="/dashboard" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>Kembali ke Dashboard
      </router-link>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Mata Pelajaran</th>
                <th>Materi</th>
                <th>Skor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(score, index) in sortedScores" :key="index">
                <td>{{ formatDate(score.date) }}</td>
                <td>{{ score.subject }}</td>
                <td>{{ score.materi }}</td>
                <td>{{ score.score }}%</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': score.score >= 70,
                      'bg-warning': score.score >= 50 && score.score < 70,
                      'bg-danger': score.score < 50
                    }"
                  >
                    {{ getScoreStatus(score.score) }}
                  </span>
                </td>
              </tr>
              <tr v-if="scores.length === 0">
                <td colspan="5" class="text-center">Belum ada riwayat skor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4">
          <h4>Statistik</h4>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card bg-primary text-white">
                <div class="card-body">
                  <h5 class="card-title">Rata-rata Skor</h5>
                  <h2 class="card-text">{{ averageScore }}%</h2>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-success text-white">
                <div class="card-body">
                  <h5 class="card-title">Skor Tertinggi</h5>
                  <h2 class="card-text">{{ highestScore }}%</h2>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-info text-white">
                <div class="card-body">
                  <h5 class="card-title">Total Kuis</h5>
                  <h2 class="card-text">{{ scores.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const scores = ref([])

onMounted(() => {
  // Ambil data skor dari localStorage
  scores.value = JSON.parse(localStorage.getItem('scores') || '[]')
})

const sortedScores = computed(() => {
  return [...scores.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const averageScore = computed(() => {
  if (scores.value.length === 0) return 0
  const sum = scores.value.reduce((acc, curr) => acc + curr.score, 0)
  return Math.round(sum / scores.value.length)
})

const highestScore = computed(() => {
  if (scores.value.length === 0) return 0
  return Math.max(...scores.value.map(score => score.score))
})

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const getScoreStatus = (score) => {
  if (score >= 70) return 'Baik'
  if (score >= 50) return 'Cukup'
  return 'Kurang'
}
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5em 1em;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
</style> 