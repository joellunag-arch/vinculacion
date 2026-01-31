<template>
  <div class="graficobarras_container">
    <div class="titulo-estatico">Gráfica Resultados {{ categoria }}</div>

    <div
      class="chart-scroll-wrapper"
      :class="{ modo_centrado: pocosCandidatos }"
    >
      <apexchart
        v-if="chartReady"
        :width="longitud"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      ></apexchart>

      <div v-else class="loading-container">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
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
    // Aquí pasamos el candidatosInfo que viene de useElectoralData ( por el momenot)
    candidatosExtraInfo: { type: Array, default: () => [] },
  },
  data() {
    return {
      pocosCandidatos: false,
      chartReady: false,
      longitud: "100%",
      chartHeight: "500px",
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          animations: { enabled: false },
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 8,
            columnWidth: "40%",
            dataLabels: { position: "top" },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val + "%",
          offsetY: -30,
          style: { fontSize: "16px", colors: ["#333"], fontWeight: "900" },
        },
        xaxis: {
          categories: [],
          labels: {
            rotate: -15,
            style: { fontSize: "12px", fontWeight: "bold" },
            offsetY: 60, // Espacio para que la foto no tape el nombre
          },
        },
        yaxis: { show: false },
        grid: {
          show: false,
          padding: { top: 50, bottom: 120 }, // Espacio para fotos y logos
        },
        legend: { show: false },
        annotations: { points: [] },
      },
    };
  },
  watch: {
    datos: { handler: "cargarYProcesarDatos", deep: true },
    candidatosExtraInfo: { handler: "cargarYProcesarDatos", deep: true },
  },
  mounted() {
    this.cargarYProcesarDatos();
    window.addEventListener("resize", this._handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this._handleResize);
  },
  methods: {
    // Convierte la URL de la imagen en un círculo con borde de color
    async envolverImagenEnCirculo(
      urlImagen,
      size = 120,
      colorBorde = "#ffffff"
    ) {
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
      this.longitud = this.pocosCandidatos
        ? "100%"
        : `${keysPartidos.length * 200}px`;

      const dataValues = [];
      const categoriesNames = [];
      const barColors = [];
      const annotationsPoints = [];

      // 3. Cruzar datos numéricos con info visual (CandidatosData)
      for (const key of keysPartidos) {
        const res = resultadosCalculados[key];

        // Buscar el candidato en la info extra por nombre o nombre de partido
        const info = this.candidatosExtraInfo.find(
          (c) =>
            c.nombrePartido === key ||
            c.keyNormalizada === key || // Match normalized key from helper
            c.nombre === res.candidato ||
            String(c.partido) === String(key)
        );

        const colorActual = info ? info.color : "#A0A0A0";
        let fotoUrl = info ? info.url : "";
        let logoUrl = info ? info.logo : "";

        // Resolver URLs si son funciones (lazy loading)
        if (typeof fotoUrl === "function") {
          try {
            fotoUrl = await fotoUrl();
          } catch (e) {
            fotoUrl = "";
          }
        }
        if (typeof logoUrl === "function") {
          try {
            logoUrl = await logoUrl();
          } catch (e) {
            logoUrl = "";
          }
        }

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
              offsetY: -60,
            },
          });
        }

        // --- ANOTACIÓN: FOTO CANDIDATO (Abajo) ---
        if (fotoUrl) {
          const circularFoto = await this.envolverImagenEnCirculo(
            fotoUrl,
            100,
            colorActual
          );
          annotationsPoints.push({
            x: res.candidato,
            y: 0,
            marker: { size: 0 },
            image: {
              path: circularFoto,
              width: 70,
              height: 70,
              offsetY: 60,
            },
          });
        }
      }

      // 4. Actualizar opciones del gráfico
      // Adjust sizes for small screens
      const w = window.innerWidth || 1024;
      const small = w <= 768;

      const xs = w <= 420;
      const adjustedAnnotations = annotationsPoints.map((a) => {
        // scale annotation images on small and xsmall screens
        if (a.image && a.image.width) {
          const scale = xs ? 0.45 : small ? 0.6 : 1;
          return {
            ...a,
            image: {
              ...a.image,
              width: Math.round((a.image.width || 50) * scale),
              height: Math.round((a.image.height || 50) * scale),
              offsetY: Math.round((a.image.offsetY || 0) * scale),
            },
          };
        }
        return a;
      });

      const adjustedXaxis = {
        ...this.chartOptions.xaxis,
        categories: categoriesNames,
        labels: {
          ...this.chartOptions.xaxis.labels,
          rotate: small ? -35 : this.chartOptions.xaxis.labels.rotate,
          style: {
            ...this.chartOptions.xaxis.labels.style,
            fontSize: small ? "10px" : this.chartOptions.xaxis.labels.style.fontSize,
          },
          offsetY: small ? 40 : this.chartOptions.xaxis.labels.offsetY,
        },
      };

      const adjustedDataLabels = {
        ...this.chartOptions.dataLabels,
        style: {
          ...this.chartOptions.dataLabels.style,
          fontSize: small ? "12px" : this.chartOptions.dataLabels.style.fontSize,
        },
        offsetY: small ? -20 : this.chartOptions.dataLabels.offsetY,
      };

      const adjustedPlotOptions = {
        ...this.chartOptions.plotOptions,
        bar: {
          ...this.chartOptions.plotOptions.bar,
          columnWidth: small ? "60%" : this.chartOptions.plotOptions.bar.columnWidth,
        },
      };

      this.chartOptions = {
        ...this.chartOptions,
        colors: barColors,
        xaxis: adjustedXaxis,
        annotations: { points: adjustedAnnotations },
        dataLabels: adjustedDataLabels,
        plotOptions: adjustedPlotOptions,
      };

      // adjust height for mobile and very small screens
      this.chartHeight = xs ? "260px" : small ? "320px" : "500px";

      this.series = [{ name: "Porcentaje Nacional", data: dataValues }];

      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        this.chartReady = true;
      }, 100);
    },

    _handleResize() {
      // Recompute chart responsiveness when screen resizes
      // If chart is already rendered, force reprocess to update sizes
      if (this.chartReady) {
        this.cargarYProcesarDatos();
      }
    },
  },
};
</script>

<style scoped>
.graficobarras_container {
  width:100% ;
  height: 100%  ;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

.titulo-estatico {
  background-color: var(--color-secondary);
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
  background: var(--color-secondary);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .graficobarras_container { padding: 12px; }
  .titulo-estatico { font-size: 18px; padding: 8px 20px; margin-bottom: 18px; }
  .chart-scroll-wrapper { padding-top: 12px; }
  .loading-container { height: 220px; }
}

@media (max-width: 420px) {
  .graficobarras_container { padding: 8px; }
  .titulo-estatico { font-size: 16px; padding: 6px 12px; margin-bottom: 12px; }
  .chart-scroll-wrapper { padding-top: 8px; }
  .loading-container { height: 180px; }
}
</style>
