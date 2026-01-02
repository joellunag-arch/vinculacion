import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Solo Bootstrap y estilo iniciales (generales añadir luego los de Kevin)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/EstilosGenerales.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')