<template>
  <div class="graficobarras_container">
    <!-- Título dinámico usando la prop year -->
    <div class="titulo-estatico">Gráfica Resultados {{ year }}</div>

    <div class="chart-scroll-wrapper" :class="{'modo_centrado': pocosCandidatos}">
      <apexchart
        v-if="chartReady"
        :width="longitud"
        height="450"
        :options="chartOptions"
        :series="series"
      ></apexchart>
      
      <!-- Feedback visual mientras el controlador procesa los JSON -->
      <div v-else class="loading-container Oswald">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Procesando Gráficos de {{ year }}...
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
// Asegúrate de que este helper exista en tu carpeta src/helpers/
import { obtenerTotalesPresidenteFachada } from "@/helpers/procesarVotosHelper";

export default {
  name: 'GraficoBarras',
  components: { 
    apexchart: VueApexCharts 
  },
  props: {
    datos: {
      type: Array,
      required: true
    },
    // Recibe la info de fotos/colores que el controlador carga por año
    candidatos: {
      type: Array,
      default: () => []
    },
    year: String,
    categoria: {
      type: String,
      default: "presidentes"
    }
  },
  data() {
    return {
      chartReady: false,
      longitud: "100%",
      pocosCandidatos: false,
      series: [{ name: "Porcentaje Nacional", data: [] }],
      chartOptions: {
        chart: { 
          type: "bar", 
          toolbar: { show: false },
          animations: { enabled: true }
        },
        plotOptions: { 
          bar: { 
            distributed: true, 
            columnWidth: "45%",
            borderRadius: 4
          } 
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val + "%",
          style: { fontSize: '14px', fontFamily: 'Oswald' }
        },
        xaxis: { 
          categories: [],
          labels: { style: { fontSize: '12px', fontWeight: 600 } }
        },
        legend: { show: false }
      }
    };
  },
  watch: {
    // Si los datos cambian (cambio de año o vuelta), refrescamos el gráfico
    datos: {
      handler() { this.procesarDatos(); },
      deep: true
    }
  },
  methods: {
    async procesarDatos() {
      this.chartReady = false;
      
      if (!this.datos || this.datos.length === 0) return;

      try {
        // El helper suma los votos de todas las provincias del JSON cargado
        const resultadosNacionales = obtenerTotalesPresidenteFachada(this.datos, this.categoria);
        const siglas = Object.keys(resultadosNacionales);

        // Actualizamos las series y opciones
        this.series = [{
          name: "Porcentaje",
          data: siglas.map(s => resultadosNacionales[s].porcentaje)
        }];

        this.chartOptions = {
          ...this.chartOptions,
          xaxis: { 
            categories: siglas.map(s => resultadosNacionales[s].candidato) 
          },
          // Aplicamos los colores institucionales definidos en el JSON/Helper
          colors: siglas.map(s => resultadosNacionales[s].color || '#246cb6')
        };

        // Ajuste de scroll si hay muchos candidatos
        this.longitud = siglas.length > 4 ? "180%" : "100%";
        this.pocosCandidatos = siglas.length <= 4;
        
        this.chartReady = true;
      } catch (error) {
        console.error("Error al procesar gráfica:", error);
      }
    }
  },
  mounted() {
    this.procesarDatos();
  }
};
</script>

<style scoped>
.graficobarras_container {
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
}

.titulo-estatico {
  font-family: var(--font-titles);
  background-color: var(--color-secondary);
  color: white;
  padding: 10px 30px;
  border-radius: 4px;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
}

.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
}

.modo_centrado {
  display: flex;
  justify-content: center;
}

.Oswald { font-family: 'Oswald', sans-serif; }
</style>