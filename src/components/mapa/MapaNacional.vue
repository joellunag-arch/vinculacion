<template>
  <v-sheet class="position-relative overflow-hidden">
    <v-navigation-drawer v-model="drawer" absolute temporary width="300" color="#12a2c2" dark>
      <v-container class="contenedor-filtros">
        <h3 class="mb-4 text-uppercase" style="font-family: 'Oswald', sans-serif">
          SELECCIONAR EN FILTRO
        </h3>

        <div class="texto-filtro">VUELTA*</div>
        <v-select v-model="type" :items="types" outlined dense background-color="rgba(255,255,255,0.1)" hide-details
          dark class="mb-1"></v-select>
        <div class="mb-4 white--text caption">Seleccionado: {{ type }}</div>

        <div class="texto-filtro">PARTIDO POLITICO*</div>
        <v-select v-model="partido" :items="arregloPartido" outlined dense background-color="rgba(255,255,255,0.1)"
          hide-details dark class="mb-1"></v-select>
        <div class="mb-4 white--text caption">Seleccionado: {{ partido }}</div>

        <div class="texto-filtro">PROVINCIA*</div>
        <v-select v-model="select" :items="provs" outlined dense background-color="rgba(255,255,255,0.1)" hide-details
          dark class="mb-1"></v-select>
        <div class="mb-4 white--text caption">Seleccionado: {{ select }}</div>

        <div class="texto-filtro">CANTÓN</div>
        <v-select v-model="select2" :items="cantons" outlined dense background-color="rgba(255,255,255,0.1)"
          hide-details dark class="mb-1"></v-select>
        <div class="mb-6 white--text caption">Seleccionado: {{ select2 }}</div>

        <p class="caption white--text">*Campo Obligatorio</p>

        <v-btn block color="white" light class="font-weight-bold" style="font-family: 'Oswald', sans-serif"
          @click="datosBusqueda2()">
          BUSCAR
        </v-btn>
      </v-container>
    </v-navigation-drawer>

    <v-btn color="#12a2c2" dark fab small absolute top left style="top: 20px; left: 20px; z-index: 5"
      @click="drawer = !drawer">
      <v-icon>search</v-icon>
    </v-btn>

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
                      {{ this.titulo }}
                    </div>
                  </v-card>
                </div>

                <div class="contenedor-botones-vuelta">
                  <v-btn tile class="btn-vuelta" :class="expand ? 'btn-vuelta-activo' : 'btn-vuelta-inactivo'"
                    @click="primeraV">
                    PRIMERA VUELTA
                  </v-btn>

                  <v-btn tile class="btn-vuelta" :class="!expand ? 'btn-vuelta-activo' : 'btn-vuelta-inactivo'"
                    @click="segundaV">
                    SEGUNDA VUELTA
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="9">
              <MapaEcuador 
                :id_1="id_codMapa" 
                :geoProvincias="geoProvincias" 
                :geoCantones="geoCantones"
                :geoParroquias="geoParroquias" 
                :resultadosProvincias="resultadosProvincias"
                :resultadosCantones="resultadosCantones" 
                :resultadosParroquias="resultadosParroquias" 
                :colores="colores"
                :datosDescarga="datosExportacion"
                :partidoActivo="partidoActivoInterno"
                @mapaTitulo="(i) => (tituloMapa = i)" 
              />
            </v-col>

            <v-col cols="12" md="3" style="position: relative;">
              <v-btn icon color="#12a2c2" style="position: absolute; top: -20px; right: 45px; z-index: 5"
                @click="limpiar">
                <v-icon color="white" size="24">mdi-delete</v-icon>
              </v-btn>

              <div class="mt-4">
                <TarjetaCandidato 
                  :itemsCandidato="listaCandidatos" 
                  :itemsLeyenda="listaLeyenda"
                  :etiquetaTarjeta2="partidoActivoInterno"
                  @cambio-partido="manejarCambioPartido" 
                />
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import MapaEcuador from "./MapaEcuador.vue";
import TarjetaCandidato from "@/components/mapa/TarjetaCandidato.vue";
import { candidatoData, dessertsData } from "@/assets/data/1996/CandidatosData.js";

