<template>
  <div class="contenedor-tabla-componente">
    <!-- Título con fondo turquesa -->
    <div class="d-flex justify-content-center mb-4 mt-2">
      <div class="titulo-container shadow-sm">
        <h1 class="titulo-general text-white m-0 py-2 px-5">{{ titulo }}</h1>
      </div>
    </div>

    <!-- boton de descarga -->
    <div class="text-start mb-3 px-3">
      <button
        v-if="datos.length > 0"
        @click="descargarExcel"
        class="btn-barra-descarga d-inline-flex align-items-center shadow-sm"
        style="min-width: 250px; max-width: 45%; border: none; cursor: pointer"
        title="Clic para descargar"
      >
        <span class="texto-barra text-truncate me-2 flex-grow-1">
          Descargar Reporte Actual
        </span>
        <span class="icono-descarga ms-auto">
          <i class="bi bi-download"></i>
        </span>
      </button>
    </div>

    <!-- Tabla con estilos específicos -->
    <div class="tabla-wrapper table-responsive px-3">
      <table class="table table-custom mb-0">
        <thead>
          <tr>
            <th v-for="col in columnasConfiguradas" :key="col.key">
              {{ col.titulo }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, index) in datosPaginados"
            :key="fila.id || index"
            :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'"
          >
            <td v-for="col in columnasConfiguradas" :key="col.key">
              <template v-if="col.key === 'porcentaje'">
                <span class="fw-bold">{{ fila[col.key] }}%</span>
              </template>
              <template v-else-if="col.key === 'votos'">
                {{ Number(fila[col.key]).toLocaleString() }}
              </template>
              <template
                v-else-if="col.key === 'hombres' || col.key === 'mujeres'"
              >
                <!-- Mock data para visualización -->
                {{ Math.floor(Math.random() * (55 - 45 + 1) + 45) }}%
              </template>
              <template v-else>
                {{ formatearTitulo(fila[col.key]) }}
              </template>
            </td>
          </tr>

          <tr v-if="datos.length === 0">
            <td
              :colspan="columnasConfiguradas.length"
              class="text-center py-3 mensaje-vacio"
            >
              No hay datos disponibles para los filtros seleccionados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación CENTRADA -->
    <div class="footer-tabla container-fluid mt-3">
      <div class="row align-items-center justify-content-center">
        <div class="col-4 text-start ps-4">
          <span class="fuente-texto"><strong>Fuente:</strong> CNE</span>
        </div>
        <div class="col-4 d-flex justify-content-center">
          <!-- Botones centrados -->
          <div class="paginacion-numeros gap-2 d-flex">
            <button
              @click="cambiarPagina(paginaActual - 1)"
              :disabled="paginaActual === 1"
              class="btn-pag-nav"
            >
              ◀
            </button>
            <span class="btn-pag-numero active">{{ paginaActual }}</span>
            <button
              @click="cambiarPagina(paginaActual + 1)"
              :disabled="paginaActual === totalPaginas"
              class="btn-pag-nav"
            >
              ▶
            </button>
          </div>
        </div>
        <div class="col-4 text-end pe-4">
          <span class="total-texto">Total: {{ datos.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/EstilosGenerales.css";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export default {
  name: "TablaGenerica",

  props: {
    datos: {
      type: Array,
      required: true,
      default: () => [],
    },
    titulo: {
      type: String,
      default: "TABLAS DE RESULTADOS",
    },
    urlArchivoDescarga: {
      type: String,
      default: "#",
    },
    filtros: {
      type: Object,
      default: () => ({ provincia: "", canton: "", partido: "" }),
    },
    mostrarColumnasGenero: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      paginaActual: 1,
      itemsPorPagina: 8,
    };
  },

  watch: {
    datos() {
      this.paginaActual = 1;
    },
  },

  computed: {
    //  LÓGICA COMBINADA: Columnas dinámicas del segundo componente + opción de género
    columnasConfiguradas() {
      let tituloJurisdiccion = "Provincia";
      if (this.filtros.canton) tituloJurisdiccion = "Parroquia";
      else if (this.filtros.provincia) tituloJurisdiccion = "Cantón";

      const colJurisdiccion = { key: "nombre", titulo: tituloJurisdiccion };
      const colCandidato = { key: "candidato", titulo: "Candidato" };
      const colPorcentaje = { key: "porcentaje", titulo: "Porcentaje" };
      const colVotos = { key: "votos", titulo: "Votos" };

      const colPartido = {
        key: "partido",
        titulo: this.filtros.partido
          ? "Partido Seleccionado"
          : "Partido Político",
      };

      // Columnas de género (opcionales)
      const colHombres = { key: "hombres", titulo: "Hombres" };
      const colMujeres = { key: "mujeres", titulo: "Mujeres" };

      let columnas = [];

      //  Lógica dinámica según filtros
      if (this.filtros.partido) {
        // Si hay partido seleccionado, mostrarlo primero
        columnas = [
          colPartido,
          colCandidato,
          colVotos,
          colPorcentaje,
          colJurisdiccion,
        ];
      } else {
        // Vista normal
        columnas = [colJurisdiccion, colCandidato, colPartido, colPorcentaje];
      }

      //  Agregar columnas de género si está activado
      if (this.mostrarColumnasGenero) {
        columnas.push(colHombres, colMujeres);
      }

      return columnas;
    },

    datosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.datos.slice(inicio, fin);
    },

    totalPaginas() {
      return Math.ceil(this.datos.length / this.itemsPorPagina) || 1;
    },
  },

  methods: {
    //  Método del segundo componente para formatear títulos
    formatearTitulo(texto) {
      return texto ? String(texto).replace(/_/g, " ") : "";
    },

    cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPaginas) {
        this.paginaActual = page;
      }
    },

    descargarExcel() {
      try {
        if (!this.datos || this.datos.length === 0) {
          alert("No hay datos para exportar.");
          return;
        }

        // 1. Preparar datos usando las columnas configuradas
        const datosExportar = this.datos.map((fila) => {
          const nuevaFila = {};
          this.columnasConfiguradas.forEach((col) => {
            // Manejo especial para formatear valores
            let valor = fila[col.key];

            if (col.key === "porcentaje") {
              valor = valor + "%";
            } else if (col.key === "nombre") {
              valor = this.formatearTitulo(valor);
            }

            nuevaFila[col.titulo] = valor;
          });
          return nuevaFila;
        });

        // 2. Crear hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(datosExportar);

        // Ajustar ancho de columnas
        const colWidths = this.columnasConfiguradas.map(() => ({ wch: 20 }));
        ws["!cols"] = colWidths;

        // 3. Crear libro
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");

        // 4. Escribir archivo
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "Resultados.xlsx"
        );
      } catch (e) {
        console.error("Error al exportar Excel:", e);
        alert("Error al intentar descargar el archivo.");
      }
    },
  },
};
</script>

