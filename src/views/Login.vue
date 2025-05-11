<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login</h2>
            
            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="username"
                  required
                  placeholder="Masukkan username"
                  :disabled="loading"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                  required
                  placeholder="Masukkan password"
                  :disabled="loading"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Login Sebagai</label>
                <select class="form-select" v-model="role" required :disabled="loading">
                  <option value="student">Siswa</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ loading ? 'Loading...' : 'Login' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const role = ref('student')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await authAPI.login({
      username: username.value,
      password: password.value,
      role: role.value
    })

    // Simpan token dan data user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.form-control:focus,
.form-select:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.btn-primary {
  padding: 0.6rem;
}
</style> 