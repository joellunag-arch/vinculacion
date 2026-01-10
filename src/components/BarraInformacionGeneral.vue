<template>
  <div class="barra-informacion py-3">
    <div class="container">
      <div class="row align-items-center text-white">
        <div class="col-md-3 Oswald fs-4 text-center text-md-start">
          INFORMACIÓN GENERAL
        </div>
        <div class="col-md-9">
          <div class="row text-center">
            <div class="col-4 stat-item border-start border-light border-opacity-25">
              <img src="@/assets/img/logos/P_Sevee.svg" class="stat-icon mb-1">
              <div class="stat-number fw-bold Oswald">{{ stats.votos_total?.toLocaleString() || 0 }}</div>
              <div class="stat-label small opacity-75 OpenSans">SUFRAGANTES</div>
            </div>
            <div class="col-4 stat-item border-start border-light border-opacity-25">
              <img src="@/assets/img/logos/P_Sevee.svg" class="stat-icon mb-1">
              <div class="stat-number fw-bold Oswald">{{ stats.votos_blancos?.toLocaleString() || 0 }}</div>
              <div class="stat-label small opacity-75 OpenSans">EN BLANCO</div>
            </div>
            <div class="col-4 stat-item border-start border-light border-opacity-25">
              <img src="@/assets/img/logos/P_Sevee.svg" class="stat-icon mb-1">
              <div class="stat-number fw-bold Oswald">{{ stats.votos_nulos?.toLocaleString() || 0 }}</div>
              <div class="stat-label small opacity-75 OpenSans">NULOS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Object, default: () => ({ votos_total: 0, votos_blancos: 0, votos_nulos: 0 }) }
});
</script>

<style scoped>
.barra-informacion {
  background-color: var(--color-secondary); /* Turquesa #12a2c2 */
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
}
.stat-icon { height: 30px; filter: brightness(0) invert(1); }
.stat-number { font-size: 1.5rem; line-height: 1; }
.stat-label { font-size: 0.7rem; letter-spacing: 1px; }
</style>