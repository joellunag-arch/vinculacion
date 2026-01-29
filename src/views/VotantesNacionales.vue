<template>
  <div class="vista-nacional">
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

        <!-- PROVINCIA -->
        <div class="texto-filtro">PROVINCIA*</div>
        <v-select
          v-model="filtroProvincia"
          :items="listaProvincias"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-1"
          clearable
        ></v-select>
        <div class="mb-4 text-caption white--text">
          Seleccionado: {{ filtroProvincia }}
        </div>

        <!-- CANTON -->
        <div class="texto-filtro">CANTÓN</div>
        <v-select
          v-model="filtroCanton"
          :items="listaCantones"
          variant="outlined"
          density="compact"
          bg-color="rgba(255,255,255,0.1)"
          base-color="white"
          color="white"
          hide-details
          class="mb-1"
          :disabled="!filtroProvincia"
          clearable
        ></v-select>
        <div class="mb-4 text-caption white--text">
          Seleccionado: {{ filtroCanton }}
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
      titulo="Resultados Nacionales"
      :periodo="year"
      :etapasDisponibles="etapasDisponibles"
      :etapaActual="filtroVuelta"
      @update-etapa="manejarCambioVuelta"
      @toggle-search="drawer = !drawer"
      @clean-filters="limpiarFiltros"
    >
      <!-- ================= MAPA ================= -->
      <template #mapa>
        <div v-if="loading" class="estado">Procesando mapa...</div>

        <div class="compact-component compact-map" v-else-if="mapas.provincias">
          <MapaEcuador
            :key="filtroVuelta"
            :geoProvincias="mapas.provincias"
            :geoCantones="mapas.cantones"
            :geoParroquias="mapas.parroquias"
            :resultadosProvincias="datosElectorales.provincias"
            :resultadosCantones="datosElectorales.cantones"
            :resultadosParroquias="datosElectorales.parroquias"
            :colores="coloresPartidos"
            :id_1="mapFilters"
            :datosDescarga="datosElectorales.provincias"
          />
        </div>
      </template>

      <!-- ================= TARJETAS CANDIDATOS ================= -->
      <template #filtros>
        <div class="compact-component compact-tarjeta">
          <TarjetaCandidato
            :itemsCandidato="candidatos"
            :itemsLeyenda="leyendaColores"
            :etiquetaTarjeta2="partidoSeleccionado"
            @cambio-partido="manejarCambioPartido"
          />
        </div>
      </template>

      <!-- ================= GRÁFICOS ================= -->
      <template #graficos>
        <div class="compact-component compact-graficos" v-if="datosElectorales.provincias.length">
          <GraficoBarras
            :datos="datosElectorales.provincias"
            :candidatosExtraInfo="candidatos"
            categoria="presidentes"
          />
        </div>
        <p v-else class="estado">No hay datos para gráficos</p>
      </template>

      <!-- ================= TABLAS ================= -->
      <template #tablas>
        <div class="compact-component compact-tablas" v-if="datosTabla.rows.length">
          <TablaGenerica
            :datos="datosTabla.rows"
            :titulo="datosTabla.titulo"
          />
        </div>
        <p v-else class="estado">No hay datos para tabla</p>
      </template>

      <!-- ================= INFO GENERAL ================= -->
      <template #footer-info>
        <div class="sticky-footer-wrapper">
          <BarraInformacionGeneral :stats="resumenNacional" />
        </div>
      </template>
      <!-- ================= INFO GENERAL ================= -->
    </ContenedorCarrusel>
    
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";

/* COMPONENTES */
import ContenedorCarrusel from "@/components/ContenedorCarrusel.vue";
import MapaEcuador from "@/components/mapa/MapaEcuador.vue";
import GraficoBarras from "@/components/mapa/GraficoBarras.vue";
import TablaGenerica from "@/components/mapa/TablaGenerica.vue";
import TarjetaCandidato from "@/components/mapa/TarjetaCandidato.vue";
import BarraInformacionGeneral from "@/components/BarraInformacionGeneral.vue";

/* DATA IMPORT */

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
  const info = candidatosInfo.value;
  if (!info || !Array.isArray(info)) return [];

  // Try to filter based on active results in data
  const dataProv = datosElectorales.value.provincias;
  if (dataProv && dataProv.length > 0 && dataProv[0].resultados) {
    // Get keys that form the results (excluding metadata/stats)
    const keys = Object.keys(dataProv[0].resultados).filter(
      (k) =>
        ![
          "VOTOS",
          "BLANCOS",
          "NULOS",
          "AUSENTISMO",
          "VALIDOS",
          "totalVotos",
          "votos_validos",
        ].includes(k)
    );

    if (keys.length > 0) {
      return info.filter((c) => {
        // Direct match
        if (keys.includes(c.nombrePartido)) return true;
        return false;
      });
    }
  }
  return info;
});

