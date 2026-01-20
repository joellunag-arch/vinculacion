<template>
  <section class="barra-informacion shadow-lg">
    <div class="container-fluid px-md-5">
      <div class="row align-items-center py-2 py-md-3 text-white">
        <!-- TÍTULO IZQUIERDA -->
        <div class="col-12 col-md-3 mb-3 mb-md-0 text-center text-md-start">
          <h2 class="titulo-barra Oswald m-0">Información General</h2>
        </div>

        <!-- BLOQUE DE ESTADÍSTICAS -->
        <div class="col-12 col-md-9">
          <div class="row g-0">
            <!-- SUFRAGANTES -->
            <div class="col-4 stat-item d-flex flex-column align-items-center">
              <img
                src="@/assets/img/logos/P_Sevee.svg"
                alt="Icono"
                class="stat-icon mb-1"
              />
              <span class="stat-number Oswald fw-bold">
                {{ stats.votos_total?.toLocaleString() || 0 }}
              </span>
              <span class="stat-label OpenSans">Sufragantes</span>
            </div>

            <!-- EN BLANCO -->
            <div class="col-4 stat-item d-flex flex-column align-items-center">
              <img
                src="@/assets/img/logos/P_Sevee.svg"
                alt="Icono"
                class="stat-icon mb-1"
              />
              <span class="stat-number Oswald fw-bold">
                {{ stats.votos_blancos?.toLocaleString() || 0 }}
              </span>
              <span class="stat-label OpenSans">En Blanco</span>
            </div>

            <!-- NULOS -->
            <div
              class="col-4 stat-item d-flex flex-column align-items-center border-end-0"
            >
              <img
                src="@/assets/img/logos/P_Sevee.svg"
                alt="Icono"
                class="stat-icon mb-1"
              />
              <span class="stat-number Oswald fw-bold">
                {{ stats.votos_nulos?.toLocaleString() || 0 }}
              </span>
              <span class="stat-label OpenSans">Nulos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    default: () => ({
      votos_total: 0,
      votos_blancos: 0,
      votos_nulos: 0,
    }),
  },
});
</script>

<style scoped>
.barra-informacion {
  background-color: var(--color-secondary);
  width: 100%;
  position: relative;
  z-index: 10;
}

.titulo-barra {
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.stat-icon {
  height: 35px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.stat-item {
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0 10px;
}

.stat-number {
  font-size: 1.6rem;
  line-height: 1.1;
  letter-spacing: 0.5px;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 400;
  opacity: 0.9;
  text-transform: capitalize;
}

/* RESPONSIVIDAD MÓVIL */
@media (max-width: 768px) {
  .titulo-barra {
    font-size: 1.2rem;
  }

  .stat-number {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .stat-icon {
    height: 25px;
  }

  .stat-item {
    padding: 5px;
  }
}

.Oswald {
  font-family: var(--font-titles);
}
.OpenSans {
  font-family: var(--font-body);
}
</style>
