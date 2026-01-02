import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicioView from '@/views/PaginaInicioView.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: PaginaInicioView
  },
  {
    path: '/nacionales/:year',
    name: 'nacionales-year',
    component: () => import('@/views/VotantesNacionales.vue'),
    props: true 
  },
  {
    path: '/extranjeros/:year',
    name: 'extranjeros-year',
    component: () => import('@/views/VotantesExtranjeros.vue'),
    props: true
  },
  {
    path: '/acerca-de',
    name: 'acerca',
    component: () => import('@/views/AcercaDe.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router