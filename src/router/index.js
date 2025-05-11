import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Materi from '../views/Materi.vue'
import Kuis from '../views/Kuis.vue'
import Skor from '../views/Skor.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/materi',
      name: 'materi',
      component: Materi,
      meta: { requiresAuth: true }
    },
    {
      path: '/kuis',
      name: 'kuis',
      component: Kuis,
      meta: { requiresAuth: true }
    },
    {
      path: '/skor',
      name: 'skor',
      component: Skor,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  
  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  }
  // If user is authenticated and trying to access login page
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
  }
  // Otherwise proceed
  else {
    next()
  }
})

export default router 