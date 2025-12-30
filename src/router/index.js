import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '@/views/PaginaInicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PaginaInicio
    },
    {
      path: '/nacionales',
      name: 'nacionales',
      component: () => import('@/views/VotantesNacionales.vue')
    },
    {
      path: '/extranjeros',
      name: 'extranjeros',
      component: () => import('@/views/VotantesExtranjeros.vue')
    },
    {
      path: '/acerca-de',
      name: 'acerca',
      component: () => import('@/views/AcercaDe.vue')
    }
  ]
})

export default router