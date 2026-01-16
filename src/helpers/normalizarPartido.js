// ============================================================
// Helper global para normalizar claves de partidos políticos
// ============================================================

/**
 * Normaliza una clave de partido para que coincida entre
 * Candidatos, Provincias, Cantones y Parroquias.
 *
 * Ejemplos:
 *  - "MUPP-NP-18"  -> "MUPPNP18"
 *  - "MUPP-NP18"   -> "MUPPNP18"
 *  - "mupp_np_18" -> "MUPPNP18"
 */
export const normalizarPartido = (key = '') => {
  return String(key)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
};
