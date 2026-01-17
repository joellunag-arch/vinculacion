<template>
  <div class="carrusel-electoral-container">
    <div class="container-fluid p-0">
      <div
        id="carouselElectoral"
        ref="carouselRef"
        class="carousel slide bg-white-opacity shadow-lg"
        data-bs-interval="false"
      >
        <!-- =========================
             HEADER
        ========================== -->
        <div class="row align-items-center mx-0 header-electoral">
          <!-- LUPA -->
          <div v-if="slideActivo === 0" class="col-auto search-container">
            <button class="btn-search-fab" @click="$emit('toggle-search')">
              <i class="bi bi-search"></i>
            </button>
          </div>


          <!-- TÍTULO -->
          <div class="col-auto mx-auto text-center" v-if="slideActivo === 0">
            <div class="titulo-electoral">
              <h2 class="mb-0 fw-bold">{{ tituloActual }}</h2>
            </div>
          </div>

          <!-- LIMPIAR FILTROS -->
          <div v-if="slideActivo === 0" class="col-auto clean-container">
            <button class="btn-search-fab" @click="$emit('clean-filters')" title="Limpiar Filtros">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>


        <!-- ==========================
             BOTONES DE ETAPA
        ========================== -->
        <div
          v-if="slideActivo === 0"
          class="row justify-content-center pb-3 mx-0 etapa-container"
        >
          <div class="col-12 d-flex justify-content-center px-0">
            <button
              @click="etapaHabilitada(1) && cambiarEtapa(1)"
              :class="[
                'btn-etapa',
                { activo: etapa === 1, disabled: !etapaHabilitada(1) },
              ]"
            >
              PRIMERA VUELTA
            </button>

            <button
              @click="etapaHabilitada(2) && cambiarEtapa(2)"
              :class="[
                'btn-etapa',
                { activo: etapa === 2, disabled: !etapaHabilitada(2) },
              ]"
            >
              SEGUNDA VUELTA
            </button>

            <button
              @click="etapaHabilitada(3) && cambiarEtapa(3)"
              :class="[
                'btn-etapa',
                { activo: etapa === 3, disabled: !etapaHabilitada(3) },
              ]"
            >
              ASAMBLEÍSTAS
            </button>
          </div>
        </div>

        <!-- =========================
             SLIDES
        ========================== -->
        <div class="carousel-inner">
          <div class="carousel-item active p-4">
            <div class="row min-vh-50">
              <div :class="hasFiltros ? 'col-md-9 position-relative border-end border-light' : 'col-md-12 position-relative'">
                <slot name="mapa">
                  <div class="placeholder-content">Mapa del Ecuador</div>
                </slot>
              </div>
              <div v-if="hasFiltros" class="col-md-3">
                <slot name="filtros">
                  <div class="placeholder-content small">Filtros / Listado</div>
                </slot>
              </div>
            </div>
          </div>

          <div class="carousel-item p-4">
            <div
              class="min-vh-50 d-flex align-items-center justify-content-center"
            >
              <slot name="graficos">
                <div class="placeholder-content">Gráficos de resultados</div>
              </slot>
            </div>
          </div>

          <div class="carousel-item p-4">
            <div class="min-vh-50 overflow-auto">
              <slot name="tablas">
                <div class="placeholder-content">Tablas de resultados</div>
              </slot>
            </div>
          </div>
        </div>

        <!-- =========================
             INDICADORES
        ========================== -->
        <!-- =========================
             INDICADORES
        ========================== -->
        <div class="carousel-indicators-custom">
          <button
            class="btn-nav"
            data-bs-target="#carouselElectoral"
            data-bs-slide="prev"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <div class="dots">
            <button
              v-for="idx in 3"
              :key="idx"
              data-bs-target="#carouselElectoral"
              :data-bs-slide-to="idx - 1"
              :class="['dot-btn', { active: slideActivo === idx - 1 }]"
            />
          </div>

          <button
            class="btn-nav"
            data-bs-target="#carouselElectoral"
            data-bs-slide="next"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, useSlots, watch } from "vue";