/* ETAPAS */
const etapasDisponibles = computed(() =>
  obtenerEtapasDelAno("NACIONALES", props.year)
);

/* ESTADO DE FILTROS */
const drawer = ref(false);
const filtroVuelta = ref(1);
const partidoSeleccionado = ref("Resultados Generales");
const filtroProvincia = ref(null);
const filtroCanton = ref(null);

const buscar = () => {
  // El mapa es reactivo, así que solo cerramos el drawer
  drawer.value = false;
};

const limpiarFiltros = () => {
  filtroProvincia.value = null;
  filtroCanton.value = null;
  partidoSeleccionado.value = "Resultados Generales";
};

/* COLORES DE PARTIDOS (DINÁMICO) */
const coloresPartidos = computed(() => {
  const map = {};
  if (candidatosInfo.value && Array.isArray(candidatosInfo.value)) {
    candidatosInfo.value.forEach((c) => {
      if (c.nombrePartido && c.color) {
        map[c.nombrePartido] = { principal: c.color };
      }
    });
  }
  return map;
});

/* LISTAS COMPUTADAS PARA SELECTS */
const listaPartidos = computed(() => [
  "Resultados Generales",
  ...candidatos.value.map((c) => c.nombrePartido),
]);

const listaProvincias = computed(() => {
  const mapProv = mapas.value.provincias;
  if (!mapProv) return [];

  const features = Array.isArray(mapProv) ? mapProv : mapProv.features;
  if (!features) return [];

  return features
    .map((f) => f.properties.PROVINCIA)
    .filter((p) => p)
    .sort();
});

const listaCantones = computed(() => {
  const mapProv = mapas.value.provincias;
  const mapCan = mapas.value.cantones;

  if (!filtroProvincia.value || !mapProv || !mapCan) return [];

  const provFeatures = Array.isArray(mapProv) ? mapProv : mapProv.features;
  const canFeatures = Array.isArray(mapCan) ? mapCan : mapCan.features;

  if (!provFeatures || !canFeatures) return [];

  const provFeature = provFeatures.find(
    (f) => f.properties.PROVINCIA === filtroProvincia.value
  );
  if (!provFeature) return [];

  const idProv = String(provFeature.properties.CODPRO).replace(/^0+/, "");

  return canFeatures
    .filter((f) => String(f.properties.CODPRO).replace(/^0+/, "") === idProv)
    .map((f) => f.properties.CANTON || f.properties.NOM_CAN)
    .sort();
});

/* MANEJO DE CAMBIO DE PARTIDO (TARJETA) */
const manejarCambioPartido = (partido) => {
  partidoSeleccionado.value = partido;
};

/* FILTROS MAPA (id_1) - LÓGICA DE MAPA */
const idsSeleccionados = computed(() => {
  let idProv = "";
  let idCan = "";

  const mapProv = mapas.value.provincias;
  const mapCan = mapas.value.cantones;

  if (filtroProvincia.value && mapProv) {
    const provFeatures = Array.isArray(mapProv) ? mapProv : mapProv.features;
    if (provFeatures) {
      const provFeature = provFeatures.find(
        (f) => f.properties.PROVINCIA === filtroProvincia.value
      );
      if (provFeature) {
        idProv = String(provFeature.properties.CODPRO).replace(/^0+/, "");
      }
    }
  }

  if (filtroCanton.value && mapCan && idProv) {
    const canFeatures = Array.isArray(mapCan) ? mapCan : mapCan.features;
    if (canFeatures) {
      const canFeature = canFeatures.find((f) => {
        const pId = String(f.properties.CODPRO).replace(/^0+/, "");
        const cName = f.properties.CANTON || f.properties.NOM_CAN;
        return pId === idProv && cName === filtroCanton.value;
      });
      if (canFeature) {
        idCan = String(canFeature.properties.CODCAN).replace(/^0+/, "");
      }
    }
  }
  return { idProv, idCan };
});

const mapFilters = computed(() => {
  let partido =
    partidoSeleccionado.value === "Resultados Generales"
      ? ""
      : partidoSeleccionado.value;
  return [
    "1raVuelta",
    partido,
    idsSeleccionados.value.idProv,
    idsSeleccionados.value.idCan,
  ];
});

