<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Kuis {{ currentSubject?.name }}</h1>
      <router-link to="/dashboard" class="btn btn-outline-secondary">Kembali ke Dashboard</router-link>
    </div>

    <div v-if="!quizStarted" class="text-center">
      <div class="card">
        <div class="card-body">
          <h3>Persiapan Kuis</h3>
          <p class="text-muted">Anda akan mengerjakan kuis untuk materi yang telah dipilih</p>
          <div class="mt-4">
            <button @click="startQuiz" class="btn btn-primary btn-lg">
              <i class="bi bi-pencil-square me-2"></i>Mulai Kuis
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="quiz-container">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3">
            <h5>Soal {{ currentQuestionIndex + 1 }} dari {{ questions.length }}</h5>
            <div class="timer">Waktu: {{ formatTime(timeLeft) }}</div>
          </div>

          <div class="question-container">
            <h4 class="mb-4">{{ currentQuestion.question }}</h4>
            
            <div class="options-list">
              <div
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="option-item mb-3"
              >
                <div
                  class="form-check p-3 border rounded"
                  :class="{
                    'bg-success text-white': showResult && option === currentQuestion.correctAnswer,
                    'bg-danger text-white': showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer
                  }"
                >
                  <input
                    class="form-check-input"
                    type="radio"
                    :name="'question' + currentQuestionIndex"
                    :id="'option' + index"
                    :value="option"
                    v-model="selectedAnswer"
                    :disabled="showResult"
                  />
                  <label class="form-check-label" :for="'option' + index">
                    {{ option }}
                  </label>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-4">
              <button
                v-if="currentQuestionIndex > 0"
                @click="previousQuestion"
                class="btn btn-secondary"
                :disabled="showResult"
              >
                Sebelumnya
              </button>
              <button
                v-if="currentQuestionIndex < questions.length - 1"
                @click="nextQuestion"
                class="btn btn-primary"
                :disabled="!selectedAnswer || showResult"
              >
                Selanjutnya
              </button>
              <button
                v-else
                @click="finishQuiz"
                class="btn btn-success"
                :disabled="!selectedAnswer || showResult"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Hasil Kuis -->
    <div class="modal fade" id="resultModal" tabindex="-1" ref="resultModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Hasil Kuis</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <h4 class="text-center mb-4">Skor Anda: {{ score }}%</h4>
            <div class="text-center">
              <p>Jawaban Benar: {{ correctAnswers }}</p>
              <p>Jawaban Salah: {{ questions.length - correctAnswers }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Tutup</button>
            <router-link to="/skor" class="btn btn-primary" @click="closeModal">
              <i class="bi bi-list-check me-2"></i>Lihat Riwayat Skor
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useRouter, useRoute } from 'vue-router'
import { soalAPI } from '@/services/api.js'

const router = useRouter()
const route = useRoute()
const selectedMateriId = computed(() => parseInt(route.query.materi))

const subjects = [
  {
    id: 1,
    name: 'Matematika',
    description: 'Kuis tentang aljabar dan persamaan linear',
    materiId: 1
  },
  {
    id: 2,
    name: 'IPA',
    description: 'Kuis tentang sistem tata surya',
    materiId: 3
  },
  {
    id: 3,
    name: 'IPS',
    description: 'Kuis tentang sejarah kemerdekaan Indonesia',
    materiId: 4
  },
  {
    id: 4,
    name: 'Bahasa Indonesia',
    description: 'Kuis tentang teks narasi',
    materiId: 5
  },
  {
    id: 5,
    name: 'Bahasa Inggris',
    description: 'Kuis tentang simple present tense',
    materiId: 6
  },
  {
    id: 6,
    name: 'Pendidikan Agama',
    description: 'Kuis tentang akhlak terpuji',
    materiId: 7
  }
]

const currentSubject = computed(() => {
  const materiId = selectedMateriId.value
  return subjects.find(s => s.materiId === materiId)
})

const quizStarted = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref('')
const showResult = ref(false)
const timeLeft = ref(300) // 5 menit dalam detik
const timer = ref(null)
const resultModal = ref(null)
let modal = null

const questions = ref([])
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const score = ref(0)
const correctAnswers = ref(0)
const userAnswers = ref([]) // Menyimpan jawaban user untuk setiap soal

onMounted(async () => {
  modal = new Modal(resultModal.value)
  // Redirect to dashboard if no material is selected
  if (!selectedMateriId.value) {
    router.push('/dashboard')
    return
  }
  // Fetch questions from API
  try {
    const res = await soalAPI.getByMateri(selectedMateriId.value)
    questions.value = res.data
    // Inisialisasi array jawaban
    userAnswers.value = new Array(questions.value.length).fill(null)
  } catch (err) {
    console.error('Gagal load soal:', err)
  }
})

const startQuiz = () => {
  quizStarted.value = true
  startTimer()
}

const startTimer = () => {
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      finishQuiz()
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    // Simpan jawaban saat ini
    userAnswers.value[currentQuestionIndex.value] = selectedAnswer.value
    currentQuestionIndex.value++
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value] || ''
    showResult.value = false
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    // Simpan jawaban saat ini
    userAnswers.value[currentQuestionIndex.value] = selectedAnswer.value
    currentQuestionIndex.value--
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value] || ''
    showResult.value = false
  }
}

const closeModal = () => {
  if (modal) {
    modal.hide()
  }
}

const finishQuiz = () => {
  clearInterval(timer.value)
  showResult.value = true
  
  // Simpan jawaban terakhir
  userAnswers.value[currentQuestionIndex.value] = selectedAnswer.value
  
  // Hitung jumlah jawaban benar
  correctAnswers.value = questions.value.reduce((count, question, index) => {
    return count + (userAnswers.value[index] === question.correctAnswer ? 1 : 0)
  }, 0)
  
  // Hitung skor dalam persentase
  score.value = Math.round((correctAnswers.value / questions.value.length) * 100)
  
  // Simpan skor ke localStorage
  const scores = JSON.parse(localStorage.getItem('scores') || '[]')
  scores.push({
    subject: currentSubject.value.name,
    materi: questions.value[0]?.question.split(' ')[0] || 'Materi',
    score: score.value,
    correctAnswers: correctAnswers.value,
    totalQuestions: questions.value.length,
    date: new Date().toISOString()
  })
  localStorage.setItem('scores', JSON.stringify(scores))
  
  // Tampilkan modal
  if (modal) {
    modal.show()
  }
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.timer {
  font-size: 1.2rem;
  font-weight: bold;
}

.option-item {
  cursor: pointer;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn:disabled {
  cursor: not-allowed;
}
</style> 