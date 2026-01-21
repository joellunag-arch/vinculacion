<template>
  <div class="vista-extranjeros">
    <!-- DRAWER DE FILTROS -->
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
        <h3
          class="mb-4 text-uppercase fw-bold"
          style="font-family: 'Oswald', sans-serif; color: white"
        >
          SELECCIONAR EN FILTRO
        </h3>

        <!-- VUELTA -->
        <v-select
          v-model="filtroVuelta"
          :items="etapasDisponibles"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-1"
        ></v-select>
        <div class="mb-4 text-caption white--text">
          Seleccionado: {{ filtroVuelta }}
        </div>

        <!-- PARTIDO -->
        <div class="texto-filtro">PARTIDO POLITICO*</div>
        <v-select
          v-model="partidoSeleccionado"
          :items="listaPartidos"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-1"
        ></v-select>
        <div class="mb-4 text-caption white--text">
          Seleccionado: {{ partidoSeleccionado }}
        </div>

        <!-- ZONA (Equivalente a Provincia) -->
        <!-- Nota: Si no hay datos de Zonas explícitos, usaremos esto para filtrar por Continente si estuviera disponible, o se adaptará -->
        <div class="texto-filtro">ZONA / REGIÓN</div>
        <v-select
          v-model="filtroZona"
          :items="listaZonas"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-1"
          clearable
          placeholder="Todas las Zonas"
        ></v-select>
        <div class="mb-4 text-caption white--text">
          Seleccionado: {{ filtroZona || "Todas" }}
        </div>

        <!-- PAIS (Equivalente a Cantón) -->
        <div class="texto-filtro">PAÍS</div>
        <v-select
          v-model="filtroPais"
          :items="listaPaises"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-1"
          :disabled="!listaPaises.length && !filtroZona"
          clearable
          placeholder="Todos los Países"
        ></v-select>
        <div class="mb-4 text-caption white--text">
          Seleccionado: {{ filtroPais || "Todos" }}
        </div>

        <p class="text-caption white--text mb-4">*Campo Obligatorio</p>

        <v-btn
          block
          color="white"
          class="font-weight-bold"
          style="color: #12a2c2; font-family: 'Oswald', sans-serif"
          @click="buscar"
        >
          BUSCAR
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
      @clean-filters="limpiarFiltros"
    >
      <!-- ================= MAPA ================= -->
      <template #mapa>
        <div v-if="loading" class="estado">Procesando datos...</div>

        <div v-else style="position: relative; width: 100%; height: 100%">
          <!-- Data Filtration for map is done in computed prop 'datosMapa' -->
          <MapaMundi :resultados="datosMapa" :colores="coloresPartidos" />
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
        <!-- Usamos datos filtrados por Zona/Pais si aplica -->
        <GraficoBarras
          v-if="datosElectorales.cantones.length"
          :datos="datosGrafico"
          :candidatosExtraInfo="candidatos"
          categoria="presidentes"
        />
        <p v-else class="estado">No hay datos para gráficos</p>
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

      <!-- ================= INFO GENERAL ================= -->
      <template #footer-info>
        <BarraInformacionGeneral :stats="resumenNacional" />
      </template>
    </ContenedorCarrusel>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";

/* COMPONENTES */
import ContenedorCarrusel from "@/components/ContenedorCarrusel.vue";
import MapaMundi from "@/components/mapa/MapaMundi.vue";
import GraficoBarras from "@/components/mapa/GraficoBarras.vue";
import TablaGenerica from "@/components/mapa/TablaGenerica.vue";
import TarjetaCandidato from "@/components/mapa/TarjetaCandidato.vue";
import BarraInformacionGeneral from "@/components/BarraInformacionGeneral.vue";

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
const {
  loading,
  datosElectorales,
  mapas,
  candidatosInfo,
  resumenNacional,
  cargarTodo,
  obtenerEtapasDelAno,
} = useElectoralData();

