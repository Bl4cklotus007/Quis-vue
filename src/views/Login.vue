<template>
  <div class="login-page min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-lg">
            <div class="card-header bg-primary text-white text-center py-4">
              <h3 class="mb-0 fw-bold">
                <i class="bi bi-mortarboard-fill me-2"></i>
                SMP Quiz App
              </h3>
            </div>
            <div class="card-body p-4">
              <h4 class="text-center mb-4">Login</h4>
              
              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
                <button type="button" class="btn-close" @click="error = ''"></button>
              </div>

              <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="username"
                    required
                    placeholder="Username"
                    :disabled="loading"
                  />
                  <label for="username">Username</label>
                </div>
                
                <div class="form-floating mb-3">
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                    placeholder="Password"
                    :disabled="loading"
                  />
                  <label for="password">Password</label>
                </div>
                
                <div class="form-floating mb-4">
                  <select 
                    class="form-select" 
                    id="role" 
                    v-model="role" 
                    required 
                    :disabled="loading"
                  >
                    <option value="student">Siswa</option>
                    <option value="admin">Admin</option>
                  </select>
                  <label for="role">Login Sebagai</label>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 py-2" 
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ loading ? 'Loading...' : 'Login' }}
                </button>
              </form>
            </div>
            <div class="card-footer text-center py-3 bg-light">
              <div class="small text-muted">
                &copy; 2024 SMP Quiz App. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
    
    // For demo purposes, using hardcoded credentials
    // In production, this should be replaced with actual API calls
    const validCredentials = {
      student: {
        username: 'siswa',
        password: 'siswa123'
      },
      admin: {
        username: 'admin',
        password: 'admin123'
      }
    }

    const selectedRole = role.value
    const validCredential = validCredentials[selectedRole]

    if (username.value === validCredential.username && password.value === validCredential.password) {
      // Store user data in localStorage
      const userData = {
        username: username.value,
        role: selectedRole
      }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', 'demo-token-' + Date.now()) // In production, use actual JWT token
      
      // Redirect based on role
      if (selectedRole === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      error.value = 'Username atau password salah'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat login'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-color: #0d6efd;
}

.btn-primary {
  background: linear-gradient(45deg, #0d6efd, #0a58ca);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(45deg, #0a58ca, #084298);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.alert {
  border: none;
  border-radius: 8px;
}

.card-header {
  border-radius: 8px 8px 0 0 !important;
}

.card-footer {
  border-radius: 0 0 8px 8px !important;
}
</style> 