export default {
  name: "MapaNacional",
  components: { 
    MapaEcuador,
    TarjetaCandidato
  },
  props: {
    geoProvincias: { type: Object, required: true },
    geoCantones: { type: Object, required: false, default: () => ({}) },
    geoParroquias: { type: Object, required: false, default: () => ({}) },

    resultadosProvincias: { type: Array, default: () => [] },
    resultadosCantones: { type: Array, default: () => [] },
    resultadosParroquias: { type: Array, default: () => [] },
    colores: { type: Object, default: () => ({}) },
    datosExportacion: { type: Array, default: () => [] },

    tituloInicial: { type: String, default: "Resultados Nacionales" },
    
    // NUEVA PROP: Recibe el partido seleccionado desde VistaNacional
    partidoActivo: { type: String, default: "Resultados Generales" },

    expand_b: String,
    expand2_b: String,
  },
  data() {
    return {
      select: "",
      select2: "",
      type: "1",
      types: ["1", "2"],
      partido: "",

      drawer: null,
      numvuelta: "1",
      id_codMapa: ["1raVuelta", "", "", ""],

      expand: true,
      tituloMapa: "0",
      titulo: this.tituloInicial,

      // Estado interno del partido
      partidoActivoInterno: this.partidoActivo,

      // Datos para tarjeta
      listaCandidatos: candidatoData,
      listaLeyenda: dessertsData,
    };
  },

  computed: {
    provs() {
      if (!this.geoProvincias || !this.geoProvincias.features) return [];
      return this.geoProvincias.features.map(f => f.properties.PROVINCIA).sort();
    },
    cantons() {
      if (!this.select || !this.geoProvincias || !this.geoCantones) return [];

      const provFeature = this.geoProvincias.features.find(f => f.properties.PROVINCIA === this.select);
      if (!provFeature) return [];

      const idProv = String(provFeature.properties.CODPRO).replace(/^0+/, "");

      return this.geoCantones.features
        .filter(f => String(f.properties.CODPRO).replace(/^0+/, "") === idProv)
        .map(f => f.properties.CANTON || f.properties.NOM_CAN)
        .sort();
    },
    arregloPartido() {
      return Object.keys(this.colores);
    }
  },

  watch: {
    // Sincronizar cuando cambia desde el padre
    partidoActivo(nuevoPartido) {
      this.partidoActivoInterno = nuevoPartido;
    },
    
    type() {
      this.datosBusqueda2();
    },
    partido() {
      this.datosBusqueda2();
    },
    select() {
      this.select2 = "";
      this.datosBusqueda2();
    },
    select2() {
      this.datosBusqueda2();
    }
  },

  methods: {
    // NUEVO MÉTODO: Maneja el cambio desde TarjetaCandidato
    manejarCambioPartido(partido) {
      this.partidoActivoInterno = partido;
      this.partido = partido === "Resultados Generales" ? "" : partido;
      
      // Emitir al padre (VistaNacional)
      this.$emit('cambio-partido', partido);
      
      // Actualizar el mapa
      this.datosBusqueda2();
    },

    limpiar() {
      this.type = "1";
      this.select = "";
      this.select2 = "";
      this.partido = "";
      this.partidoActivoInterno = "Resultados Generales";
      this.primeraV();
      this.drawer = false;
      this.$emit('filter-change', { provincia: '', canton: '', partido: '' });
      this.$emit('cambio-partido', 'Resultados Generales');
    },
    
    primeraV() {
      this.expand = true;
      this.$emit("add", 0);
      this.numvuelta = "1";
      this.titulo = this.tituloInicial;
      this.id_codMapa = ["1raVuelta", "", "", ""];
    },
    
    segundaV() {
      this.expand = false;
      this.asignarTitulo2();
      this.$emit("add", 1);
      this.numvuelta = "2";
      this.titulo = this.tituloInicial;
      this.id_codMapa = ["2daVuelta", "", "", ""];
    },

    datosBusqueda2() {
      let varVuelta = this.type == "1" ? "1raVuelta" : "2daVuelta";
      this.expand = (this.type == "1");

      // Usar partidoActivoInterno en lugar de partido
      let condicionPartido = this.partidoActivoInterno === "Resultados Generales" 
        ? "" 
        : this.partidoActivoInterno;

      if (this.select == "") {
        this.id_codMapa = [varVuelta, condicionPartido, "", ""];
      } else if (this.select2 == "") {
        const provFeature = this.geoProvincias.features.find(f => f.properties.PROVINCIA === this.select);
        if (provFeature) {
          const id = String(provFeature.properties.CODPRO).replace(/^0+/, "");
          this.id_codMapa = [varVuelta, condicionPartido, id, ""];
        }
      } else {
        const provFeature = this.geoProvincias.features.find(f => f.properties.PROVINCIA === this.select);
        if (provFeature) {
          const idProv = String(provFeature.properties.CODPRO).replace(/^0+/, "");
          const cantonFeature = this.geoCantones.features.find(f =>
            String(f.properties.CODPRO).replace(/^0+/, "") === idProv &&
            (f.properties.CANTON === this.select2 || f.properties.NOM_CAN === this.select2)
          );

          if (cantonFeature) {
            const idCan = String(cantonFeature.properties.CODCAN).replace(/^0+/, "");
            this.id_codMapa = [varVuelta, condicionPartido, idProv, idCan];
          }
        }
      }

      this.asignarTitulo();
      this.drawer = false;
      
      this.$emit('filter-change', {
        provincia: this.select,
        canton: this.select2,
        partido: condicionPartido
      });
    },

    asignarTitulo() {
      if (this.select2) {
        this.titulo = "RESULTADOS " + this.select2;
      } else if (this.select) {
        this.titulo = "RESULTADOS " + this.select;
      } else {
        this.titulo = this.tituloInicial;
      }
    },
    asignarTitulo2() { },

    selectProv() {
      return "";
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
</style>