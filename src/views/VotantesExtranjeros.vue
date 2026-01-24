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
          style="font-family: &quot;Oswald&quot;, sans-serif; color: white"
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
        <div class="mb-4 text-caption white--text">Seleccionado: {{ filtroZona || "Todas" }}</div>

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
        <div class="mb-4 text-caption white--text">Seleccionado: {{ filtroPais || "Todos" }}</div>

        <p class="text-caption white--text mb-4">*Campo Obligatorio</p>

        <v-btn
          block
          color="white"
          class="font-weight-bold"
          style="color: #12a2c2; font-family: &quot;Oswald&quot;, sans-serif"
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
          <MapaMundi
            :resultados="datosMapa"
            :colores="coloresPartidos"
            :filtroPartido="partidoSeleccionado"
            :candidatosInfo="candidatosInfo"
            :escalaColores="leyendaColores"
            @datos-procesados="manejarDatosMapa"
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
  leyendaColores,
  resumenNacional,
  cargarTodo,
  obtenerEtapasDelAno,
} = useElectoralData();

/* CANDIDATOS */
const candidatos = computed(() => {
  const info = candidatosInfo.value;
  if (!info || !Array.isArray(info)) return [];

  // Filtrar candidatos basándonos en los datos electorales actuales
  // Si hay datos, miramos qué partidos participan en el primer registro
  if (
    datosElectorales.value &&
    datosElectorales.value.cantones &&
    datosElectorales.value.cantones.length > 0
  ) {
    const primerRegistro = datosElectorales.value.cantones[0];
    if (primerRegistro && primerRegistro.resultados) {
      const partidosEnJuego = Object.keys(primerRegistro.resultados);

      // Filtramos la lista maestra de candidatos
      return info.filter((c) => {
        // Incluimos si el partido está en los resultados
        // O si es un alias conocido (ej: PID/MOVER para ADN)
        return partidosEnJuego.includes(c.nombrePartido) || partidosEnJuego.includes(c.json);
      });
    }
  }

  // Fallback: Si no hay datos aún, mostrar todos (o ninguno)
  return info;
});

/* ETAPAS */
const etapasDisponibles = computed(() => obtenerEtapasDelAno("EXTRANJEROS", props.year));

/* ESTADO DE FILTROS */
const drawer = ref(false);
// Inicializar con la primera etapa disponible (ej: 2 para 2023) o fallback a 1
const filtroVuelta = ref(etapasDisponibles.value.length > 0 ? etapasDisponibles.value[0] : 1);

const partidoSeleccionado = ref("Resultados Generales");
const filtroZona = ref(null);
const filtroPais = ref(null);

const buscar = () => {
  drawer.value = false;
};

const limpiarFiltros = () => {
  filtroZona.value = null;
  filtroPais.value = null;
  partidoSeleccionado.value = "Resultados Generales";
};

/* DATA DEL MAPA (PROCESADA Y FILTRADA) */
const datosMapaProcesados = ref([]);

const manejarDatosMapa = (datos) => {
  console.log("Datos recibidos del mapa:", datos);
  datosMapaProcesados.value = datos;
};

/* COLORES */
const coloresPartidos = computed(() => {
  const map = {};
  if (candidatosInfo.value && Array.isArray(candidatosInfo.value)) {
    candidatosInfo.value.forEach((c) => {
      if (c.nombrePartido && c.color) {
        map[c.nombrePartido] = { principal: c.color };
        if (c.nombrePartido === "RC/RETO") map["RC5"] = { principal: c.color };
      }
    });
  }
  return map;
});

import { NAME_TO_ISO } from "@/helpers/countryMapping";

/* DATA FILTRADA BASE (SOLO EXTRANJEROS) */
const cantonesExtranjeros = computed(() => {
  if (!datosElectorales.value.cantones) return [];
  return datosElectorales.value.cantones.filter((c) => {
    // Filtramos usando el diccionario de paises (NAME_TO_ISO)
    const nombre = (c.CANTON || c.PAIS || "").toUpperCase();
    return NAME_TO_ISO.hasOwnProperty(nombre);
  });
});

/* LISTAS FILTROS */
const listaPartidos = computed(() => [
  "Resultados Generales",
  ...candidatos.value.map((c) => c.nombrePartido),
]);

// La lista de zonas se filtra para que coincida con la data extranjera si es necesario
const listaZonas = computed(() => []);

