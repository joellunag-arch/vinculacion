<template>
  <v-sheet class="position-relative overflow-hidden">



    <v-container fluid class="fondo-general">
      <v-row no-gutters>
        <v-card outlined color="transparent" width="100%">
          <v-row no-gutters>
            <v-col cols="12" md="3"></v-col>
            <v-col cols="12" md="6">
              <div class="flex-column-center">
                <div class="contenedor-titulo">
                  <v-card elevation="24" color="#2c3e50">
                    <div class="tarjeta-titulo-mapa">
                      {{ tituloMap }}
                    </div>
                  </v-card>
                </div>

                <div class="contenedor-botones-vuelta">
                  <v-btn tile class="btn-vuelta" :class="esPrimeraVuelta ? 'btn-vuelta-activo' : 'btn-vuelta-inactivo'"
                    @click="setVuelta(1)">
                    PRIMERA VUELTA
                  </v-btn>

                  <v-btn tile class="btn-vuelta" :class="!esPrimeraVuelta ? 'btn-vuelta-activo' : 'btn-vuelta-inactivo'"
                    @click="setVuelta(2)">
                    SEGUNDA VUELTA
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="9">
              <MapaMundi :datos="datosParaMapa" :configuracion="configuracionMapa" :datosDescarga="datosExportacion" />
            </v-col>
            <v-col cols="12" md="3">
              <v-card class="pa-4 text-center">
                <h3>Tarjetas Pendientes</h3>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import MapaMundi from "./MapaMundi.vue";

const NAME_TO_ISO = {
  "ESPAÑA": "ES",
  "ITALIA": "IT",
  "ESTADOS UNIDOS": "US",
  "CANADA": "CA",
  "CANADÁ": "CA",
  "VENEZUELA": "VE",
  "COLOMBIA": "CO",
  "PERU": "PE",
  "PERÚ": "PE",
  "CHILE": "CL",
  "ARGENTINA": "AR",
  "BRASIL": "BR",
  "MEXICO": "MX",
  "MÉXICO": "MX",
  "RUSIA": "RU",
  "CHINA": "CN",
  "JAPON": "JP",
  "JAPÓN": "JP",
  "AUSTRALIA": "AU",
  "REINO UNIDO": "GB",
  "FRANCIA": "FR",
  "ALEMANIA": "DE",
  "SUIZA": "CH",
  "BELGICA": "BE",
  "BÉLGICA": "BE",
  "PAISES BAJOS": "NL",
  "SUECIA": "SE"
};

export default {
  name: "MapaExtranjero",

  components: {
    MapaMundi,
  },

  props: {
    resultadosCantones: { type: Array, default: () => [] },
    cantonesData: { type: Array, default: () => [] },
    parroquiasData: { type: Array, default: () => [] },
    colores: { type: Object, default: () => ({}) },
    tituloMap: { type: String, default: "Resultados Internacionales" },
  },

  data() {
    return {

      vueltaSeleccionada: 1,
      configuracionMapa: {
        colorDefecto: "#CCC6C6",
        colorBorde: "#000000",
        proyeccion: "Miller",
      },
    };
  },

  computed: {
    datosExportacion() {
      const cantonesFiltrados = this.cantonesData.filter(c => c.CANTON && NAME_TO_ISO[c.CANTON.toUpperCase()]);
      
      const idsCantones = new Set(cantonesFiltrados.map(c => c.CODCAN));
      const parroquiasFiltradas = this.parroquiasData.filter(p => idsCantones.has(p.CODCAN));

      return [

        ...cantonesFiltrados,
        ...parroquiasFiltradas
      ];
    },

    esPrimeraVuelta() {
      return this.vueltaSeleccionada === 1;
    },

    datosParaMapa() {
      if (!this.resultadosCantones || this.resultadosCantones.length === 0) return [];

      const datosMapeados = [];

      this.resultadosCantones.forEach(cantonData => {
        const nombreCanton = cantonData.CANTON ? cantonData.CANTON.toUpperCase() : "";

        const isoCode = NAME_TO_ISO[nombreCanton];

        if (isoCode) {
           let winnerName = cantonData.ganador || "Desconocido";
           let winnerVotes = 0;
           let winnerPercent = 0;

           let fill = "#cccccc";
           let tooltipText = "";

           if (cantonData.resultados && cantonData.resultados[winnerName]) {
             winnerVotes = cantonData.resultados[winnerName].votos;
             winnerPercent = cantonData.resultados[winnerName].porcentaje; 
           }

           if (this.colores[winnerName]) {
             fill = this.colores[winnerName].principal || this.colores[winnerName]; 
           }
           
           tooltipText = `[bold]${nombreCanton}[/]\nGanador: ${winnerName}\nVotos: ${winnerVotes.toLocaleString()} (${winnerPercent}%)`;

           datosMapeados.push({
             id: isoCode,
             name: nombreCanton,
             fill: fill, 
             colorHover: fill,
             ganador: winnerName,
             votos: winnerVotes.toLocaleString(),
             tooltipPersonalizado: tooltipText
           });
        }
      });

      return datosMapeados;
    },
  },

  methods: {
    setVuelta(numero) {
      this.vueltaSeleccionada = numero;
    },

  },
};
</script>

<style scoped></style>