/* CANDIDATOS */
const candidatos = computed(() => {
  // Similar filter logic to VotantesNacionales if needed, or just return all
  const info = candidatosInfo.value;
  if (!info || !Array.isArray(info)) return [];

  // Attempt to filter by active parties in results if possible
  // For now, return all to ensure full legend
  return info;
});

/* ETAPAS */
const etapasDisponibles = computed(() =>
  obtenerEtapasDelAno("EXTRANJEROS", props.year)
);

/* ESTADO DE FILTROS */
const drawer = ref(false);
const filtroVuelta = ref(1);
const partidoSeleccionado = ref("Resultados Generales");
const filtroZona = ref(null); // Equivalent to Provincia (Region/Zone)
const filtroPais = ref(null); // Equivalent to Canton (Country)

const buscar = () => {
  drawer.value = false;
};

const limpiarFiltros = () => {
  filtroZona.value = null;
  filtroPais.value = null;
  partidoSeleccionado.value = "Resultados Generales";
};

/* COLORES */
const coloresPartidos = computed(() => {
  const map = {};
  if (candidatosInfo.value && Array.isArray(candidatosInfo.value)) {
    candidatosInfo.value.forEach((c) => {
      if (c.nombrePartido && c.color) {
        map[c.nombrePartido] = { principal: c.color };
        // Alias if needed (historic data often has aliases)
        if (c.nombrePartido === "RC/RETO") map["RC5"] = { principal: c.color };
      }
    });
  }
  return map;
});

// Import local fallback data if needed, or rely on API/Props
import { dessertsData } from "@/assets/data/1996/CandidatosData";
const leyendaColores = dessertsData; // Using fallback for legend temporarily

/* COMPUTED LISTS FOR SELECTS */
const listaPartidos = computed(() => [
  "Resultados Generales",
  ...candidatos.value.map((c) => c.nombrePartido),
]);

// Extract unique Zonas from data if available, otherwise maybe use Continents logic if implied in data
// Looking at previous file checks, 'Cantones' data usually has 'CANTON' which is country name.
// 'Provincias' data usually acts as the Zone container.
const listaZonas = computed(() => {
  // If 'Provincias' file contains Zones (America Latina, Europa, etc.)
  if (
    datosElectorales.value.provincias &&
    datosElectorales.value.provincias.length
  ) {
    return datosElectorales.value.provincias
      .map((p) => p.PROVINCIA)
      .filter((p) => p)
      .sort();
  }
  return [];
});

const listaPaises = computed(() => {
  // Filter countries based on selected Zona
  // Assuming 'CODPRO' links Canton to Provincia (Country to Zone)
  let data = datosElectorales.value.cantones || [];

  if (filtroZona.value) {
    // Find ID of selected Zona
    const zonaObj = datosElectorales.value.provincias.find(
      (p) => p.PROVINCIA === filtroZona.value
    );
    if (zonaObj) {
      const idZona = zonaObj.CODPRO; // or CODPROV
      data = data.filter((d) => d.CODPRO === idZona || d.CODPROV === idZona);
    }
  }

  return data
    .map((d) => d.CANTON || d.PAIS)
    .filter((x) => x)
    .sort();
});

/* MANEJO DE CAMBIO DE PARTIDO */
const manejarCambioPartido = (partido) => {
  partidoSeleccionado.value = partido;
};

/* DATOS FILTRADOS */
// Mapa needs filtered data? Or MapaMundi shows all and we just highlight?
// Usually MapaMundi shows everything. If we filter by Country, maybe we only show that country?
// For now, let's pass everything to MapaMundi, as it is a global view.
const datosMapa = computed(() => {
  return datosElectorales.value.cantones || [];
});

