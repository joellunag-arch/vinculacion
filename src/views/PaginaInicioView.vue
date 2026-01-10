<template>
  <div class="inicio-view">
    <!-- 1. Hero (Los dos logos que hicimos antes) -->
    <HeroInicio />

    <!-- 2. Banner Celeste con Texto Blanco -->
    <BannerIntro />

    <!-- 3. Sección de Tutorial y Edificios -->
    <TutorialSevee />

    
  </div>
</template>

<script setup>

import { defineAsyncComponent } from 'vue'

import HeroInicio from '@/components/HeroInicio.vue'
import BannerIntro from '@/components/BannerIntro.vue'


const TutorialSevee = defineAsyncComponent(() => import('@/components/TutorialSevee.vue'))
</script>

<style scoped>
.inicio-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>