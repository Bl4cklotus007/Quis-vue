<template>
  <div class="quiz-page py-4">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-pencil-square display-4 text-primary me-3"></i>
          <div>
            <h1 class="mb-0">Quiz</h1>
            <p class="text-muted mb-0">{{ currentMaterial?.title || 'Loading...' }}</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <div class="timer-badge">
            <i class="bi bi-clock me-2"></i>
            {{ formatTime(timeLeft) }}
          </div>
          <button @click="confirmExit" class="btn btn-outline-danger">
            <i class="bi bi-x-circle me-2"></i>Keluar
          </button>
        </div>
      </div>

      <!-- Quiz Content -->
      <div v-if="!quizCompleted && questions && questions.length > 0" class="quiz-content">
        <!-- Progress Bar -->
        <div class="progress mb-4" style="height: 8px;">
          <div 
            class="progress-bar bg-primary" 
            :style="{ width: `${(currentQuestionIndex + 1) / questions.length * 100}%` }"
          ></div>
        </div>

        <!-- Question Card -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0">Pertanyaan {{ currentQuestionIndex + 1 }} dari {{ questions.length }}</h5>
              <span class="badge bg-primary">{{ currentQuestion.points || 0 }} poin</span>
            </div>
            <p class="question-text mb-4">{{ currentQuestion.text }}</p>

            <!-- Options -->
            <div class="options-list">
              <div 
                v-for="(option, index) in (currentQuestion.options || [])" 
                :key="index"
                class="option-item"
                :class="{ 
                  'selected': selectedAnswer === index,
                  'correct': showResult && index === currentQuestion.correctAnswer,
                  'incorrect': showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer
                }"
                @click="selectAnswer(index)"
              >
                <div class="option-marker">{{ String.fromCharCode(65 + index) }}</div>
                <div class="option-text">{{ option }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="d-flex justify-content-between">
          <button 
            class="btn btn-outline-primary" 
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
          >
            <i class="bi bi-arrow-left me-2"></i>Sebelumnya
          </button>
          <button 
            class="btn btn-primary" 
            @click="nextQuestion"
            :disabled="!selectedAnswer"
          >
            {{ isLastQuestion ? 'Selesai' : 'Selanjutnya' }}
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

      <!-- No Questions Message -->
      <div v-else-if="!quizCompleted" class="text-center py-5">
        <i class="bi bi-exclamation-circle display-1 text-muted mb-3"></i>
        <h3>Belum ada soal</h3>
        <p class="text-muted">Soal untuk materi ini belum tersedia.</p>
        <router-link to="/dashboard" class="btn btn-primary mt-3">
          <i class="bi bi-arrow-left me-2"></i>Kembali ke Dashboard
        </router-link>
      </div>

      <!-- Results -->
      <div v-else class="results-content text-center">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-5">
            <i class="bi bi-trophy display-1 text-warning mb-4"></i>
            <h2 class="mb-3">Quiz Selesai!</h2>
            <p class="text-muted mb-4">Skor Anda: {{ score }} dari {{ totalPoints }} poin</p>
            <div class="d-flex justify-content-center gap-3">
              <button @click="restartQuiz" class="btn btn-primary">
                <i class="bi bi-arrow-repeat me-2"></i>Ulangi Quiz
              </button>
              <router-link to="/dashboard" class="btn btn-outline-primary">
                <i class="bi bi-house me-2"></i>Kembali ke Dashboard
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const questions = ref([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const showResult = ref(false)
const quizCompleted = ref(false)
const score = ref(0)
const timeLeft = ref(600) // 10 minutes in seconds
let timer = null

const currentMaterial = ref({
  title: 'Loading...',
  id: null
})

// Initialize with empty question structure
const currentQuestion = computed(() => {
  if (!questions.value || questions.value.length === 0) {
    return {
      text: 'Tidak ada pertanyaan',
      options: [],
      correctAnswer: 0,
      points: 0
    }
  }
  const question = questions.value[currentQuestionIndex.value]
  return question || {
    text: 'Tidak ada pertanyaan',
    options: [],
    correctAnswer: 0,
    points: 0
  }
})

const isLastQuestion = computed(() => {
  return questions.value.length > 0 && currentQuestionIndex.value === questions.value.length - 1
})

const totalPoints = computed(() => {
  return questions.value.reduce((sum, q) => sum + (q.points || 0), 0)
})

onMounted(async () => {
  try {
    // Get materiId from query
    const materiId = parseInt(route.query.materi)
    console.log('Loading quiz for material:', materiId) // Debug log
    
    if (!materiId || isNaN(materiId)) {
      console.error('Invalid material ID')
      router.push('/dashboard')
      return
    }

    // Check and initialize localStorage
    console.log('Checking localStorage...')
    
    // Initialize dummy questions if not exists
    const storedQuestions = localStorage.getItem('questions')
    console.log('Current questions in localStorage:', storedQuestions)
    
    if (!storedQuestions) {
      console.log('Initializing dummy questions...')
      const dummyQuestions = [
        {
          materialId: 101,
          text: 'Apa itu variabel dalam aljabar?',
          options: ['Huruf yang mewakili nilai', 'Angka tetap', 'Operator matematika', 'Simbol geometri'],
          correctAnswer: 0,
          points: 10
        },
        {
          materialId: 101,
          text: 'Berapakah hasil dari 2x + 3 = 7?',
          options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
          correctAnswer: 0,
          points: 10
        },
        {
          materialId: 102,
          text: 'Berapakah jumlah sudut pada segitiga?',
          options: ['90°', '180°', '270°', '360°'],
          correctAnswer: 1,
          points: 10
        },
        {
          materialId: 102,
          text: 'Bentuk geometri yang memiliki 4 sisi sama panjang adalah?',
          options: ['Persegi', 'Segitiga', 'Lingkaran', 'Trapesium'],
          correctAnswer: 0,
          points: 10
        }
      ]
      localStorage.setItem('questions', JSON.stringify(dummyQuestions))
      alert('Data soal berhasil diinisialisasi!')
      console.log('Dummy questions initialized:', dummyQuestions)
    }

    // Initialize dummy materials if not exists
    const storedMaterials = localStorage.getItem('materials')
    console.log('Current materials in localStorage:', storedMaterials)
    
    if (!storedMaterials) {
      console.log('Initializing dummy materials...')
      const dummyMaterials = [
        { id: 101, title: 'Pengenalan Aljabar', subjectId: 1 },
        { id: 102, title: 'Geometri Dasar', subjectId: 1 }
      ]
      localStorage.setItem('materials', JSON.stringify(dummyMaterials))
      alert('Data materi berhasil diinisialisasi!')
      console.log('Dummy materials initialized:', dummyMaterials)
    }

    // Load material info
    const materialsData = localStorage.getItem('materials')
    if (materialsData) {
      const materials = JSON.parse(materialsData)
      const material = materials.find(m => m.id === materiId)
      if (material) {
        currentMaterial.value = material
        console.log('Loaded material:', material)
      } else {
        console.warn('Material not found:', materiId)
        alert('Materi tidak ditemukan!')
        router.push('/dashboard')
        return
      }
    }

    // Load questions
    const questionsData = localStorage.getItem('questions')
    if (questionsData) {
      const allQuestions = JSON.parse(questionsData)
      questions.value = allQuestions.filter(q => q.materialId === materiId)
      console.log('Loaded questions for material:', materiId, questions.value)
    }

    if (questions.value.length === 0) {
      console.warn('No questions found for material:', materiId)
      alert('Belum ada soal untuk materi ini!')
      questions.value = []
    }

    startTimer()
  } catch (error) {
    console.error('Error initializing quiz:', error)
    alert('Terjadi kesalahan saat memuat kuis!')
    questions.value = []
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      submitQuiz()
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const selectAnswer = (index) => {
  if (!showResult.value) {
    selectedAnswer.value = index
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = null
    showResult.value = false
  }
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    submitQuiz()
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    showResult.value = false
  }
}

const submitQuiz = () => {
  quizCompleted.value = true
  if (timer) clearInterval(timer)
  
  // Calculate score
  score.value = questions.value.reduce((total, question, index) => {
    const userAnswer = selectedAnswer.value
    return total + (userAnswer === question.correctAnswer ? question.points : 0)
  }, 0)
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  quizCompleted.value = false
  score.value = 0
  timeLeft.value = 600
  startTimer()
}

const confirmExit = () => {
  if (confirm('Apakah Anda yakin ingin keluar dari quiz? Progress Anda akan hilang.')) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.quiz-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.timer-badge {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  font-weight: 500;
  color: #0d6efd;
}

.question-text {
  font-size: 1.1rem;
  color: #2c3e50;
  line-height: 1.6;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.05);
}

.option-item.selected {
  border-color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.1);
}

.option-item.correct {
  border-color: #198754;
  background-color: rgba(25, 135, 84, 0.1);
}

.option-item.incorrect {
  border-color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.option-marker {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  border-radius: 50%;
  margin-right: 1rem;
  font-weight: 600;
  color: #6c757d;
}

.option-item.selected .option-marker {
  background-color: #0d6efd;
  color: white;
}

.option-item.correct .option-marker {
  background-color: #198754;
  color: white;
}

.option-item.incorrect .option-marker {
  background-color: #dc3545;
  color: white;
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

.btn-outline-danger {
  border-width: 2px;
}

.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.1);
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 1rem;
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem;
  }
  
  .question-text {
    font-size: 1rem;
  }
  
  .option-item {
    padding: 0.75rem;
  }
}
</style> 