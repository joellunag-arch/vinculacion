<template>
  <div class="container py-5">
    <h1 class="title-standard">Resultados Nacionales del año: {{ year }}</h1>
    <p class="text-standard">Cargando datos desde: src/assets/{{ year }}/datos/...</p>
    
  </div>
</template>

<script setup>
// Recibimos 'year' automáticamente gracias a 'props: true' en el router
defineProps(['year'])
</script>