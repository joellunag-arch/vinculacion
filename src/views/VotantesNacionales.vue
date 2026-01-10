<template>
  <div class="vista-nacional">
    <ContenedorCarrusel
      titulo="Resultados Nacionales"
      :periodo="year"
      :etapasDisponibles="etapasDisponibles"
      @update-etapa="manejarCambioVuelta"
    >
      <!-- ================= MAPA + FILTRO ================= -->
      <template #mapa>
        <div class="row g-3 align-items-start">
          <!-- MAPA -->
          <div class="col-12 col-lg-9">
            <div v-if="loading" class="estado">Procesando mapa...</div>

            <MapaNacional
              v-else-if="mapas.provincias"
              :geoProvincias="mapas.provincias"
              :geoCantones="mapas.cantones"
              :geoParroquias="mapas.parroquias"
              :resultadosProvincias="datosElectorales.provincias"
              :resultadosCantones="datosElectorales.cantones"
              :resultadosParroquias="datosElectorales.parroquias"
              :colores="coloresPartidos"
              :partidoActivo="partidoSeleccionado"
              @cambio-partido="manejarCambioPartido"
            />
          </div>
        </div>
      </template>

      <!-- ================= TARJETAS CANDIDATOS ================= -->
      <template #filtros>
        <TarjetaCandidato
          :itemsCandidato="candidatos"
          :itemsLeyenda="leyendaColores"
          :etiquetaTarjeta2="partidoSeleccionado"
          @cambio-partido="manejarCambioPartido"
        />
      </template>

      <!-- ================= GRÁFICOS ================= -->
      <template #graficos>
        <GraficoBarras
          v-if="datosElectorales.provincias.length"
          :datos="datosElectorales.provincias"
          :partido="partidoSeleccionado"
          categoria="presidentes"
        />
        <p v-else class="estado">No hay datos para gráficos</p>
      </template>

      <!-- ================= TABLAS ================= -->
      <template #tablas>
        <TablaGenerica
          v-if="datosElectorales.provincias.length"
          :datos="mapearDatosATabla(datosElectorales.provincias)"
          :titulo="`RESULTADOS NACIONALES ${year}`"
        />
        <p v-else class="estado">No hay datos para tabla</p>
      </template>
    </ContenedorCarrusel>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";

/* COMPONENTES */
import ContenedorCarrusel from "@/components/ContenedorCarrusel.vue";
import MapaNacional from "@/components/mapa/MapaNacional.vue";
import GraficoBarras from "@/components/mapa/GraficoBarras.vue";
import TablaGenerica from "@/components/mapa/TablaGenerica.vue";
import TarjetaCandidato from "@/components/mapa/TarjetaCandidato.vue";

/* COMPOSABLE */
import { useElectoralData } from "@/composables/useElectoralData";

/* PROPS */
const props = defineProps({
  year: {
    type: [String, Number],
    required: true,
  },
});

/* DATA ELECTORAL */
const { loading, datosElectorales, mapas, cargarTodo, obtenerEtapasDelAno } =
  useElectoralData();

/* ETAPAS */
const etapasDisponibles = computed(() =>
  obtenerEtapasDelAno("NACIONALES", props.year)
);

/* PARTIDO SELECCIONADO */
const partidoSeleccionado = ref("Resultados Generales");

const manejarCambioPartido = (partido) => {
  partidoSeleccionado.value = partido;
};

/* LEYENDA DE COLORES */
const leyendaColores = [
  { porcentaje: "0–10%", ADN: "#cfe2ff", RC5: "#ffe5cc" },
  { porcentaje: "10–30%", ADN: "#9ec5fe", RC5: "#ffcc99" },
  { porcentaje: "30–50%", ADN: "#6ea8fe", RC5: "#ffb366" },
  { porcentaje: "50%+", ADN: "#246cb6", RC5: "#f78c0e" },
];

/* COLORES DE PARTIDOS */
const coloresPartidos = {
  ADN: { principal: "#246cb6" },
  RC5: { principal: "#f78c0e" },
};

/* MAPEO TABLA */
const mapearDatosATabla = (datos) =>
  datos.map((item) => ({
    nombre: item.PROVINCIA,
    candidato: item.resultados?.[item.ganador]?.candidato ?? "N/A",
    partido: item.ganador,
    porcentaje: item.resultados?.[item.ganador]?.porcentaje ?? 0,
  }));

/* EVENTOS */
const manejarCambioVuelta = (vuelta) => {
  cargarTodo(props.year, vuelta);
};

/* LIFECYCLE */
onMounted(() => cargarTodo(props.year, 1));

watch(
  () => props.year,
  (nuevoYear) => cargarTodo(nuevoYear, 1)
);
</script>

<style scoped>
.vista-nacional {
  padding: 2rem;
}

.estado {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}
</style>