const listaPaises = computed(() => {
  let data = cantonesExtranjeros.value;

  // Si en el futuro se habilitan zonas, filtrar aqui
  if (filtroZona.value) {
    // logica de zonas
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
const datosMapa = computed(() => {
  return cantonesExtranjeros.value;
});

const datosGrafico = computed(() => {
  if (filtroPais.value) {
    return cantonesExtranjeros.value.filter((d) => (d.CANTON || d.PAIS) === filtroPais.value);
  }
  return cantonesExtranjeros.value;
});

/* DATOS TABLA */
const datosTabla = computed(() => {
  let datos = [];
  let tituloNivel = "EXTERIOR";

  if (filtroPais.value) {
    const paisObj = cantonesExtranjeros.value.find(
      (c) => (c.CANTON || c.PAIS) === filtroPais.value,
    );
    if (paisObj) {
      datos = [paisObj];
      tituloNivel = `${filtroPais.value}`;
    }
  } else {
    // Listado de todos los países
    // PREFERENCIA: Usar datos procesados por el mapa si existen (ya tienen ganador calculado y filtrado)
    if (datosMapaProcesados.value && datosMapaProcesados.value.length > 0) {
      datos = datosMapaProcesados.value;
    } else {
      // Fallback a lógica original si el mapa no ha emitido aún
      datos = cantonesExtranjeros.value;
    }
  }

  return {
    rows: mapearDatosATabla(datos),
    titulo: `RESULTADOS ${tituloNivel} ${props.year}`,
  };
});

/* MAPEO TABLA HELPER */
const mapearDatosATabla = (datos) =>
  datos.map((item) => {
    const partidoFilter = partidoSeleccionado.value;
    const isGeneral = partidoFilter === "Resultados Generales";

    let candidato = "N/A";
    let partido = "N/A";
    let porcentaje = 0;

    // Caso 1: Resultados Generales (Mostrar Ganador)
    if (isGeneral) {
      // Si viene pre-procesado del mapa (que ya calcula ganadores)
      if (item.ganador !== undefined) {
        partido = item.ganador;
        candidato = item.candidato || "N/A";
        porcentaje = item.porcentaje || 0;
      }
      // Si es data cruda
      else {
        const winner = item.ganador || "N/A";
        partido = winner;
        if (item.resultados && winner && item.resultados[winner]) {
          candidato = item.resultados[winner].candidato;
          porcentaje = item.resultados[winner].porcentaje;
        }
      }
    }
    // Caso 2: Partido Específico (Mostrar datos de ese partido en cada país)
    else {
      partido = partidoFilter;
      // Intentamos buscar datos específicos del partido en los resultados del item
      if (item.resultados) {
        // Buscamos por nombre directo o buscamos si hay algún alias (ej: PID/MOVER para ADN)
        // Nota: Para simplificar, asumimos que el filtro coincide con la llave o usamos la lógica de alias simple

        let dataPartido = item.resultados[partidoFilter];

        // Si no encontramos directo, podríamos buscar en la lista de candidatos para ver si tiene un json key diferente
        if (!dataPartido) {
          const candidatoInfo = candidatos.value.find((c) => c.nombrePartido === partidoFilter);
          if (candidatoInfo && candidatoInfo.json && item.resultados[candidatoInfo.json]) {
            dataPartido = item.resultados[candidatoInfo.json];
          }
        }

        if (dataPartido) {
          candidato = dataPartido.candidato;
          porcentaje = dataPartido.porcentaje;
        } else {
          candidato = "Sin votos / No presentado";
          porcentaje = 0;
        }
      }
    }

    const nombre = item.name || item.CANTON || item.PAIS || "Desconocido";

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
const actualizarEtapa = () => {
  // Si cambia el año filtrado, actualizamos la vuelta disponible
  const etapas = obtenerEtapasDelAno("EXTRANJEROS", props.year);
  if (etapas.length > 0 && !etapas.includes(filtroVuelta.value)) {
    filtroVuelta.value = etapas[0];
  }
  cargarTodo(props.year, filtroVuelta.value);
};

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
  () => {
    actualizarEtapa();
  },
);

/* LIFECYCLE */
onMounted(() => {
  // Aseguramos que se cargue la etapa correcta al montar
  const etapas = obtenerEtapasDelAno("EXTRANJEROS", props.year);
  if (etapas.length > 0) {
    filtroVuelta.value = etapas[0];
  }
  cargarTodo(props.year, filtroVuelta.value);
});
</script>

<style scoped>
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