/* DATOS TABLA DINÁMICOS */
const datosTabla = computed(() => {
  const { idProv, idCan } = idsSeleccionados.value;
  let datos = [];
  let tituloNivel = "NACIONALES";

  if (idCan) {
    // Mostrar Parroquias del Cantón
    datos = datosElectorales.value.parroquias.filter(
      (d) => String(d.CODCAN).replace(/^0+/, "") === idCan
    );
    tituloNivel = `CANTÓN ${filtroCanton.value}`;
  } else if (idProv) {
    // Mostrar Cantones de la Provincia
    datos = datosElectorales.value.cantones.filter(
      (d) => String(d.CODPRO).replace(/^0+/, "") === idProv
    );
    tituloNivel = `PROVINCIA ${filtroProvincia.value}`;
  } else {
    // Mostrar Provincias
    datos = datosElectorales.value.provincias;
  }

  return {
    rows: mapearDatosATabla(datos),
    titulo: `RESULTADOS ${tituloNivel} ${props.year}`,
  };
});

/* WATCHERS */
watch(filtroProvincia, () => {
  filtroCanton.value = null;
});

watch(filtroVuelta, (nuevaVuelta) => {
  if (nuevaVuelta) {
    cargarTodo(props.year, nuevaVuelta);
  }
});

import { dessertsData } from "@/assets/data/1996/CandidatosData";
const leyendaColores = dessertsData;

/* MAPEO TABLA */
const mapearDatosATabla = (datos) =>
  datos.map((item) => {
    // Determine location name based on available keys
    const nombre =
      item.PARROQUIA || item.CANTON || item.PROVINCIA || "Desconocido";

    // Check filter
    const partidoFilter = partidoSeleccionado.value;
    const isGeneral = partidoFilter === "Resultados Generales";

    let candidato = "N/A";
    let partido = "N/A";
    let porcentaje = 0;

    if (isGeneral) {
      // Show winner
      const winner = item.ganador;
      partido = winner;
      if (item.resultados && winner && item.resultados[winner]) {
        candidato = item.resultados[winner].candidato;
        porcentaje = item.resultados[winner].porcentaje;
      }
    } else {
      // Show selected party
      partido = partidoFilter;
      let key = partidoFilter;

      if (item.resultados && item.resultados[key]) {
        candidato = item.resultados[key].candidato;
        porcentaje = item.resultados[key].porcentaje;
      } else {
        // Party didn't participate or 0 votes
        candidato = ""; // Or lookup candidate name from global info if needed
        porcentaje = 0;
      }
    }

    return {
      nombre: nombre,
      candidato: candidato,
      partido: partido,
      porcentaje: porcentaje,
    };
  });

/* EVENTOS */
const manejarCambioVuelta = (vuelta) => {
  filtroVuelta.value = vuelta;
};

/* LIFECYCLE */
onMounted(async () => {
  console.log("VotantesNacionales montado");
  await cargarTodo(props.year, 1);

  // Verificación de candidatos
  console.log(" Candidatos cargados (candidatosInfo):", candidatosInfo.value);
  console.log(" Total candidatos computados:", candidatos.value.length);
  console.log(
    " Datos Electorales (provincias):",
    datosElectorales.value.provincias
  );

  // Verifica URLs de imágenes
  if (candidatos.value.length > 0) {
    console.log(" Primera imagen URL:", candidatos.value[0].url);
    console.log(" Primer logo URL:", candidatos.value[0].logo);
  }
});

watch(
  () => props.year,
  (nuevoYear) => cargarTodo(nuevoYear, 1)
);
</script>

<style scoped>
.vista-nacional {
  padding: 0;
  position: relative; /* Para el drawer */
}

/*+++++++*/
.sticky-footer-wrapper {
  position: sticky;
  bottom: 0;
}
/*++++++++++*/

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

/* Compact component wrappers to scale down heavy visual components */
.compact-component {
  transform-origin: center top;
  transition: transform 160ms ease;
}

@media (min-width: 1400px) {
  .compact-map { transform: scale(0.82); }
  .compact-graficos { transform: scale(0.75); }
  .compact-tablas { transform: scale(0.82); }
  .compact-tarjeta { transform: scale(0.92); }
}

@media (min-width: 992px) and (max-width: 1399px) {
  .compact-map { transform: scale(0.86); }
  .compact-graficos { transform: scale(0.80); }
  .compact-tablas { transform: scale(0.86); }
  .compact-tarjeta { transform: scale(0.95); }
}

@media (max-width: 991px) {
  .compact-map { transform: scale(0.94); }
  .compact-graficos { transform: scale(0.90); }
  .compact-tablas { transform: scale(0.96); }
  .compact-tarjeta { transform: scale(0.98); }
}
</style>
