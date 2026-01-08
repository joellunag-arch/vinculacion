<!-- src/components/BarraInformacionGeneral.vue -->
<template>
  <div class="barra-informacion py-3">
    <div class="container">
      <div class="row text-center">
        <div class="col-md-4 mb-3 mb-md-0 stat-item">
          <img src="@/assets/img/logos/P_Sevee.svg" alt="Icono" class="stat-icon mb-2">
          <div class="stat-number">{{ stats.votos_total?.toLocaleString() || '0' }}</div>
          <div class="stat-label">Sufragantes</div>
        </div>
        <div class="col-md-4 mb-3 mb-md-0 stat-item">
          <img src="@/assets/img/logos/P_Sevee.svg" alt="Icono" class="stat-icon mb-2">
          <div class="stat-number">{{ stats.votos_blancos?.toLocaleString() || '0' }}</div>
          <div class="stat-label">En Blanco</div>
        </div>
        <div class="col-md-4 stat-item">
          <img src="@/assets/img/logos/P_Sevee.svg" alt="Icono" class="stat-icon mb-2">
          <div class="stat-number">{{ stats.votos_nulos?.toLocaleString() || '0' }}</div>
          <div class="stat-label">Nulos</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Object, default: () => ({}) }
});
</script>

<style scoped>
/* Usamos los estilos generales del compañero */
.stat-icon {
  height: 40px;
  filter: brightness(0) invert(1);
}
</style>