// Grafico should reflect the filtered scope
const datosGrafico = computed(() => {
  if (filtroPais.value) {
    // Show specific country (maybe just one bar? or Parroquias/Consulates if available?)
    // If we don't have Parroquias for foreign, we show the Country itself
    return datosElectorales.value.cantones.filter(
      (d) => (d.CANTON || d.PAIS) === filtroPais.value
    );
  }
  if (filtroZona.value) {
    // Show countries in that Zone
    const zonaObj = datosElectorales.value.provincias.find(
      (p) => p.PROVINCIA === filtroZona.value
    );
    if (zonaObj) {
      const idZona = zonaObj.CODPRO;
      return datosElectorales.value.cantones.filter((d) => d.CODPRO === idZona);
    }
  }
  // Default: Show all Zones (Provincias equivalent)
  return datosElectorales.value.provincias || [];
});

/* DATOS TABLA */
const datosTabla = computed(() => {
  let datos = [];
  let tituloNivel = "EXTERIOR";

  if (filtroPais.value) {
    // If we have Parroquias (Consulates), show them.
    // If not loaded, we might just show the Country row.
    // Check if parroquias exist and match this country
    const paisObj = datosElectorales.value.cantones.find(
      (c) => (c.CANTON || c.PAIS) === filtroPais.value
    );
    if (paisObj && datosElectorales.value.parroquias.length) {
      const idPais = paisObj.CODCAN;
      datos = datosElectorales.value.parroquias.filter(
        (p) => p.CODCAN === idPais
      );
      tituloNivel = `${filtroPais.value}`;
    } else {
      // Fallback to showing just the country if no sub-units
      datos = [paisObj].filter((x) => x);
      tituloNivel = `${filtroPais.value}`;
    }
  } else if (filtroZona.value) {
    // Show Countries in Zone
    const zonaObj = datosElectorales.value.provincias.find(
      (p) => p.PROVINCIA === filtroZona.value
    );
    if (zonaObj) {
      const idZona = zonaObj.CODPRO;
      datos = datosElectorales.value.cantones.filter(
        (d) => d.CODPRO === idZona
      );
      tituloNivel = `${filtroZona.value}`;
    }
  } else {
    // Show Zones
    datos = datosElectorales.value.provincias || [];
  }

  return {
    rows: mapearDatosATabla(datos),
    titulo: `RESULTADOS ${tituloNivel} ${props.year}`,
  };
});

/* MAPEO TABLA HELPER */
const mapearDatosATabla = (datos) =>
  datos.map((item) => {
    const nombre =
      item.PARROQUIA || item.CANTON || item.PROVINCIA || "Desconocido";
    const partidoFilter = partidoSeleccionado.value;
    const isGeneral = partidoFilter === "Resultados Generales";

    let candidato = "N/A";
    let partido = "N/A";
    let porcentaje = 0;

    if (isGeneral) {
      const winner = item.ganador;
      partido = winner;
      if (item.resultados && winner && item.resultados[winner]) {
        candidato = item.resultados[winner].candidato;
        porcentaje = item.resultados[winner].porcentaje;
      }
    } else {
      partido = partidoFilter;
      // Handle aliases if needed
      let key = partidoFilter;
      if (item.resultados && item.resultados[key]) {
        candidato = item.resultados[key].candidato;
        porcentaje = item.resultados[key].porcentaje;
      } else {
        candidato = "";
        porcentaje = 0;
      }
    }

    return {
      nombre,
      candidato,
      partido,
      porcentaje,
    };
  });

/* EVENTOS */
const manejarCambioVuelta = (vuelta) => {
  filtroVuelta.value = vuelta;
};

/* WATCHERS */
watch(filtroZona, () => {
  filtroPais.value = null;
});

watch(filtroVuelta, (nuevaVuelta) => {
  if (nuevaVuelta) {
    cargarTodo(props.year, nuevaVuelta);
  }
});

watch(
  () => props.year,
  (nuevoYear) => {
    cargarTodo(nuevoYear, 1);
  }
);

/* LIFECYCLE */
onMounted(() => {
  cargarTodo(props.year, 1);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

.vista-extranjeros {
  padding: 0;
  position: relative;
}

.texto-filtro {
  margin-bottom: 5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.v-navigation-drawer {
  background: rgba(18, 162, 194, 0.85) !important;
  backdrop-filter: blur(8px);
}

.estado {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}
</style>
