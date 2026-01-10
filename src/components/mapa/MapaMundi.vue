<template>
  <div class="map-container" style="position: relative; width: 100%; height: 500px;">
    <div class="contenedor-mapa-mundi" ref="chartdiv" style="width: 100%; height: 100%;"></div>
    
    <div style="position: absolute; top: 0px; right: 0px; z-index: 1000; padding: 10px;">
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            color="#d9d9d9"
            size="x-small"
            class="rounded-sm"
            elevation="1"
            v-bind="props"
            style="min-width: 30px; width: 30px; height: 30px; padding: 0;"
          >
             <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23546E7A' width='24px' height='24px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3C/svg%3E" alt="Exportar" style="width: 20px; height: 20px;" />
          </v-btn>
        </template>
        <v-list density="compact">
          
          <v-menu location="start" open-on-hover :close-on-content-click="true">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title>Imagen</v-list-item-title>
                <template v-slot:append>
                  <v-icon icon="mdi-chevron-right" size="small"></v-icon>
                </template>
              </v-list-item>
            </template>
            <v-list density="compact">
              <v-list-item @click="exportImage('png')" value="png">
                <v-list-item-title>PNG</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportImage('jpg')" value="jpg">
                <v-list-item-title>JPG</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportImage('svg')" value="svg">
                <v-list-item-title>SVG</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportImage('pdf')" value="pdf">
                <v-list-item-title>PDF</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu location="start" open-on-hover :close-on-content-click="true">
             <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title>Datos</v-list-item-title>
                <template v-slot:append>
                  <v-icon icon="mdi-chevron-right" size="small"></v-icon>
                </template>
              </v-list-item>
            </template>
            <v-list density="compact">
               <v-list-item @click="descargarJSON" value="json">
                <v-list-item-title>JSON</v-list-item-title>
              </v-list-item>
              <v-list-item @click="descargarXLSX" value="xlsx">
                 <v-list-item-title>XLSX</v-list-item-title>
              </v-list-item>
              <v-list-item @click="descargarHTML" value="html">
                 <v-list-item-title>HTML</v-list-item-title>
              </v-list-item>
              <v-list-item @click="descargarPDF" value="pdf">
                 <v-list-item-title>PDF</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-list-item @click="printMap" value="print">
            <v-list-item-title>Imprimir</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as XLSX from "xlsx";

import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

am4core.useTheme(am4themes_animated);

