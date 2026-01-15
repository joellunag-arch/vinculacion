/**
 * Calcula el resumen estadístico nacional de resultados electorales.
 * @param {Array} DatosProvincias - Arreglo de objetos de provincias.
 * @returns {Object} Diccionario indexado por la clave del partido (ej: "ADN", "RC5").
 */
const obtenerTotalesPresidente = (DatosProvincias) => {
  if (!DatosProvincias || DatosProvincias.length === 0) return {};

  const acumuladoVotos = {};
  let totalVotosValidosNacional = 0;

  // 1. Recorrer provincias y sumarizar
  DatosProvincias.forEach((provincia) => {
    // Sumar al gran total nacional de votos válidos
    totalVotosValidosNacional += (provincia.votos_validos || 0);
    
    const resultados = provincia.resultados;
    for (const keyPartido in resultados) {
      // Ignorar campos que no son partidos políticos
      const camposIgnorar = ['VOTOS', 'BLANCOS', 'NULOS', 'AUSENTISMO', 'VALIDOS', 'totalVotos', 'votos_validos'];
      if (camposIgnorar.includes(keyPartido)) continue;

      if (!acumuladoVotos[keyPartido]) {
        acumuladoVotos[keyPartido] = {
          candidato: resultados[keyPartido].candidato,
          votosSuma: 0,
        };
      }
      acumuladoVotos[keyPartido].votosSuma += (resultados[keyPartido].votos || 0);
    }
  });

  // 2. Calcular porcentajes finales
  const totalesFinales = {};
  for (const keyPartido in acumuladoVotos) {
    const porcentaje = totalVotosValidosNacional > 0 
      ? (acumuladoVotos[keyPartido].votosSuma / totalVotosValidosNacional) * 100 
      : 0;

    totalesFinales[keyPartido] = {
      candidato: acumuladoVotos[keyPartido].candidato,
      porcentaje: Number(porcentaje.toFixed(2)),
      votos: acumuladoVotos[keyPartido].votosSuma
    };
  }

  return totalesFinales;
};

export const obtenerTotalesPresidenteFachada = (DatosProvincias) => {
  return obtenerTotalesPresidente(DatosProvincias);
};