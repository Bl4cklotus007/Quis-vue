<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Dashboard</h1>
      <div>
        <router-link to="/admin" class="btn btn-outline-primary me-2" v-if="isAdmin">
          <i class="bi bi-gear me-2"></i>Admin Panel
        </router-link>
        <button @click="handleLogout" class="btn btn-outline-danger">
          <i class="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </div>
    
    <div class="row g-4">
      <div v-for="subject in subjects" :key="subject.id" class="col-md-6 col-lg-4">
        <div class="card h-100 subject-card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="subject-icon me-3">
                <i :class="['bi', subject.icon, 'display-4', 'mb-3', subject.color]"></i>
              </div>
              <h5 class="card-title mb-0">{{ subject.name }}</h5>
            </div>
            <p class="card-text">{{ subject.description }}</p>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAdmin = ref(false)

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
  // Cek apakah user adalah admin
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.role === 'admin'
})

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.subject-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.subject-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: rgba(0,0,0,0.05);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bi {
  font-size: 1.1rem;
}

.display-4 {
  font-size: 2.5rem;
}
</style> 