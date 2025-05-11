import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Create and mount the Vue app
const app = createApp(App)

// Use router
app.use(router)

// Mount the app
app.mount('#app')