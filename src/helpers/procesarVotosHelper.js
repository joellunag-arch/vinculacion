import { normalizarPartido } from '@/helpers/normalizarPartido';

/**
 * Calcula el resumen estadístico nacional de resultados electorales.
 * @param {Array} DatosProvincias - Arreglo de objetos de provincias.
 * @returns {Object} Diccionario indexado por la clave NORMALIZADA del partido
 */
const obtenerTotalesPresidente = (DatosProvincias) => {
  if (!DatosProvincias || DatosProvincias.length === 0) return {};

  const acumuladoVotos = {};
  let totalVotosValidosNacional = 0;

  DatosProvincias.forEach((provincia) => {
    totalVotosValidosNacional += (provincia.votos_validos || 0);

    const resultados = provincia.resultados || {};
    for (const keyPartido in resultados) {

      const camposIgnorar = [
        'VOTOS', 'BLANCOS', 'NULOS',
        'AUSENTISMO', 'VALIDOS',
        'totalVotos', 'votos_validos'
      ];
      if (camposIgnorar.includes(keyPartido)) continue;

      const keyNormalizada = normalizarPartido(keyPartido);

      if (!acumuladoVotos[keyNormalizada]) {
        acumuladoVotos[keyNormalizada] = {
          candidato: resultados[keyPartido].candidato,
          votosSuma: 0
        };
      }

      acumuladoVotos[keyNormalizada].votosSuma +=
        (resultados[keyPartido].votos || 0);
    }
  });

  const totalesFinales = {};
  for (const key in acumuladoVotos) {
    const porcentaje = totalVotosValidosNacional > 0
      ? (acumuladoVotos[key].votosSuma / totalVotosValidosNacional) * 100
      : 0;

    totalesFinales[key] = {
      candidato: acumuladoVotos[key].candidato,
      porcentaje: Number(porcentaje.toFixed(2)),
      votos: acumuladoVotos[key].votosSuma
    };
  }

  return totalesFinales;
};

export const obtenerTotalesPresidenteFachada = (DatosProvincias) =>
  obtenerTotalesPresidente(DatosProvincias);
