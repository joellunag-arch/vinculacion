import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// --- CONFIGURACIÓN DE VUETIFY 3 ---
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Importar los iconos

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

// --- TUS ESTILOS ---
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/EstilosGenerales.css'

const app = createApp(App)

app.use(router)
app.use(vuetify) // Registrar Vuetify en la App
app.mount('#app')