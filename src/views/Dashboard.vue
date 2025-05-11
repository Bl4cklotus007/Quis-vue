<template>
  <div class="dashboard-page py-4">
    <!-- Header -->
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-mortarboard-fill display-4 text-primary me-3"></i>
          <div>
            <h1 class="mb-0">Dashboard</h1>
            <p class="text-muted mb-0">Selamat datang, {{ user?.username }}</p>
          </div>
        </div>
        <div>
          <router-link to="/admin" class="btn btn-outline-primary me-2" v-if="isAdmin">
            <i class="bi bi-gear me-2"></i>Admin Panel
          </router-link>
          <button @click="handleLogout" class="btn btn-outline-danger">
            <i class="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>

      <!-- Subject Cards -->
      <div class="row g-4">
        <div v-for="subject in subjects" :key="subject.id" class="col-md-6 col-lg-4">
          <div class="card h-100 subject-card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <div class="subject-icon me-3">
                  <i :class="['bi', subject.icon, 'display-4', subject.color]"></i>
                </div>
                <h5 class="card-title mb-0">{{ subject.name }}</h5>
              </div>
              <p class="card-text text-muted">{{ subject.description }}</p>
              <router-link 
                :to="{ name: 'materi', query: { subject: subject.id }}" 
                class="btn btn-primary w-100"
              >
                <i class="bi bi-book me-2"></i>Materi
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAdmin = ref(false)
const user = ref(null)

const subjects = [
  {
    id: 1,
    name: 'Matematika',
    description: 'Belajar konsep matematika dasar, aljabar, dan geometri',
    icon: 'bi-calculator',
    color: 'text-primary'
  },
  {
    id: 2,
    name: 'IPA',
    description: 'Mempelajari ilmu pengetahuan alam dan fenomena alam',
    icon: 'bi-flask',
    color: 'text-success'
  },
  {
    id: 3,
    name: 'IPS',
    description: 'Memahami sejarah, geografi, dan ilmu sosial lainnya',
    icon: 'bi-globe',
    color: 'text-info'
  },
  {
    id: 4,
    name: 'Bahasa Indonesia',
    description: 'Mengembangkan kemampuan berbahasa Indonesia',
    icon: 'bi-translate',
    color: 'text-warning'
  },
  {
    id: 5,
    name: 'Bahasa Inggris',
    description: 'Belajar bahasa Inggris untuk komunikasi internasional',
    icon: 'bi-translate',
    color: 'text-danger'
  },
  {
    id: 6,
    name: 'Pendidikan Agama',
    description: 'Mempelajari nilai-nilai agama dan moral',
    icon: 'bi-book',
    color: 'text-secondary'
  }
]

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = userData.role === 'admin'
  user.value = userData
})

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
.dashboard-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.subject-card {
  transition: all 0.3s ease;
  background: white;
  border-radius: 15px;
  overflow: hidden;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.subject-icon {
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

.btn-outline-danger {
  border-width: 2px;
}

.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.1);
}

.card-title {
  font-weight: 600;
  color: #2c3e50;
}

.text-muted {
  color: #6c757d !important;
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem;
  }
  
  .subject-icon {
    width: 50px;
    height: 50px;
  }
}
</style> 