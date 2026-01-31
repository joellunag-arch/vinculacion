<template>
  <div class="tarjeta-layout mx-auto">
    <div
      class="header-select noselect shadow-header rounded"
      @click="toggleDropdown"
      ref="triggerRef"
    >
      <div class="d-flex justify-content-between align-items-center h-100">
        <div class="d-flex flex-column">
          <span class="label-select">Partido Político</span>
          <span class="value-select text-truncate">{{ seleccionado }}</span>
        </div>
        <span class="arrow-icon" :class="{ rotated: isOpen }">▼</span>
      </div>

      <transition name="fade">
        <ul v-if="isOpen" class="custom-dropdown-list shadow-lg">
          <li
            v-for="(opcion, index) in listaOpciones"
            :key="index"
            @click.stop="seleccionarOpcion(opcion)"
            class="dropdown-item-custom"
            :class="{ selected: opcion === seleccionado }"
          >
            {{ opcion }}
          </li>
        </ul>
      </transition>
    </div>

    <div class="cuerpo-transparente">
      <div
        v-if="seleccionado === 'Resultados Generales'"
        class="lista-contenido-scroll"
      >
        <table class="table-general">
          <tbody>
            <tr v-for="item in itemsCandidato" :key="item.partido">
              <td style="width: 30px">
                <div
                  class="color-square shadow-sm"
                  :style="{ background: item.color }"
                ></div>
              </td>
              <td>
                <span class="texto-oswald-general">{{
                  item.nombrePartido
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else-if="candidatoActual"
        class="detalle-candidato text-center fade-in pt-4"
      >
        <div class="mb-4">
          <div class="marco-foto mx-auto mb-2">
            <AsyncImage
              :resolver="candidatoActual.url"
              :alt="candidatoActual.nombre"
              imgClass="img-fluid w-100 h-100 object-fit-cover"
            />
          </div>
          <h4 class="nombre-oswald-titulo text-dark">
            {{ candidatoActual.nombre }}
          </h4>
          <p class="partido-oswald-sub">{{ candidatoActual.nombrePartido }}</p>
        </div>

        <div class="leyenda-container d-flex justify-content-center">
          <table class="table-legend mx-auto" style="width: auto">
            <tbody>
              <tr v-for="(rango, index) in itemsLeyenda" :key="index">
                <td
                  style="
                    width: 40px;
                    vertical-align: middle;
                    padding-right: 15px;
                  "
                >
                  <div
                    class="color-square shadow-sm"
                    :style="{
                      background: rango['p' + candidatoActual.partido],
                    }"
                  ></div>
                </td>
                <td
                  class="texto-oswald small text-start"
                  style="vertical-align: middle"
                >
                  {{ rango.porcentaje }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsyncImage from "@/components/global/AsyncImage.vue";

export default {
  name: "TarjetaCandidato",
  components: { AsyncImage },
  props: {
    itemsCandidato: {
      type: Array,
      required: true,
      default: () => [],
    },
    itemsLeyenda: {
      type: Array,
      required: true,
      default: () => [],
    },
    etiquetaTarjeta2: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      seleccionado: "Resultados Generales",
      isOpen: false,
    };
  },
  watch: {
    etiquetaTarjeta2(nuevoValor) {
      if (nuevoValor && nuevoValor !== "") {
        this.seleccionado = nuevoValor;
      } else {
        this.seleccionado = "Resultados Generales";
      }
    },
  },
  computed: {
    listaOpciones() {
      const nombres = this.itemsCandidato.map((c) => c.nombrePartido);
      return ["Resultados Generales", ...nombres];
    },
    candidatoActual() {
      if (this.seleccionado === "Resultados Generales") return null;
      return this.itemsCandidato.find(
        (c) => c.nombrePartido === this.seleccionado
      );
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    seleccionarOpcion(opcion) {
      this.seleccionado = opcion;
      this.isOpen = false;
      this.$emit("cambio-partido", opcion);
    },
    cerrarAlClickFuera(e) {
      if (this.$refs.triggerRef && !this.$refs.triggerRef.contains(e.target)) {
        this.isOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.cerrarAlClickFuera);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.cerrarAlClickFuera);
  },
};
</script>

<style scoped>
/* =============================
   CONTENEDOR PRINCIPAL
============================= */
.tarjeta-layout {
  width: 100%;
  max-width: 450px;
  position: relative;
  isolation: isolate;
}

/* =============================
   HEADER (más compacto)
============================= */
.header-select {
  background-color: var(--color-secondary);
  color: white;
  padding: 8px 14px;          /* ⬅️ reducido */
  cursor: pointer;
  position: relative;
  height: 56px;               /* ⬅️ reducido */
  border-radius: 4px;
  transition: background-color 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.header-select:hover {
  background-color: #0e8fae;
}

.label-select {
  font-size: 0.7rem;          /* ⬅️ reducido */
  opacity: 0.8;
}

.value-select {
  font-size: 1rem;            /* ⬅️ reducido */
  font-weight: 500;
}

.arrow-icon {
  font-size: 0.75rem;
  transition: transform 0.3s;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

/* =============================
   DROPDOWN (máx 6–7 items)
============================= */
.custom-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  padding: 0;
  margin: 4px 0 0;
  list-style: none;
  z-index: 1000;
  border-radius: 4px;
  max-height: 240px;          /* ⬅️ CLAVE */
  overflow-y: auto;
}

.dropdown-item-custom {
  padding: 10px 14px;         /* ⬅️ reducido */
  font-size: 0.85rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  text-transform: uppercase;
}

.dropdown-item-custom:hover {
  background-color: var(--bg-soft);
}

.dropdown-item-custom.selected {
  background-color: var(--bg-soft);
  color: var(--color-secondary);
  font-weight: 500;
}

/* =============================
   CUERPO
============================= */
.cuerpo-transparente {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0;
  position: relative;
}

/* =============================
   LISTA CON SCROLL REAL
============================= */
.lista-contenido-scroll {
  max-height: 260px;          /* ⬅️ 6–8 filas */
  overflow-y: auto;
  padding: 4px 0;
}

/* =============================
   TABLA (NO empuja contenedor)
============================= */
.table-general {
  width: 100%;
  border-collapse: collapse;  /* ⬅️ MUY IMPORTANTE */
}

.table-general tr {
  height: 36px;               /* ⬅️ altura fija */
}

.table-general td {
  padding: 6px 8px;           /* ⬅️ reducido */
  vertical-align: middle;
}
.table-general td + td {
  padding-left: 30px;        /* 👈 espacio entre el color y el nombre */
}

.texto-oswald-general {
  font-size: 0.85rem;         /* ⬅️ reducido */
  text-transform: uppercase;
}

/* =============================
   ELEMENTOS COMUNES
============================= */
.color-square {
  width: 18px;                /* ⬅️ reducido */
  height: 18px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.marco-foto {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
}

.nombre-oswald-titulo {
  font-size: 1.4rem;
}

.partido-oswald-sub {
  font-size: 0.85rem;
}

/* =============================
   SCROLLBAR
============================= */
.lista-contenido-scroll::-webkit-scrollbar {
  width: 6px;
}

.lista-contenido-scroll::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 3px;
}

.lista-contenido-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* =============================
   TRANSICIONES
============================= */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* =============================
   RESPONSIVE RULES
============================== */
@media (max-width: 992px) {
  .tarjeta-layout {
    max-width: 360px;
  }

  .header-select {
    padding: 6px 12px;
    height: 50px;
  }

  .label-select { font-size: 0.65rem; }
  .value-select { font-size: 0.95rem; }

  .marco-foto { width: 100px; height: 100px; }
  .nombre-oswald-titulo { font-size: 1.25rem; }
  .partido-oswald-sub { font-size: 0.8rem; }

  .lista-contenido-scroll { max-height: 220px; }
  .table-general tr { height: 32px; }
  .color-square { width: 16px; height: 16px; }
}

@media (max-width: 768px) {
  .tarjeta-layout {
    max-width: calc(100% - 24px);
    margin: 0 auto;
  }

  .header-select {
    padding: 8px 10px;
    height: 48px;
  }

  .label-select { font-size: 0.62rem; }
  .value-select { font-size: 0.9rem; }

  .marco-foto { width: 80px; height: 80px; }
  .nombre-oswald-titulo { font-size: 1.05rem; }
  .partido-oswald-sub { font-size: 0.78rem; }

  .lista-contenido-scroll { max-height: 160px; }
  .table-general tr { height: 28px; }
  .table-general td { padding: 5px 6px; }
  .table-general td + td { padding-left: 18px; }

  .custom-dropdown-list { max-height: 180px; }

  .marco-foto { border-radius: 50%; }
}

@media (max-width: 420px) {
  .tarjeta-layout { max-width: calc(100% - 16px); }
  .marco-foto { width: 68px; height: 68px; }
  .nombre-oswald-titulo { font-size: 1rem; }
  .value-select { font-size: 0.85rem; }
}
</style>
