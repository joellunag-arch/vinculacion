<template>
  <div class="carrusel-electoral-container">
    <div class="container-fluid py-4 px-0">
      <!-- TÍTULO -->
      <div class="row mb-4 justify-content-center text-center">
        <div class="col-12 mb-3">
          <div class="titulo-electoral">
            <h2 class="mb-0 fw-bold oswald-font">
              {{ tituloActual }}
            </h2>
          </div>
        </div>

        <!-- BOTONES DE ETAPA -->
        <div
          v-if="slideActivo === 0"
          class="col-12 d-flex justify-content-center"
        >
          <button
            @click="cambiarEtapa(1)"
            :class="['btn-etapa', { activo: etapa === 1 }]"
          >
            PRIMERA VUELTA
          </button>
          <button
            @click="cambiarEtapa(2)"
            :class="['btn-etapa', { activo: etapa === 2 }]"
          >
            SEGUNDA VUELTA
          </button>
          <button
            @click="cambiarEtapa(3)"
            :class="['btn-etapa', { activo: etapa === 3 }]"
          >
            ASAMBLEÍSTAS
          </button>
        </div>
      </div>

      <!-- CARRUSEL -->
      <div
        id="carouselElectoral"
        ref="carouselRef"
        class="carousel slide bg-white-opacity shadow-lg overflow-hidden"
        data-bs-interval="false"
      >
        <div class="carousel-inner">
          <!-- SLIDE MAPA -->
          <div class="carousel-item active p-4">
            <div class="row min-vh-50">
              <div class="col-md-9 position-relative border-end">
                <button class="btn-search-fab" @click="$emit('toggle-search')">
                  <i class="bi bi-search"></i>
                </button>

                <slot name="mapa">
                  <div class="placeholder-content">Mapa del Ecuador</div>
                </slot>
              </div>

              <div class="col-md-3">
                <slot name="filtros">
                  <div class="placeholder-content small">Filtros / Listado</div>
                </slot>
              </div>
            </div>
          </div>

          <!-- SLIDE GRÁFICOS -->
          <div class="carousel-item p-4">
            <div
              class="min-vh-50 d-flex align-items-center justify-content-center"
            >
              <slot name="graficos">
                <div class="placeholder-content">Gráficos de resultados</div>
              </slot>
            </div>
          </div>

          <!-- SLIDE TABLAS -->
          <div class="carousel-item p-4">
            <div class="min-vh-50 overflow-auto">
              <slot name="tablas">
                <div class="placeholder-content">Tablas de resultados</div>
              </slot>
            </div>
          </div>
        </div>

        <!-- CONTROLES -->
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
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  ambito: { type: String, default: "NACIONALES" },
  periodo: { type: String, default: "1992" },
});

const emit = defineEmits(["update-etapa", "toggle-search"]);

const etapa = ref(1);
const slideActivo = ref(0);
const carouselRef = ref(null);

const tituloActual = computed(() => {
  if (slideActivo.value === 1) return "GRÁFICOS DE RESULTADOS";
  if (slideActivo.value === 2) return "TABLAS DE RESULTADOS";
  return `RESULTADOS ${props.ambito} ${props.periodo}`;
});

const cambiarEtapa = (num) => {
  etapa.value = num;
  emit("update-etapa", num);
};

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

<style scoped>
.carrusel-electoral-container {
  background-image: url("@/assets/img/fondos/fondo2.png");
  background-size: cover;
  background-position: center;
  min-height: 80vh;
}

.titulo-electoral {
  display: inline-block;
  background-color: var(--azul-seveo);
  padding: 12px 48px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.carousel-indicators-custom {
  padding: 12px 20px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-nav {
  background: none;
  border: none;
  font-size: 26px;
  color: #444;
}

.dots {
  display: flex;
  gap: 10px;
}

.dot-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d6d6d6;
  border: 1px solid #9e9e9e;
  padding: 0;
}

.dot-btn.active {
  background-color: #6c6c6c;
  border-color: #6c6c6c;
}
</style>
