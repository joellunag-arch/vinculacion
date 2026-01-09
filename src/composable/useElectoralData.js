import { ref, computed } from 'vue';
import { obtenerEtapasDisponibles } from '@/config/elecciones';

export function useElectoralData() {
  const provincias = ref([]);
  const resumenNacional = ref({});
  const loading = ref(false);
  const error = ref(null);

  /**
   * FUNCIÓN CONTROLADORA: Carga el JSON basado en la estructura del manual (pág. 12)
   */
  const cargarResultados = async (year, etapa) => {
    loading.value = true;
    error.value = null;

    try {
      let carpetaEtapa = '';
      let esPresidente = true;

      if (etapa === 1) carpetaEtapa = 'primera_vuelta';
      else if (etapa === 2) carpetaEtapa = 'segunda_vuelta';
      else {
        carpetaEtapa = 'asambleistas';
        esPresidente = false;
      }

      const pathBase = esPresidente ? 'presidentes/' : '';

      // 2. Importación dinámica (Acceso al MODELO)
      // Ruta: src/assets/data/[año]/informacion_electoral/[presidentes]/[etapa]/DatosProvincias.json
      const modulo = await import(`../assets/data/${year}/informacion_electoral/${pathBase}${carpetaEtapa}/DatosProvincias.json`);

      const data = modulo.default;

      // 3. Procesamiento de datos (Lógica de Negocio)
      provincias.value = data;

      resumenNacional.value = {
        total: data.reduce((acc, p) => acc + (p.votos_total || 0), 0),
        blancos: data.reduce((acc, p) => acc + (p.votos_blancos || 0), 0),
        nulos: data.reduce((acc, p) => acc + (p.votos_nulos || 0), 0),
      };

    } catch (err) {
      console.error("Error en el Controlador:", err);
      error.value = "No se encontraron datos para este periodo o etapa.";
      provincias.value = [];
      resumenNacional.value = {};
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtiene las etapas disponibles para un ámbito y año
   * @param {string} ambito - NACIONALES o EXTRANJEROS
   * @param {string} year - Año electoral
   * @returns {array} Array con las etapas disponibles
   */
  const obtenerEtapasDelAno = (ambito, year) => {
    return obtenerEtapasDisponibles(ambito, year);
  };

  return {
    provincias,
    resumenNacional,
    loading,
    error,
    cargarResultados,
    obtenerEtapasDelAno
  };
}
