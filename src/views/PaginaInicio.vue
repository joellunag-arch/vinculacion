<template>
  <div class="pagina-inicio d-flex flex-column min-vh-100">
    <Inicio />

    <section class="container py-5 text-center">
      <div class="row">
        <div class="col-md-6">
          <router-link to="/nacionales" class="btn btn-outline-primary btn-lg w-75 mb-3">
            Votos Nacionales
          </router-link>
        </div>
        <div class="col-md-6">
          <router-link to="/extranjeros" class="btn btn-outline-primary btn-lg w-75">
            Votos Extranjeros
          </router-link>
        </div>
      </div>
    </section>

    <FooterGeneral />
  </div>
</template>

<script setup>
import Inicio from '@/components/Inicio.vue'
import FooterGeneral from '@/components/FooterGeneral.vue'
</script>