<style scoped>
/* ============================================================
   CONTENEDOR PRINCIPAL
============================================================ */
.contenedor-tabla-componente {
  font-family: var(--font-body);
  padding: 1rem 0;
}

/* ============================================================
   TÍTULO
============================================================ */
.titulo-container {
  background-color: var(--color-secondary);
  border-radius: 4px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.titulo-general {
  font-family: var(--font-titles);
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

/* ============================================================
   ✅ BOTÓN DE DESCARGA (del segundo componente)
============================================================ */
.btn-barra-descarga {
  background: var(--color-cyan);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-family: var(--font-titles);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-barra-descarga:hover {
  background: #0d8a9e; /* Un tono más oscuro para hover */
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(18, 162, 194, 0.3);
  color: white;
}

.texto-barra {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.icono-descarga {
  font-size: 1.2rem;
  margin-left: 8px;
}

/* ============================================================
   WRAPPER CON GLASSMORPHISM
============================================================ */
.tabla-wrapper {
  background: transparent !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: none;
  overflow-x: auto;
}

/* ============================================================
   TABLA
============================================================ */
.table-custom {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

/* ============================================================
   CABECERA
============================================================ */
.table-custom thead th {
  background: rgba(18, 162, 194, 0.3) !important;
  color: white;
  font-family: var(--font-titles);
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 10px;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ============================================================
   CUERPO DE TABLA
============================================================ */
.table-custom tbody tr {
  border-bottom: 2px solid rgba(255, 140, 160, 0.65);
  transition: background-color 0.25s ease;
}

.table-custom tbody tr:last-child {
  border-bottom: none;
}

.table-custom tbody td {
  vertical-align: middle;
  text-align: center;
  padding: 10px 12px;
  font-size: 0.9rem;
  background: transparent;
}

/* ============================================================
   FILAS ALTERNADAS
============================================================ */
.fila-impar td {
  background-color: rgba(224, 247, 250, 0.35) !important;
}

.fila-par td {
  background-color: rgba(255, 255, 255, 0.45) !important;
}

/* ============================================================
   HOVER
============================================================ */
.table-custom tbody tr:hover td {
  background-color: rgba(255, 182, 193, 0.25) !important;
  cursor: pointer;
}

/* Porcentaje en negrita */
.table-custom tbody td .fw-bold {
  color: var(--text-main);
  font-weight: 700;
}

/* Mensaje vacío */
.mensaje-vacio {
  color: var(--text-muted);
  font-style: italic;
}

/* ============================================================
   PAGINACIÓN
============================================================ */
.footer-tabla {
  margin-top: 1rem;
}

.fuente-texto,
.total-texto {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.btn-pag-nav {
  background: #ffcdd2;
  border: 1px solid #ef9a9a;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-pag-nav:hover:not(:disabled) {
  background: #ef9a9a;
  transform: translateY(-1px);
}

.btn-pag-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-pag-numero.active {
  background: #ffcdd2;
  border: 1px solid #ef9a9a;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 768px) {
  .titulo-general {
    font-size: 1rem;
    padding: 6px 14px !important;
  }

  .btn-barra-descarga {
    font-size: 0.78rem;
    padding: 6px 10px;
    min-width: 160px !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  .table-custom thead th,
  .table-custom tbody td {
    font-size: 0.68rem;
    padding: 6px 6px;
  }

  .btn-pag-nav,
  .btn-pag-numero.active {
    width: 26px;
    height: 26px;
    font-size: 0.72rem;
  }

  /* Allow horizontal scrolling on very small screens */
  .tabla-wrapper {
    -webkit-overflow-scrolling: touch;
    padding: 0.5rem;
  }
  .table-custom tbody td {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .titulo-general { font-size: 0.9rem; padding: 4px 10px !important; }
  .table-custom thead th, .table-custom tbody td { font-size: 0.64rem; padding: 5px 6px; }
  .btn-barra-descarga { font-size: 0.72rem; padding: 6px; }
  .tabla-wrapper { padding: 0.4rem; }
}
</style>