export default {
  name: "MapaMundi",

  props: {
    datos: { type: Array, default: () => [] },
    datosDescarga: { type: Array, default: () => [] },
    configuracion: {
      type: Object,
      default: () => ({
        colorDefecto: "#D9D9D9",
        colorBorde: "#000000",
        proyeccion: "Miller",
        exportar: true
      }),
    },
  },

  data() {
    return {
      chart: null,
      polygonSeries: null,
    };
  },

  mounted() {
    this.crearMapa();
  },

  beforeDestroy() {
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.dispose();
    }
  },

  watch: {
    datos: {
      handler(nuevosDatos) {
        if (this.polygonSeries) {
          this.polygonSeries.data = nuevosDatos;
        }
      },
      deep: true,
    },
    datosDescarga: {
      handler(nuevosDatos) {
        const hasData = Array.isArray(nuevosDatos) ? nuevosDatos.length > 0 : (nuevosDatos && Object.keys(nuevosDatos).length > 0);
        console.log("MapaMundi: datosDescarga changed, hasData:", hasData);
        this.actualizarDatosExportacion(nuevosDatos);
      },
      deep: true,
      immediate: true
    },
  },

  methods: {
    crearMapa() {
      const self = this;
      let chart = am4core.create(this.$refs.chartdiv, am4maps.MapChart);
      chart.geodata = am4geodata_worldLow;

      chart.projection =
        this.configuracion.proyeccion === "Miller"
          ? new am4maps.projections.Miller()
          : new am4maps.projections.Mercator();

      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;
      polygonSeries.exclude = ["AQ"];

      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}\n{tooltipPersonalizado}";

      polygonTemplate.fill = am4core.color(this.configuracion.colorDefecto);
      polygonTemplate.stroke = am4core.color(this.configuracion.colorBorde);
      polygonTemplate.strokeWidth = 0.5;

      polygonTemplate.propertyFields.fill = "colorHover";

      let hs = polygonTemplate.states.create("hover");
      hs.properties.stroke = am4core.color("#000000");
      hs.properties.strokeWidth = 1;

      polygonSeries.data = this.datos;
      this.polygonSeries = polygonSeries;

      chart.zoomControl = new am4maps.ZoomControl();
      chart.zoomControl.align = "right";
      chart.zoomControl.valign = "bottom";
      chart.zoomControl.marginRight = 10;
      chart.zoomControl.marginBottom = 10;

      let back = new am4core.Button();
      back.events.on("hit", () => {
        this.resetMapToHome();
      });
      back.icon = new am4core.Sprite();
      back.padding(7, 5, 7, 5);
      back.width = 30;
      back.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
      back.parent = chart.zoomControl;
      back.insertBefore(chart.zoomControl.plusButton);

      if (this.configuracion.exportar !== false) {



        chart.exporting.filePrefix = "mapa_export";
     
        this.actualizarDatosExportacion(this.datosDescarga);
      }
      this.chart = chart;
    },

    actualizarDatosExportacion(datos) {
      if (!this.chart || !this.chart.exporting) return;

      if (datos && Array.isArray(datos) && datos.length > 0) {
        try {
          const datosPlanos = this.flattenElectionData(datos);
          this.chart.exporting.data = datosPlanos;
          this.datosExportacionProcesados = datosPlanos;
          console.log("MapaMundi: Export data updated (Provincias Flattened), length: " + datosPlanos.length);
        } catch (e) {
          console.error("MapaMundi: Error flattening data", e);
          const raw = JSON.parse(JSON.stringify(datos));
          this.chart.exporting.data = raw;
          this.datosExportacionProcesados = raw;
        }
      }
    },

    getDatosParaDescarga() {
      return this.datosExportacionProcesados || this.datosDescarga || {};
    },

    flattenElectionData(data) {
      if (!data || !Array.isArray(data)) return [];
      
      return data.map(item => {
        try {
           let locationName = item.CANTON || item.PARROQUIA || item.name || "Desconocido";
        
           let winnerParty = item.ganador || "";
           let winnerCandidate = "";
           let winnerVotes = 0;

           if (item.resultados && winnerParty && item.resultados[winnerParty]) {
               const pData = item.resultados[winnerParty];
               if (pData) {
                   winnerCandidate = pData.candidato || "";
                   winnerVotes = pData.votos || 0;
               }
           } else if (item.resultados) {
               try {
                  const values = Object.values(item.resultados).filter(v => v.candidato !== "VALIDOS");
                   if (values.length > 0) {
                       const sorted = values.sort((a, b) => b.votos - a.votos);
                       if (sorted[0]) {
                           winnerParty = "N/A (Calculated)"; 
                           winnerCandidate = sorted[0].candidato;
                           winnerVotes = sorted[0].votos;
                       }
                   }
               } catch (innerE) {}
           }

           return {
             "PAIS": locationName,
             "Ganador": winnerParty,
             "Candidato": winnerCandidate,
             "Votos": winnerVotes
           };
        } catch (err) {
            console.warn("Error flattening item", item, err);
            return {
                "PAIS": "Error",
                "Ganador": "",
                "Candidato": "",
                "Votos": 0
            };
        }
      });
    },

    _extractTableData(source, key) {
        return [];
    },

    descargarJSON() {
      try {
        let datos = this.getDatosParaDescarga();
        
        if (datos && datos.length > 0 && (datos[0].CODCAN || datos[0].CODPRO)) {
            console.log("MapaMundi: Raw data detected in export, re-processing...");
            datos = this.flattenElectionData(this.datosDescarga);
        } else if (!datos || datos.length === 0) {
           datos = this.flattenElectionData(this.datosDescarga);
        }
        
        if (!datos || datos.length === 0) return;

        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json;charset=utf-8" });
        saveAs(blob, "Resultados_Electorales.json");
      } catch (e) {
        console.error("Error descargarJSON", e);
      }
    },

    descargarXLSX() {
      try {
        let datos = this.getDatosParaDescarga();
        
        if (datos && datos.length > 0 && (datos[0].CODCAN || datos[0].CODPRO)) {
            console.log("MapaMundi: Raw data detected in XLSX export, re-processing...");
            datos = this.flattenElectionData(this.datosDescarga);
        } else if (!datos || datos.length === 0) {
           datos = this.flattenElectionData(this.datosDescarga);
        }

        if (!datos || datos.length === 0) return;

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");
        
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Resultados_Electorales.xlsx");
      } catch (e) {
        console.error("Error descargarXLSX", e);
      }
    },

    descargarHTML() {
       try {
         let datos = this.getDatosParaDescarga();
         
         if (datos && datos.length > 0 && (datos[0].CODCAN || datos[0].CODPRO)) {
             datos = this.flattenElectionData(this.datosDescarga);
         } else if (!datos || datos.length === 0) {
           datos = this.flattenElectionData(this.datosDescarga);
         }
         
         if (!datos || datos.length === 0) return;

         let html = "<html><head><style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 5px; font-family: Arial; } th { background-color: #f2f2f2; }</style></head><body><h2>Resultados Electorales</h2><table>";
         
         const keys = Object.keys(datos[0]);
         html += "<thead><tr>";
         keys.forEach(k => html += `<th>${k}</th>`);
         html += "</tr></thead><tbody>";

         datos.forEach(row => {
           html += "<tr>";
           keys.forEach(k => html += `<td>${row[k] !== undefined && row[k] !== null ? row[k] : ""}</td>`);
           html += "</tr>";
         });

         html += "</tbody></table></body></html>";
         
         const blob = new Blob([html], { type: "text/html;charset=utf-8" });
         saveAs(blob, "Resultados_Electorales.html");
       } catch (e) {
          console.error("Error descargarHTML", e);
       }
    },

    descargarPDF() {
      try {
        let datos = this.getDatosParaDescarga();
        
        if (datos && datos.length > 0 && (datos[0].CODCAN || datos[0].CODPRO)) {
            datos = this.flattenElectionData(this.datosDescarga);
        } else if (!datos || datos.length === 0) {
            datos = this.flattenElectionData(this.datosDescarga);
        }

        if (!datos || datos.length === 0) return;

        const doc = new jsPDF();
        doc.text("Resultados Electorales", 14, 15);

        const tableColumn = Object.keys(datos[0]);
        const tableRows = [];

        datos.forEach(item => {
          const rowData = tableColumn.map(col => item[col]);
          tableRows.push(rowData);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });
        
        doc.save("Resultados_Electorales.pdf");
      } catch (e) {
         console.error("Error descargarPDF", e);
         alert("Error al descargar PDF: " + e.message);
      }
    },

    exportImage(type) {
      if (this.chart && this.chart.exporting) {
        this.chart.exporting.export(type);
      }
    },

    printMap() {
       if (this.chart && this.chart.exporting) {
         this.chart.exporting.export("print");
       }
    },

    resetMapToHome() {
      if (!this.chart) return;
      this.chart.goHome();
    },


  },
};
</script>

<style scoped>
.contenedor-mapa-mundi {
  width: 100%;
  height: 500px;
  background-color: transparent;
  position: relative;
}

::v-deep .amcharts-export-menu ul {
  background: #ffffff;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::v-deep .amcharts-export-menu li {
  padding: 8px 16px;
  cursor: pointer;
  color: #333;
}

::v-deep .amcharts-export-menu li:hover {
  background: #f5f5f5;
  color: #000;
}
</style>