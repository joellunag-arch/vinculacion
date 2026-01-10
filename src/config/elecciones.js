export const CONFIG_ELECCIONES = {
  NACIONALES: {
    "1998": { etapas: [1], habilitado: true },
    "1996": { etapas: [1, 2], habilitado: true }, // Deshabilitado hasta que tengan los JSON
    "2023": { etapas: [1, 2, 3], habilitado: true }
  },
  EXTRANJEROS: {
    "2009": { etapas: [1], habilitado: true },
    "2023": { etapas: [1, 2], habilitado: false }
  }
};

/**
 * Obtiene las etapas disponibles para un ámbito y año específico
 * @param {string} ambito - NACIONALES o EXTRANJEROS
 * @param {string} year - Año electoral
 * @returns {array} Array con las etapas disponibles [1], [1,2], [1,2,3], etc.
 */
export const obtenerEtapasDisponibles = (ambito, year) => {
  const config = CONFIG_ELECCIONES[ambito]?.[year];
  return config?.habilitado ? config.etapas : [];
};
