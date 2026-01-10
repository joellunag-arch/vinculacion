<template>
  <div class="contenedor-tabla-componente">
    
    <!-- Título con fondo teal -->
    <div class="d-flex justify-content-center mb-4 mt-2">
      <div class="titulo-container shadow-sm">
        <h1 class="titulo-general text-white m-0 py-2 px-5">{{ titulo }}</h1>
      </div>
    </div>

    <!-- Botón descarga REMOVED as per user request -->

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
          <tr v-for="(fila, index) in datosPaginados" :key="fila.id || index" :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
            <td v-for="col in columnasConfiguradas" :key="col.key">
              <template v-if="col.key === 'porcentaje'">
                <span class="fw-bold">{{ fila[col.key] }}%</span>
              </template>
              <template v-else-if="col.key === 'hombres' || col.key === 'mujeres'">
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
        <div class="col-4 text-start ps-4 small text-muted">
          Fuente: CNE
        </div>
        <div class="col-4 d-flex justify-content-center">
            <!-- Botones centrados -->
          <div class="paginacion-numeros gap-2 d-flex">
            <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1"
              class="btn-pag-nav">◀</button>
            <span class="btn-pag-numero active">{{ paginaActual }}</span>
            <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
              class="btn-pag-nav">▶</button>
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
import "../styles/EstilosGenerales.css";

export default {
  name: 'TablaGenerica',
  props: {
    datos: { type: Array, required: true, default: () => [] },
    titulo: { type: String, default: "TABLAS DE RESULTADOS" },
    urlArchivoDescarga: { type: String, default: "#" },
    filtros: { type: Object, default: () => ({ provincia: '', canton: '', partido: '' }) }
  },
  data() {
    return {
      paginaActual: 1,
      itemsPorPagina: 8
    };
  },
  watch: {
    datos() { this.paginaActual = 1; }
  },
  computed: {
    columnasConfiguradas() {
      // Definir columnas fijas según imagen de referencia
      return [
        { key: 'nombre', titulo: this.getTituloJurisdiccion() },
        { key: 'candidato', titulo: 'Candidato' },
        { key: 'partido', titulo: 'Partido Político' },
        { key: 'porcentaje', titulo: 'Porcentaje' },
        { key: 'hombres', titulo: 'Hombres' }, // Mock
        { key: 'mujeres', titulo: 'Mujeres' }  // Mock
      ];
    },
    datosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.datos.slice(inicio, fin);
    },
    totalPaginas() {
      return Math.ceil(this.datos.length / this.itemsPorPagina);
    }
  },
  methods: {
    getTituloJurisdiccion() {
        if (this.filtros.canton) return 'Parroquia';
        if (this.filtros.provincia) return 'Cantón';
        return 'Provincia';
    },
    cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPaginas) {
        this.paginaActual = page;
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para igualar la referencia */
.titulo-container {
    background-color: #0097A7; /* Teal header color */
    border-radius: 4px;
    display: inline-block;
}
.titulo-general {
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
}

.table-custom thead th {
    background-color: #B2EBF2 !important; /* Light Teal header background */
    color: #000;
    font-weight: bold;
    border-bottom: 2px solid #0097A7;
    text-align: center;
    vertical-align: middle;
}

.table-custom tbody td {
    vertical-align: middle;
    text-align: center;
    border: 1px solid #E0F7FA;
    font-size: 0.9rem;
}

/* Filas alternadas */
.fila-impar {
    background-color: #E0F7FA; /* Light Teal row */
}
.fila-par {
    background-color: #FFFFFF; /* White row */
}

/* Botones paginación */
.btn-pag-nav {
    background: #FFCDD2; /* Light red buttons like reference */
    border: 1px solid #EF9A9A;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: #333;
}
.btn-pag-numero.active {
    background: #FFCDD2;
    border: 1px solid #EF9A9A;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}
</style>