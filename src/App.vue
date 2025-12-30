<template>
  <!-- Contenedor principal sin estilos de Vue, solo Bootstrap -->
  <div class="app-container">
    <NavBar />

    <main>
      <!-- Aquí es donde se cargará PaginaInicio.vue -->
      <router-view />
    </main>

    <FooterGeneral />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooterGeneral from './components/FooterGeneral.vue'
</script>

<style>
/* Reset global para quitar el fondo oscuro de Vue */
body {
  background-color: white !important;
  color: #212529 !important;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>