<template>
  <div class="vista-extranjeros">
    <ContenedorCarrusel
      ambito="EXTRANJEROS"
      :periodo="year"
      :etapasDisponibles="etapasDisponibles"
      @update-etapa="manejarCambioVuelta"
      @toggle-search="abrirFiltros"
    >
      <template #mapa>
        <div class="p-5 text-center">
          <h2 class="text-muted">Voto en el Exterior - {{ year }}</h2>
          <p>Visualización para la comunidad migrante.</p>
        </div>
      </template>

      <template #graficos>
        <div class="p-5 text-center">
          <h2 class="text-muted">Gráficos Extranjeros {{ year }}</h2>
        </div>
      </template>

      <template #tablas>
        <div class="p-5 text-center">
          <h2 class="text-muted">Tablas Mundiales {{ year }}</h2>
        </div>
      </template>
    </ContenedorCarrusel>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ContenedorCarrusel from "@/components/ContenedorCarrusel.vue";
import { useElectoralData } from "@/composable/useElectoralData";

const props = defineProps(["year"]);
const { obtenerEtapasDelAno } = useElectoralData();

const vueltaActiva = ref(1);

// Obtiene automáticamente las etapas disponibles del config
const etapasDisponibles = computed(() =>
  obtenerEtapasDelAno("EXTRANJEROS", props.year)
);

const manejarCambioVuelta = (num) => {
  vueltaActiva.value = num;
};

const abrirFiltros = () => {
  console.log("Filtros para extranjeros del año:", props.year);
};
</script>
