<template>
    <div class="tarjeta-layout mx-auto">
        <div class="header-select noselect shadow-header rounded" @click="toggleDropdown" ref="triggerRef">
            <div class="d-flex justify-content-between align-items-center h-100">
                <div class="d-flex flex-column">
                    <span class="label-select">Partido Político</span>
                    <span class="value-select text-truncate">{{ seleccionado }}</span>
                </div>
                <span class="arrow-icon" :class="{ 'rotated': isOpen }">▼</span>
            </div>

            <transition name="fade">
                <ul v-if="isOpen" class="custom-dropdown-list shadow-lg">
                    <li v-for="(opcion, index) in listaOpciones" :key="index" @click.stop="seleccionarOpcion(opcion)"
                        class="dropdown-item-custom" :class="{ 'selected': opcion === seleccionado }">
                        {{ opcion }}
                    </li>
                </ul>
            </transition>
        </div>

        <div class="cuerpo-transparente">

            <div v-if="seleccionado === 'Resultados Generales'" class="lista-contenido-scroll">
                <table class="table-general">
                    <tbody>
                        <tr v-for="item in itemsCandidato" :key="item.partido">
                            <td style="width: 30px;">
                                <div class="color-square shadow-sm" :style="{ background: item.color }"></div>
                            </td>
                            <td>
                                <span class="texto-oswald-general">{{ item.nombrePartido }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else-if="candidatoActual" class="detalle-candidato text-center fade-in pt-4">
                <div class="mb-4">
                    <div class="marco-foto mx-auto mb-2">
                        <img :src="candidatoActual.url" :alt="candidatoActual.nombre"
                            class="img-fluid w-100 h-100 object-fit-cover">
                    </div>
                    <h4 class="nombre-oswald-titulo text-dark">{{ candidatoActual.nombre }}</h4>
                    <p class="partido-oswald-sub">{{ candidatoActual.nombrePartido }}</p>
                </div>

                <div class="leyenda-container d-flex justify-content-center">
                    <table class="table-legend mx-auto" style="width: auto;">
                        <tbody>
                            <tr v-for="(rango, index) in itemsLeyenda" :key="index">
                                <td style="width: 40px; vertical-align: middle; padding-right: 15px;">
                                    <div class="color-square shadow-sm"
                                        :style="{ background: rango['p' + candidatoActual.partido] }">
                                    </div>
                                </td>
                                <td class="texto-oswald small text-start" style="vertical-align: middle;">
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
export default {
    name: "TarjetaCandidato",
    props: {
        itemsCandidato: {
            type: Array,
            required: true,
            default: () => []
        },
        itemsLeyenda: {
            type: Array,
            required: true,
            default: () => []
        },
        etiquetaTarjeta2: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            seleccionado: 'Resultados Generales',
            isOpen: false,
        };
    },
    watch: {
        etiquetaTarjeta2(nuevoValor) {
            if (nuevoValor && nuevoValor !== "") {
                this.seleccionado = nuevoValor;
            } else {
                this.seleccionado = 'Resultados Generales';
            }
        }
    },
    computed: {
        listaOpciones() {
            const nombres = this.itemsCandidato.map(c => c.nombrePartido);
            return ['Resultados Generales', ...nombres];
        },
        candidatoActual() {
            if (this.seleccionado === 'Resultados Generales') return null;
            return this.itemsCandidato.find(c => c.nombrePartido === this.seleccionado);
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        seleccionarOpcion(opcion) {
            this.seleccionado = opcion;
            this.isOpen = false;
            this.$emit('cambio-partido', opcion);
        },
        cerrarAlClickFuera(e) {
            if (this.$refs.triggerRef && !this.$refs.triggerRef.contains(e.target)) {
                this.isOpen = false;
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.cerrarAlClickFuera);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.cerrarAlClickFuera);
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

/* NOTA: Se eliminó .fondo-pantalla */

.tarjeta-layout {
    width: 100%;
    max-width: 450px;
    position: relative;
    /* IMPORTANTE: isolation crea un nuevo contexto de apilamiento para que el mix-blend-mode funcione bien */
    isolation: isolate;
}

/* HEADER */
.header-select {
    background-color: #12A2C2;
    color: white;
    padding: 10px 16px;
    cursor: pointer;
    position: relative;
    height: 64px;
    border-radius: 4px;
    transition: background-color 0.2s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.header-select:hover {
    background-color: #0e8fae;
}

.label-select {
    font-family: 'Roboto', sans-serif;
    font-size: 0.75rem;
    opacity: 0.8;
    font-weight: 400;
    margin-bottom: 2px;
}

.value-select {
    font-family: 'Oswald', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.arrow-icon {
    font-size: 0.8rem;
    transition: transform 0.3s;
}

.arrow-icon.rotated {
    transform: rotate(180deg);
}

/* DROPDOWN */
.custom-dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    padding: 0;
    margin: 0;
    list-style: none;
    z-index: 1000;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 4px;
}

.dropdown-item-custom {
    padding: 12px 16px;
    color: #333;
    font-family: 'Oswald', sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    text-transform: uppercase;
}

.dropdown-item-custom:hover {
    background-color: #E0F7FA;
}

.dropdown-item-custom.selected {
    background-color: #E0F7FA;
    color: #12A2C2;
    font-weight: 500;
}

.cuerpo-transparente {
    background-color: #f0f0f0;
    mix-blend-mode: multiply;
    /* Fusión con el fondo */
    border-radius: 4px;
    padding: 0;
    margin-top: 0;
    position: relative;
    z-index: 1;
}

/* LISTA GENERAL */
.lista-contenido-scroll {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #BDBDBD transparent;
    padding: 40px 20px;
    /* Padding generoso */
}

.table-general {
    width: auto;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0 25px;
    /* Espaciado vertical aumentado */
}

.table-general td {
    padding: 0 12px;
    vertical-align: middle;
}

.texto-oswald-general {
    font-family: 'Oswald', sans-serif;
    font-size: 0.9rem;
    color: #111;
    /* Texto oscuro para contraste */
    text-transform: uppercase;
    font-weight: 500;
}

/* LEYENDA INDIVIDUAL */
.table-legend {
    border-collapse: collapse;
}

.table-legend td {
    padding: 8px 0;
}

.texto-oswald {
    font-family: 'Oswald', sans-serif;
    font-size: 1rem;
    color: #2c3e50;
    text-transform: uppercase;
    font-weight: 400;
}

/* ELEMENTOS COMUNES */
.color-square {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    mix-blend-mode: normal !important;
    /* IMPORTANTE: Para que el color sea sólido */
    opacity: 1 !important;
    position: relative;
    z-index: 2;
}

.marco-foto {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background: white;
}

.nombre-oswald-titulo {
    font-family: 'Oswald', sans-serif;
    color: #222;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.5rem;
    margin: 0;
}

.partido-oswald-sub {
    font-family: 'Oswald', sans-serif;
    color: #444;
    font-size: 0.9rem;
}

/* Scrollbars */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #BDBDBD;
    border-radius: 3px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

.noselect {
    user-select: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>