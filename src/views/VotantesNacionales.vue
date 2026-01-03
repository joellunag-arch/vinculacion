<template>
  <div class="vista-nacional">
    <ContenedorCarrusel
      ambito="NACIONALES"
      :periodo="year"
      @update-etapa="manejarCambioVuelta"
      @toggle-search="abrirFiltros"
    >
      <template #mapa>
        <div class="p-5 text-center">
          <h2 class="text-muted">Mapa Electoral - {{ year }}</h2>
          <p class="badge bg-primary fs-6">Vuelta {{ vueltaActiva }}</p>
        </div>
      </template>

      <template #graficos>
        <div class="p-5 text-center">
          <h2 class="text-muted">Gráficos Estadísticos {{ year }}</h2>
        </div>
      </template>

      <template #tablas>
        <div class="p-5 text-center">
          <h2 class="text-muted">Tablas de Datos {{ year }}</h2>
        </div>
      </template>
    </ContenedorCarrusel>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ContenedorCarrusel from "@/components/ContenedorCarrusel.vue";

const props = defineProps(["year"]);

const vueltaActiva = ref(1);

const manejarCambioVuelta = (num) => {
  vueltaActiva.value = num;
  console.log(`Cargando datos del año ${props.year} para la etapa ${num}`);
};

const abrirFiltros = () => {
  console.log("Abriendo panel de filtros para el año:", props.year);
};
</script>
