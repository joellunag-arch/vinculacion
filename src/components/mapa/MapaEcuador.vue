<template>
  <div class="map-container" style="position: relative; width: 100%; height: 500px;">
    <div class="mapa" ref="mapa" style="width: 100%; height: 100%;"></div>

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
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

am4core.useTheme(am4themes_animated);

export default {
  name: "MapaEcuador",

  props: {
    geoProvincias: { type: Object, required: true },
    geoCantones: { type: Object, required: false, default: () => ({}) },
    geoParroquias: { type: Object, required: false, default: () => ({}) },

    resultadosProvincias: { type: Array, default: () => [] },
    resultadosCantones: { type: Array, default: () => [] },
    resultadosParroquias: { type: Array, default: () => [] },
    datosDescarga: { type: Array, default: () => [] },

    colores: { type: Object, default: () => ({}) },

    id_1: {
      type: Array,
      default: () => ["", "", 0, 0],
    },
    nvuelta: String,
  },
  data() {
    return {
      currentLevel: "PAIS",
      datosExportacionProcesados: []
    };
  },
  created() {
    this.chart = null;
    this.paisSeries = null;
    this.provinciaSeries = null;
    this.cantonSeries = null;
  },
  mounted() {
    this.initMap();
    this.updateMapData();
  },

  watch: {
    id_1: {
      handler() {
        this.handleExternalFilter();
      },
      deep: true,
    },
    resultadosProvincias: {
      handler() { this.updateMapData(); }, deep: true
    },
    colores: {
      handler() { this.updateMapData(); }, deep: true
    },
    datosDescarga: {
      handler(nuevosDatos) {
        this.actualizarDatosExportacion(nuevosDatos);
      },
      deep: true,
      immediate: true
    }
  },

  unmounted() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  methods: {
    normalizeId(id) {
      return String(id).replace(/^0+/, "");
    },

    fixGeoJsonIds(geoData) {
      if (geoData && geoData.features) {
        geoData.features.forEach((f) => {
          if (f.properties) {
            const rawId = f.properties.id || f.properties.CODPRO || f.properties.CODCAN || f.properties.CODPAR;
            if (rawId) {
              f.id = this.normalizeId(rawId);
            }
          }
        });
      }
    },
    getDataForLevel(level, parentId = null) {
      let dataArray = [];
      let idField = "";
      let nameField = "";

      const [vuelta, partidoFilter, idProv, idCan] = this.id_1;

      if (level === "PAIS") {
        dataArray = this.resultadosProvincias;
        idField = "CODPRO";
        nameField = "PROVINCIA";
      } else if (level === "PROVINCIA") {
        dataArray = this.resultadosCantones.filter(d => this.normalizeId(d.CODPRO) === this.normalizeId(parentId));
        idField = "CODCAN";
        nameField = "CANTON";
      } else if (level === "CANTON") {
        dataArray = this.resultadosParroquias.filter(d => this.normalizeId(d.CODCAN) === this.normalizeId(parentId));
        idField = "CODPAR";
        nameField = "PARROQUIA";
      }

      if (!dataArray) return [];

      return dataArray.map((item) => {
        let fill = "#cccccc";
        let winnerName = item.ganador || "Desconocido";
        let winnerCandidate = "";
        let winnerVotes = 0;
        let winnerPercent = 0;

        if (partidoFilter && item.resultados && item.resultados[partidoFilter]) {
          const partyData = item.resultados[partidoFilter];
          winnerName = partidoFilter;
          winnerCandidate = partyData.candidato;
          winnerVotes = partyData.votos;
          winnerPercent = partyData.porcentaje;

          const baseColor = this.colores[partidoFilter] ? this.colores[partidoFilter].principal : "#666666";
          fill = baseColor;
        } else {
          if (item.resultados && item.resultados[winnerName]) {
            const winnerInfo = item.resultados[winnerName];
            winnerCandidate = winnerInfo.candidato;
            winnerVotes = winnerInfo.votos;
            winnerPercent = winnerInfo.porcentaje;
          }
          const colorInfo = this.colores[winnerName] || { principal: "#cccccc" };
          fill = colorInfo.principal;
        }

        return {
          id: this.normalizeId(item[idField]),
          fill: fill,
          winnerName: winnerName,
          winnerCandidate: winnerCandidate,
          winnerVotes: winnerVotes,
          winnerPercent: winnerPercent,
          name: item[nameField],
          ...item
        };
      });
    },

    initMap() {
      this.fixGeoJsonIds(this.geoProvincias);
      this.fixGeoJsonIds(this.geoProvincias);
      if (this.geoCantones && this.geoCantones.features) this.fixGeoJsonIds(this.geoCantones);
      if (this.geoParroquias && this.geoParroquias.features) this.fixGeoJsonIds(this.geoParroquias);

      let chart = am4core.create(this.$refs.mapa, am4maps.MapChart);
      chart.projection = new am4maps.projections.Miller();
      chart.zoomControl = new am4maps.ZoomControl();

        
      this.actualizarDatosExportacion(this.datosDescarga);

      let pais = chart.series.push(new am4maps.MapPolygonSeries());
      pais.geodata = this.geoProvincias;
      pais.useGeodata = true;
      pais.reverseGeodata = true;
      this.paisSeries = pais;

      let paisPolygon = pais.mapPolygons.template;
      paisPolygon.fill = am4core.color("#D9D9D9");
      paisPolygon.stroke = am4core.color("#000000");
      paisPolygon.strokeWidth = 0.5;
      paisPolygon.nonScalingStroke = true;
      paisPolygon.propertyFields.fill = "fill";

      paisPolygon.tooltipText = `[bold]{PROVINCIA}[/]
Ganador: {winnerName}
Candidato: {winnerCandidate}
Votos: {winnerVotes} ({winnerPercent}%)`;

      let hs = paisPolygon.states.create("hover");
      hs.properties.stroke = am4core.color("#000000");
      hs.properties.strokeWidth = 1;

      let provincia = chart.series.push(new am4maps.MapPolygonSeries());
      provincia.useGeodata = true;
      provincia.reverseGeodata = true;
      provincia.hidden = true;
      this.provinciaSeries = provincia;

      let provinciaPolygon = provincia.mapPolygons.template;
      provinciaPolygon.fill = am4core.color("#D9D9D9");
      provinciaPolygon.stroke = am4core.color("#000000");
      provinciaPolygon.strokeWidth = 0.5;
      provinciaPolygon.propertyFields.fill = "fill";

      provinciaPolygon.tooltipText = `[bold]{CANTON}[/]
Ganador: {winnerName}
Candidato: {winnerCandidate}
Votos: {winnerVotes} ({winnerPercent}%)`;

      let hs2 = provinciaPolygon.states.create("hover");
      hs2.properties.stroke = am4core.color("#000000");
      hs2.properties.strokeWidth = 1;

      let canton = chart.series.push(new am4maps.MapPolygonSeries());
      canton.useGeodata = true;
      canton.reverseGeodata = true;
      canton.hidden = true;
      this.cantonSeries = canton;

      let cantonPolygon = canton.mapPolygons.template;
      cantonPolygon.fill = am4core.color("#D9D9D9");
      cantonPolygon.stroke = am4core.color("#000000");
      cantonPolygon.strokeWidth = 0.5;
      cantonPolygon.propertyFields.fill = "fill";

      cantonPolygon.tooltipText = `[bold]{PARROQUIA}[/]
Ganador: {winnerName}
Candidato: {winnerCandidate}
Votos: {winnerVotes} ({winnerPercent}%)`;

      let hs3 = cantonPolygon.states.create("hover");
      hs3.properties.stroke = am4core.color("#000000");
      hs3.properties.strokeWidth = 1;

      paisPolygon.events.on("hit", (ev) => {
        ev.target.series.chart.zoomToMapObject(ev.target);
        this.drillDownToProvince(ev.target.dataItem.dataContext);
      });
      provinciaPolygon.events.on("hit", (ev) => {
        ev.target.series.chart.zoomToMapObject(ev.target);
        this.drillDownToCanton(ev.target.dataItem.dataContext);
      });

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

      provincia.geodataSource.events.on("done", () => {
        pais.hide();
        provincia.show();
      });
      canton.geodataSource.events.on("done", () => {
        provincia.hide();
        canton.show();
      });

      chart.events.on("zoomlevelchanged", () => {
        if (this.currentLevel === "CANTON" && chart.zoomLevel < 3.5) {
          this.goBack();
        }
        else if (this.currentLevel === "PROVINCIA" && chart.zoomLevel < 1.25) {
          this.goBack();
        }
      });

      this.chart = chart;
    },

    updateMapData() {
      if (!this.chart) return;
      this.paisSeries.data = this.getDataForLevel("PAIS");
    },

    handleExternalFilter() {
      const [vuelta, partido, idProv, idCan] = this.id_1;

      if (idProv && idCan) {
        this.resetMapToHome();
        
        const provPolygon = this.paisSeries.getPolygonById(this.normalizeId(idProv));
        if (provPolygon) {
          this.chart.zoomToMapObject(provPolygon);
          this.drillDownToProvince(provPolygon.dataItem.dataContext);
          
          setTimeout(() => {
            const canPolygon = this.provinciaSeries.getPolygonById(this.normalizeId(idCan));
            if (canPolygon) {
              this.chart.zoomToMapObject(canPolygon);
              this.drillDownToCanton(canPolygon.dataItem.dataContext);
            }
          }, 1000); 
        }
      } else if (idProv) {
        this.resetMapToHome();
        const polygon = this.paisSeries.getPolygonById(this.normalizeId(idProv));
        if (polygon) {
          this.chart.zoomToMapObject(polygon);
          this.drillDownToProvince(polygon.dataItem.dataContext);
        }
      } else {
        if (this.currentLevel === "PAIS") {
          this.updateMapData();
        } else {
          this.resetMapToHome();
        }
      }
    },

    resetMapToHome() {
      if (!this.chart) return;
      this.chart.goHome();
      this.currentLevel = "PAIS";
      this.provinciaSeries.hide();
      this.cantonSeries.hide();
      this.paisSeries.show();
    },

    goBack() {
      if (!this.chart) return;

      if (this.cantonSeries.visible) {
        this.cantonSeries.hide();
        this.cantonSeries.geodata = { type: "FeatureCollection", features: [] };
        this.provinciaSeries.show();
        this.currentLevel = "PROVINCIA";
        return;
      }

      if (this.provinciaSeries.visible) {
        this.resetMapToHome();
        return;
      }

      this.chart.goHome();
    },

    drillDownToProvince(dataContext) {
      try {
        let id = dataContext.id || dataContext.CODPRO;
        
        if (!this.geoCantones || !this.geoCantones.features || this.geoCantones.features.length === 0) {
            console.warn("No geoCantones data available for drilldown.");
            return;
        }

        let features = this.geoCantones.features || [];
        let provinceCantones = features.filter((f) => {
          return this.normalizeId(f.properties.CODPRO) === this.normalizeId(id);
        });

        if (provinceCantones.length === 0) return;

        let freshFeatures = JSON.parse(JSON.stringify(provinceCantones));

        this.provinciaSeries.geodata = {
          type: "FeatureCollection",
          crs: this.geoCantones.crs,
          features: freshFeatures,
        };

        this.provinciaSeries.data = this.getDataForLevel("PROVINCIA", id);
        this.provinciaSeries.validateData();

        this.paisSeries.hide();
        this.provinciaSeries.show();
        this.currentLevel = "PROVINCIA";
      } catch (error) {
        console.error(error);
      }
    },

    drillDownToCanton(dataContext) {
      try {
        let idCanton = dataContext.id || dataContext.CODCAN;

        if (!this.geoParroquias || !this.geoParroquias.features || this.geoParroquias.features.length === 0) {
             console.warn("No geoParroquias data available for drilldown.");
             return;
        }

        let features = this.geoParroquias.features || [];
        let cantonParroquias = features.filter((f) => {
          return this.normalizeId(f.properties.CODCAN) === this.normalizeId(idCanton);
        });

        if (cantonParroquias.length === 0) return;

        let freshFeatures = JSON.parse(JSON.stringify(cantonParroquias));

        this.cantonSeries.geodata = {
          type: "FeatureCollection",
          crs: this.geoParroquias.crs,
          features: freshFeatures,
        };

        this.cantonSeries.data = this.getDataForLevel("CANTON", idCanton);
        this.cantonSeries.validateData();

        this.provinciaSeries.hide();
        this.cantonSeries.show();
        this.currentLevel = "CANTON";
      } catch (error) {
        console.error(error);
      }
    },

    actualizarDatosExportacion(datos) {
      if (!this.chart || !this.chart.exporting) return;

      if (datos && Array.isArray(datos) && datos.length > 0) {
        try {
          const datosPlanos = this.flattenElectionData(datos);
          this.chart.exporting.data = datosPlanos;
          this.datosExportacionProcesados = datosPlanos;
        } catch (e) {
          console.error("MapaEcuador: Error flattening data", e);
          const raw = JSON.parse(JSON.stringify(datos));
          this.chart.exporting.data = raw;
          this.datosExportacionProcesados = raw;
        }
      }
    },

    flattenElectionData(data) {
      if (!data || !Array.isArray(data)) return [];
      
      const partidoFilter = this.id_1 && this.id_1.length > 1 ? this.id_1[1] : "";

      return data.map(item => {
        let locationName = item.name || item.PARROQUIA || item.CANTON || item.PROVINCIA || "Desconocido";
        
        let totalVotes = item.votos_total || item.votos_validos || 0;
        
        if (!totalVotes && item.resultados) {
           if (item.resultados.VOTOS && item.resultados.VOTOS.votos) {
               totalVotes = item.resultados.VOTOS.votos;
           } else {
               totalVotes = Object.values(item.resultados).reduce((sum, current) => {
                   if (current && typeof current.votos === 'number' && current.candidato !== "VALIDOS") {
                       return sum + current.votos;
                   }
                   return sum;
               }, 0);
           }
        }

        const flatItem = {
          "Ubicación": locationName,
          "Total de Votos": totalVotes
        };

        if (item.resultados) {
          if (partidoFilter && item.resultados[partidoFilter]) {
              const pData = item.resultados[partidoFilter];
              flatItem["Partido"] = partidoFilter;
              flatItem["Candidato"] = pData.candidato;
              flatItem["Votos"] = pData.votos;
              flatItem["Porcentaje"] = pData.porcentaje + "%";
          } else {
              const validCandidates = Object.values(item.resultados).filter(c => c.candidato !== "VALIDOS");
              const sortedCandidates = validCandidates.sort((a, b) => b.votos - a.votos);
              
              if (sortedCandidates[0]) {
                flatItem["Candidato 1"] = sortedCandidates[0].candidato;
                flatItem["Votos Candidato 1"] = sortedCandidates[0].votos;
              } else {
                 flatItem["Candidato 1"] = "";
                 flatItem["Votos Candidato 1"] = 0;
              }

              if (sortedCandidates[1]) {
                flatItem["Candidato 2"] = sortedCandidates[1].candidato;
                flatItem["Votos Candidato 2"] = sortedCandidates[1].votos;
              } else {
                 flatItem["Candidato 2"] = "";
                 flatItem["Votos Candidato 2"] = 0;
              }
          }
        } else {
           if (partidoFilter) {
              flatItem["Partido"] = partidoFilter;
              flatItem["Candidato"] = "";
              flatItem["Votos"] = 0;
              flatItem["Porcentaje"] = "0%";
           } else {
              flatItem["Candidato 1"] = "";
              flatItem["Votos Candidato 1"] = 0;
              flatItem["Candidato 2"] = "";
              flatItem["Votos Candidato 2"] = 0;
           }
        }
        return flatItem;
      });
    },

    getDatosParaDescarga() {
      let sourceData = [];

      if (this.currentLevel === "PAIS" && this.paisSeries) {
        sourceData = this.paisSeries.data;
      } else if (this.currentLevel === "PROVINCIA" && this.provinciaSeries) {
        sourceData = this.provinciaSeries.data;
      } else if (this.currentLevel === "CANTON" && this.cantonSeries) {
        sourceData = this.cantonSeries.data;
      }

      if (!sourceData || sourceData.length === 0) {
          console.warn("No active series data found for level " + this.currentLevel + ". Using fallback.");
          return this.datosExportacionProcesados || this.flattenElectionData(this.datosDescarga) || [];
      }
      
      return this.flattenElectionData(sourceData);
    },

    descargarJSON() {
      try {
        let datos = this.getDatosParaDescarga();
        console.log("Datos para descarga:", datos);

        if (!datos || datos.length === 0) {
          datos = this.flattenElectionData(this.datosDescarga);
           if (!datos || datos.length === 0) {
             alert("No hay datos para exportar.");
             return;
           }
        }
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json;charset=utf-8" });
        saveAs(blob, "Ecuador_Resultados.json");
      } catch (e) {
        console.error("Error en descargarJSON: ", e);
        alert("Error al descargar JSON");
      }
    },

    descargarXLSX() {
      try {
        let datos = this.getDatosParaDescarga();
        if (!datos || datos.length === 0) {
           datos = this.flattenElectionData(this.datosDescarga);
           if (!datos || datos.length === 0) {
             alert("No hay datos para exportar.");
             return;
           }
        }

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");
        
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Ecuador_Resultados.xlsx");
      } catch (e) {
         console.error("Error en descargarXLSX: ", e);
         alert("Error al descargar XLSX");
      }
    },

    descargarHTML() {
       try {
         let datos = this.getDatosParaDescarga();
         if (!datos || datos.length === 0) {
            datos = this.flattenElectionData(this.datosDescarga);
            if (!datos || datos.length === 0) {
              alert("No hay datos para exportar.");
              return;
            }
         }

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
         saveAs(blob, "Ecuador_Resultados.html");
       } catch (e) {
          console.error("Error en descargarHTML: ", e);
          alert("Error al descargar HTML");
       }
    },

    descargarPDF() {
      try {
        let datos = this.getDatosParaDescarga();
        if (!datos || datos.length === 0) {
            datos = this.flattenElectionData(this.datosDescarga);
            if (!datos || datos.length === 0) {
              alert("No hay datos para exportar.");
              return;
            }
        }

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
        
        doc.save("Ecuador_Resultados.pdf");

      } catch (e) {
         console.error("Error en descargarPDF: ", e);
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
    }

  },
};
</script>

<style scoped>
.mapa {
  width: 100%;
  height: 500px;
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