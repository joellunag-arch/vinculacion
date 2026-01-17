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
        <h3 class="mb-4 text-uppercase fw-bold" style="font-family: 'Oswald', sans-serif; color: white;">
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
        <div class="mb-4 text-caption white--text">Seleccionado: {{ filtroVuelta }}</div>

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
        <div class="mb-4 text-caption white--text">Seleccionado: {{ partidoSeleccionado }}</div>

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
        <div class="mb-4 text-caption white--text">Seleccionado: {{ filtroProvincia }}</div>

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
        <div class="mb-4 text-caption white--text">Seleccionado: {{ filtroCanton }}</div>

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

        <MapaEcuador
          v-else-if="mapas.provincias"
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
const { loading, datosElectorales, mapas, candidatosInfo, cargarTodo, obtenerEtapasDelAno } =
  useElectoralData();

/* CANDIDATOS */
const candidatos = computed(() => {
  const info = candidatosInfo.value;
  if (!info || !Array.isArray(info)) return [];
  
  // Try to filter based on active results in data
  const dataProv = datosElectorales.value.provincias;
  if (dataProv && dataProv.length > 0 && dataProv[0].resultados) {
      // Get keys that form the results (excluding metadata/stats)
      const keys = Object.keys(dataProv[0].resultados).filter(k => 
         !['VOTOS', 'BLANCOS', 'NULOS', 'AUSENTISMO', 'VALIDOS', 'totalVotos', 'votos_validos'].includes(k)
      );

      if (keys.length > 0) {
          return info.filter(c => {
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
const listaPartidos = computed(() => ["Resultados Generales", ...candidatos.value.map(c => c.nombrePartido)]);

const listaProvincias = computed(() => {
  const mapProv = mapas.value.provincias;
  if (!mapProv) return [];
  
  const features = Array.isArray(mapProv) ? mapProv : mapProv.features;
  if (!features) return [];

  return features
    .map((f) => f.properties.PROVINCIA)
    .filter(p => p)
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
         f => f.properties.PROVINCIA === filtroProvincia.value
      );
      if (provFeature) {
        idProv = String(provFeature.properties.CODPRO).replace(/^0+/, "");
      }
    }
  }

  if (filtroCanton.value && mapCan && idProv) {
     const canFeatures = Array.isArray(mapCan) ? mapCan : mapCan.features;
     if (canFeatures) {
       const canFeature = canFeatures.find(f => {
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
  let partido = partidoSeleccionado.value === "Resultados Generales" ? "" : partidoSeleccionado.value;
  return ["1raVuelta", partido, idsSeleccionados.value.idProv, idsSeleccionados.value.idCan];
});

/* DATOS TABLA DINÁMICOS */
const datosTabla = computed(() => {
  const { idProv, idCan } = idsSeleccionados.value;
  let datos = [];
  let tituloNivel = "NACIONALES";

  if (idCan) {
    // Mostrar Parroquias del Cantón
    datos = datosElectorales.value.parroquias.filter(d => 
      String(d.CODCAN).replace(/^0+/, "") === idCan
    );
    tituloNivel = `CANTÓN ${filtroCanton.value}`;
  } else if (idProv) {
    // Mostrar Cantones de la Provincia
    datos = datosElectorales.value.cantones.filter(d => 
      String(d.CODPRO).replace(/^0+/, "") === idProv
    );
    tituloNivel = `PROVINCIA ${filtroProvincia.value}`;
  } else {
    // Mostrar Provincias
    datos = datosElectorales.value.provincias;
  }

  return { rows: mapearDatosATabla(datos), titulo: `RESULTADOS ${tituloNivel} ${props.year}` };
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
    const nombre = item.PARROQUIA || item.CANTON || item.PROVINCIA || "Desconocido";
    
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
       porcentaje: porcentaje
    };
  });

/* EVENTOS */
const manejarCambioVuelta = (vuelta) => {
  filtroVuelta.value = vuelta;
};

/* LIFECYCLE */
onMounted(async () => {
  console.log("🚀 VotantesNacionales montado");
  await cargarTodo(props.year, 1);
  
  // Verificación de candidatos
  console.log('📊 Candidatos cargados (candidatosInfo):', candidatosInfo.value);
  console.log('🎨 Total candidatos computados:', candidatos.value.length);
  console.log('📦 Datos Electorales (provincias):', datosElectorales.value.provincias);
  
  // Verifica URLs de imágenes
  if (candidatos.value.length > 0) {
    console.log('🖼️ Primera imagen URL:', candidatos.value[0].url);
    console.log('🏢 Primer logo URL:', candidatos.value[0].logo);
  }
});

watch(
  () => props.year,
  (nuevoYear) => cargarTodo(nuevoYear, 1)
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

.vista-nacional {
  padding: 2rem;
  position: relative; /* Para el drawer */
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