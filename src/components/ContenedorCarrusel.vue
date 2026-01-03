<template>
  <div class="carrusel-electoral-container">
    <div class="container-fluid p-0">
      <div
        id="carouselElectoral"
        ref="carouselRef"
        class="carousel slide bg-white-opacity shadow-lg overflow-hidden"
        data-bs-interval="false"
      >
        <div class="row pt-4 pb-2 justify-content-center text-center">
          <div class="col-12 mb-3">
            <div class="titulo-electoral">
              <h2 class="mb-0 fw-bold">{{ tituloActual }}</h2>
            </div>
          </div>

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

        <div class="carousel-inner">
          <div class="carousel-item active p-4">
            <div class="row min-vh-50">
              <div class="col-md-9 position-relative border-end border-light">
                <button class="btn-search-fab" @click="$emit('toggle-search')">
                  <i class="bi bi-search"></i>
                </button>
                <slot name="mapa"
                  ><div class="placeholder-content">Mapa del Ecuador</div></slot
                >
              </div>
              <div class="col-md-3">
                <slot name="filtros"
                  ><div class="placeholder-content small">
                    Filtros / Listado
                  </div></slot
                >
              </div>
            </div>
          </div>
          <div class="carousel-item p-4">
            <div
              class="min-vh-50 d-flex align-items-center justify-content-center"
            >
              <slot name="graficos"
                ><div class="placeholder-content">
                  Gráficos de resultados
                </div></slot
              >
            </div>
          </div>
          <div class="carousel-item p-4">
            <div class="min-vh-50 overflow-auto">
              <slot name="tablas"
                ><div class="placeholder-content">
                  Tablas de resultados
                </div></slot
              >
            </div>
          </div>
        </div>

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

<style scoped lang="scss">
.carrusel-electoral-container {
  background-image: url("@/assets/img/fondos/fondo2.png");
  background-size: cover;
  background-position: center;
  min-height: 85vh;
  padding: 2rem 0;
}

.bg-white-opacity {
  background-color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(6px);
  border-radius: 4px;
}

.titulo-electoral {
  display: inline-block;
  background-color: var(--color-primary);
  padding: 10px 36px;
  border-radius: 4px;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

  h2 {
    font-family: var(--font-titles);
    font-size: 1.6rem;
    margin: 0;
    letter-spacing: 0.5px;
  }
}

.btn-etapa {
  background-color: #fff;
  border: 1px solid #333;
  padding: 10px 28px;
  font-family: var(--font-titles);
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;

  & + .btn-etapa {
    border-left: none;
  }

  &:hover {
    background-color: var(--bg-soft);
  }

  &.activo {
    background-color: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
    z-index: 1;
  }
}

.min-vh-50 {
  min-height: 520px;
}

.btn-search-fab {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  color: #fff;
  border: none;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
  }
}

.carousel-indicators-custom {
  padding: 14px 28px;
  background-color: var(--bg-light);
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-nav {
  background: none;
  border: none;
  font-size: 1.7rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary);
  }
}

.dot-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d6d6d6;
  border: 1px solid #aaa;
  margin: 0 6px;
  padding: 0;
  transition: all 0.2s ease;

  &.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.placeholder-content {
  background-color: #fafafa;
  border: 2px dashed #ccc;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 600;
  text-align: center;
  padding: 12px;
  border-radius: 4px;
}

</style>