const props = defineProps({
  ambito: { type: String, default: "NACIONALES" },
  periodo: { type: String, default: "1992" },
  etapaActual: { type: Number, default: 1 },

  //CONTROL DINÁMICO DE ETAPAS
  etapasDisponibles: {
    type: Array,
    default: () => [1], // por defecto solo primera vuelta
  },
});

const emit = defineEmits(["update-etapa", "toggle-search", "clean-filters"]);
const slots = useSlots();

const etapa = ref(props.etapaActual);
const slideActivo = ref(0);
const carouselRef = ref(null);

const hasFiltros = computed(() => !!slots.filtros);

const tituloActual = computed(() => {
  if (slideActivo.value === 1) return "GRÁFICOS DE RESULTADOS";
  if (slideActivo.value === 2) return "TABLAS DE RESULTADOS";
  return `RESULTADOS ${props.ambito} ${props.periodo}`;
});

const etapaHabilitada = (num) => {
  return props.etapasDisponibles.includes(num);
};

const cambiarEtapa = (num) => {
  etapa.value = num;
  emit("update-etapa", num);
};

// Sincronizar con cambios externos
watch(() => props.etapaActual, (newVal) => {
  etapa.value = newVal;
});

const detectarCambioSlide = (event) => {
  slideActivo.value = event.to;
};

onMounted(() => {
  carouselRef.value?.addEventListener("slide.bs.carousel", detectarCambioSlide);
});

onUnmounted(() => {
  carouselRef.value?.removeEventListener(
    "slide.bs.carousel",
    detectarCambioSlide
  );
});
</script>

<style scoped lang="scss">
.carrusel-electoral-container {
  background-image: url("@/assets/img/fondos/fondo2.png");
  background-size: cover;
  background-position: center;
  min-height: 85vh;
  padding-bottom: 140px;
}

.bg-white-opacity {
  background: transparent !important;
}

/* =========================
   HEADER
========================= */
.header-electoral {
  padding-top: 28px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
}

/* =========================
   TÍTULO
========================= */
.titulo-electoral {
  background-color: var(--color-secondary);
  padding: 8px 32px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  display: inline-block;
}

@media (max-width: 768px) {
  .titulo-electoral {
    padding: 6px 20px;
    h2 {
      font-size: 1.2rem;
    }
  }
}

h2 {
  font-family: var(--font-titles);
  font-size: 1.6rem;
  margin: 0;
}

/* =========================
   SEPARACIÓN TÍTULO / BOTONES
========================= */
.etapa-container {
  padding-top: 14px;
}

/* =========================
   BOTONES ETAPA
========================= */
.btn-etapa {
  background: #ffffff;
  border: 1px solid #333;
  padding: 8px 26px;
  font-family: var(--font-titles);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  & + .btn-etapa {
    border-left: none;
  }

  &.activo {
    background-color: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
    z-index: 1;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
    background: #f5f5f5;
    color: #666;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
}

/* =========================
   LUPA
========================= */
.search-container {
  margin-left: 24px;
}

.clean-container {
  margin-right: 24px;
}

.btn-search-fab {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  i {
    color: white !important;
    font-size: 1.15rem !important;
  }
}

/* =========================
   INDICADORES
========================= */
.carousel-indicators-custom {
  position: relative;
  padding: 30px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dots {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.btn-nav {
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;

  i {
    color: #888 !important;
    font-size: 1.8rem !important;
  }

  &:hover i {
    color: var(--color-secondary) !important;
  }
}

.dot-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  border: none;
  margin: 0 4px;

  &.active {
    background-color: #6c757d;
  }
}

/* =========================
   GENERAL
========================= */
.min-vh-50 {
  min-height: 520px;
}

.placeholder-content {
  border: 2px dashed #bdbdbd;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7a7a7a;
  font-weight: 600;
  text-align: center;
}

.carousel,
.carousel-inner {
  overflow: hidden !important;
}

/* =========================
   MOBILE
========================= */
@media (max-width: 768px) {
  .header-electoral {
    flex-direction: column;
    gap: 10px;
  }

  .search-container {
    order: 3;
    margin-left: 0;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>