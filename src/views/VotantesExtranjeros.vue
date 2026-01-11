<template>
  <div class="vista-extranjeros">
    <!-- DRAWER DE FILTROS (Simplificado para Extranjeros o pendiente de lógica específica) -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      absolute
      height="100%"
      location="left"
      width="300"
      color="#12a2c2"
    >
      <v-container class="contenedor-filtros text-white">
        <h3 class="mb-4 text-uppercase fw-bold" style="font-family: 'Oswald', sans-serif; color: white;">
          FILTROS
        </h3>

        <!-- VUELTA -->
        <div class="texto-filtro">VUELTA ELECTORAL</div>
        <v-select
          v-model="filtroVuelta"
          :items="etapasDisponibles"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-4"
        ></v-select>

        <v-btn
          block
          color="white"
          class="font-weight-bold"
          style="color: #12a2c2; font-family: 'Oswald', sans-serif"
          @click="drawer = false"
        >
          CERRAR
        </v-btn>
      </v-container>
    </v-navigation-drawer>

    <ContenedorCarrusel
      titulo="Voto en el Exterior"
      :periodo="year"
      :etapasDisponibles="etapasDisponibles"
      :etapaActual="filtroVuelta"
      @update-etapa="manejarCambioVuelta"
      @toggle-search="drawer = !drawer"
    >
      <!-- ================= MAPA ================= -->
      <template #mapa>
        <div v-if="loading" class="estado">Procesando datos...</div>
        
        <div v-else style="position: relative; width: 100%; height: 100%;">

          <MapaMundi
            :resultados="datosElectorales.cantones"
            :colores="coloresPartidos"
          />
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
        <div class="p-5 text-center">
             <h3 class="text-muted">Gráficos de Resultados en el Exterior</h3>
             <p>Disponible próximamente</p>
        </div>
      </template>

      <!-- ================= TABLAS ================= -->
      <template #tablas>
        <TablaGenerica
          v-if="datosTabla.rows.length"
          :datos="datosTabla.rows"
          :titulo="datosTabla.titulo"
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
import MapaMundi from "@/components/mapa/MapaMundi.vue";
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
const { loading, datosElectorales, mapas, candidatosInfo, cargarTodo, obtenerEtapasDelAno } =
  useElectoralData();

/* CANDIDATOS */
const candidatos = computed(() => {
  return candidatosInfo.value || [];
});

/* ETAPAS */
const etapasDisponibles = computed(() =>
  obtenerEtapasDelAno("EXTRANJEROS", props.year)
);

/* ESTADO */
const drawer = ref(false);
const filtroVuelta = ref(1);
const partidoSeleccionado = ref("Resultados Generales");

/* COMPUTED */
const tituloMapa = computed(() => `Resultados en el Exterior ${props.year}`);

const coloresPartidos = computed(() => {
  const map = {};
  if (candidatosInfo.value && Array.isArray(candidatosInfo.value)) {
    candidatosInfo.value.forEach((c) => {
      if (c.nombrePartido && c.color) {
        map[c.nombrePartido] = { principal: c.color };
        // Alias
        if (c.nombrePartido === 'RC/RETO') {
           map['RC5'] = { principal: c.color };
        }
      }
    });
  }
  return map;
});

const leyendaColores = [
  { porcentaje: "Ganador", ADN: "#d9d9d9", RC5: "#d9d9d9" } // Placeholder
];

/* DATOS TABLA */
const datosTabla = computed(() => {
    const datos = datosElectorales.value.cantones || [];
    const partidoFilter = partidoSeleccionado.value;
    const isGeneral = partidoFilter === "Resultados Generales";

    const rows = datos.map(d => {
        let nombre = d.CANTON || d.PAIS || "Desconocido";
        let candidato = "";
        let partido = "";
        let porcentaje = 0;

        if (isGeneral) {
            partido = d.ganador;
            if (d.resultados && d.resultados[partido]) {
                candidato = d.resultados[partido].candidato;
                porcentaje = d.resultados[partido].porcentaje;
            }
        } else {
             partido = partidoFilter;
             let key = partido;
             // Alias handling
             if (key === 'RC/RETO' && d.resultados && !d.resultados['RC/RETO'] && d.resultados['RC5']) {
                 key = 'RC5';
             }

             if (d.resultados && d.resultados[key]) {
                 candidato = d.resultados[key].candidato;
                 porcentaje = d.resultados[key].porcentaje;
             }
        }

        return {
            nombre,
            partido,
            candidato,
            porcentaje
        };
    });

    return { 
        rows, 
        titulo: "Resultados por País/Consulado" 
    };
});

/* EVENTOS */
const manejarCambioVuelta = (vuelta) => {
  filtroVuelta.value = vuelta;
};

const manejarCambioPartido = (partido) => {
  partidoSeleccionado.value = partido;
};

/* WATCHERS & LIFECYCLE */
watch(filtroVuelta, (nuevaVuelta) => {
  if (nuevaVuelta) {
     cargarTodo(props.year, nuevaVuelta);
  }
});

watch(() => props.year, (nuevoYear) => {
    cargarTodo(nuevoYear, 1);
});

onMounted(() => {
    cargarTodo(props.year, 1);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

.vista-extranjeros {
  padding: 2rem;
  position: relative;
}

.texto-filtro {
  margin-bottom: 5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.estado {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}
</style>
