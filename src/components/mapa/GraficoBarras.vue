<template>
  <div class="graficobarras_container">
    <div class="titulo-estatico">Gráfica Resultados {{ categoria }}</div>

    <div class="chart-scroll-wrapper" :class="{'modo_centrado': pocosCandidatos}">
      <apexchart
        v-if="chartReady"
        :width="longitud"
        height="550px"
        :options="chartOptions"
        :series="series"
      ></apexchart>

      <div v-else class="loading-container">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Procesando gráficos e imágenes...</p>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { obtenerTotalesPresidenteFachada } from "@/helpers/procesarVotosHelper";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    datos: { type: Array, required: true },
    categoria: { type: String, default: "presidentes" },
    // Aquí pasamos el candidatosInfo que viene de useElectoralData
    candidatosExtraInfo: { type: Array, default: () => [] }
  },
  data() {
    return {
      pocosCandidatos: false,
      chartReady: false,
      longitud: "100%",
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          animations: { enabled: false }
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 8,
            columnWidth: "40%",
            dataLabels: { position: "top" }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val + "%",
          offsetY: -30,
          style: { fontSize: "16px", colors: ["#333"], fontWeight: "900" }
        },
        xaxis: {
          categories: [],
          labels: {
            rotate: -15,
            style: { fontSize: "12px", fontWeight: "bold" },
            offsetY: 60 // Espacio para que la foto no tape el nombre
          }
        },
        yaxis: { show: false },
        grid: {
          show: false,
          padding: { top: 50, bottom: 120 } // Espacio para fotos y logos
        },
        legend: { show: false },
        annotations: { points: [] }
      }
    };
  },
  watch: {
    datos: { handler: "cargarYProcesarDatos", deep: true },
    candidatosExtraInfo: { handler: "cargarYProcesarDatos", deep: true }
  },
  mounted() {
    this.cargarYProcesarDatos();
  },
  methods: {
    // Convierte la URL de la imagen en un círculo con borde de color
    async envolverImagenEnCirculo(urlImagen, size = 120, colorBorde = "#ffffff") {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = urlImagen;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = size;
          canvas.height = size;
          const radius = size / 2;

          // Dibujar borde circular
          ctx.beginPath();
          ctx.arc(radius, radius, radius, 0, Math.PI * 2);
          ctx.fillStyle = colorBorde;
          ctx.fill();

          // Recorte para la foto
          ctx.save();
          ctx.beginPath();
          ctx.arc(radius, radius, radius - 6, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, 0, 0, size, size);
          ctx.restore();

          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(urlImagen);
      });
    },

    async cargarYProcesarDatos() {
      if (!this.datos || this.datos.length === 0) return;
      this.chartReady = false;

      // 1. Obtener totales del helper
      const resultadosCalculados = obtenerTotalesPresidenteFachada(this.datos);
      const keysPartidos = Object.keys(resultadosCalculados);

      // 2. Configurar dimensiones
      this.pocosCandidatos = keysPartidos.length <= 3;
      this.longitud = this.pocosCandidatos ? "100%" : `${keysPartidos.length * 200}px`;

      const dataValues = [];
      const categoriesNames = [];
      const barColors = [];
      const annotationsPoints = [];

      // 3. Cruzar datos numéricos con info visual (CandidatosData)
      for (const key of keysPartidos) {
        const res = resultadosCalculados[key];
        
        // Buscar el candidato en la info extra por nombre o nombre de partido
        const info = this.candidatosExtraInfo.find(c => 
           c.nombrePartido === key || 
           c.nombre === res.candidato ||
           String(c.partido) === String(key)
        );

        const colorActual = info ? info.color : "#A0A0A0";
        const fotoUrl = info ? info.url : "";
        const logoUrl = info ? info.logo : "";

        dataValues.push(res.porcentaje);
        categoriesNames.push(res.candidato);
        barColors.push(colorActual);

        // --- ANOTACIÓN: LOGO DEL PARTIDO (Arriba) ---
        if (logoUrl) {
          annotationsPoints.push({
            x: res.candidato,
            y: res.porcentaje,
            marker: { size: 0 },
            image: {
              path: logoUrl,
              width: 50,
              height: 50,
              offsetY: -60
            }
          });
        }

        // --- ANOTACIÓN: FOTO CANDIDATO (Abajo) ---
        if (fotoUrl) {
          const circularFoto = await this.envolverImagenEnCirculo(fotoUrl, 100, colorActual);
          annotationsPoints.push({
            x: res.candidato,
            y: 0,
            marker: { size: 0 },
            image: {
              path: circularFoto,
              width: 70,
              height: 70,
              offsetY: 60
            }
          });
        }
      }

      // 4. Actualizar opciones del gráfico
      this.chartOptions = {
        ...this.chartOptions,
        colors: barColors,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: categoriesNames
        },
        annotations: {
          points: annotationsPoints
        }
      };

      this.series = [{ name: "Porcentaje Nacional", data: dataValues }];
      
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => { this.chartReady = true; }, 100);
    }
  }
};
</script>

<style scoped>
.graficobarras_container {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

.titulo-estatico {
  background-color: #1ba7c9;
  color: white;
  font-size: 24px;
  font-weight: 700;
  padding: 10px 40px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 20px;
}

.modo_centrado {
  display: flex;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

/* Scrollbar personalizado */
.chart-scroll-wrapper::-webkit-scrollbar {
  height: 10px;
}
.chart-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #1ba7c9;
  border-radius: 10px;
}
</style>