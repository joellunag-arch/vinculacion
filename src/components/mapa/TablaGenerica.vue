<template>
  <div class="contenedor-tabla-componente">
    <!-- Título con fondo turquesa -->
    <div class="d-flex justify-content-center mb-4 mt-2">
      <div class="titulo-container shadow-sm">
        <h1 class="titulo-general text-white m-0 py-2 px-5">{{ titulo }}</h1>
      </div>
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
              <template
                v-else-if="col.key === 'hombres' || col.key === 'mujeres'"
              >
                <!-- Mock data para visualización -->
                {{ Math.floor(Math.random() * (55 - 45 + 1) + 45) }}%
              </template>
              <template v-else>
                {{ fila[col.key] }}
              </template>
            </td>
          </tr>

          <tr v-if="datos.length === 0">
            <td :colspan="columnasConfiguradas.length" class="text-center py-3">
              No hay datos disponibles para los filtros seleccionados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación CENTRADA -->
    <div class="footer-tabla container-fluid mt-3">
      <div class="row align-items-center justify-content-center">
        <div class="col-4 text-start ps-4 small text-muted">Fuente: CNE</div>
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
        <div class="col-4 text-end pe-4 small text-muted">
          Total: {{ datos.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/EstilosGenerales.css";

export default {
  name: "TablaGenerica",
  props: {
    datos: { type: Array, required: true, default: () => [] },
    titulo: { type: String, default: "TABLAS DE RESULTADOS" },
    filtros: {
      type: Object,
      default: () => ({ provincia: "", canton: "", partido: "" }),
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
    columnasConfiguradas() {
      // Definir columnas fijas según imagen de referencia
      return [
        { key: "nombre", titulo: this.getTituloJurisdiccion() },
        { key: "candidato", titulo: "Candidato" },
        { key: "partido", titulo: "Partido Político" },
        { key: "porcentaje", titulo: "Porcentaje" },
        { key: "hombres", titulo: "Hombres" }, // Mock
        { key: "mujeres", titulo: "Mujeres" }, // Mock
      ];
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
    getTituloJurisdiccion() {
      if (this.filtros.canton) return "Parroquia";
      if (this.filtros.provincia) return "Cantón";
      return "Provincia";
    },
    cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPaginas) {
        this.paginaActual = page;
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
   WRAPPER CON GLASSMORPHISM (AJUSTADO)
============================================================ */
.tabla-wrapper {
  background: transparent !important; /* Total transparency requested */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  border-radius: 12px;
  padding: 1rem;
  box-shadow: none;
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
  background: var(--color-secondary) !important; /* Solid Celeste #12a2c2 */

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
  border-bottom: 2px solid rgba(255, 140, 160, 0.65); /* 🔥 línea rosa */
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
   FILAS ALTERNADAS (AJUSTADAS)
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

/* Porcentaje */
.table-custom tbody td .fw-bold {
  color: var(--text-main);
  font-weight: 700;
}

/* ============================================================
   PAGINACIÓN
============================================================ */
.footer-tabla {
  margin-top: 1rem;
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

.text-muted {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* ============================================================
   RESPONSIVE
============================================================ */
@media (max-width: 768px) {
  .titulo-general {
    font-size: 1.2rem;
    padding: 8px 20px !important;
  }

  .table-custom thead th,
  .table-custom tbody td {
    font-size: 0.75rem;
    padding: 8px 6px;
  }

  .btn-pag-nav,
  .btn-pag-numero.active {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>
