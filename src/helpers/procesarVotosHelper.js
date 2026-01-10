/**
 * Calcula el resumen estadístico nacional de resultados electorales. Procesa la estructura de provincias
 * para determinar el porcentaje de votación de cada candidato sobre el gran total de votos válidos nacionales.
 * @param {Array} DatosProvincias - Arreglo de objetos con la estructura estándar.
 * @returns {Object} Diccionario indexado por partido con el nombre del candidato y su porcentaje final .
 */

const obtenerTotalesPresidente = (DatosProvincias) => {

  const acumuladoVotos = {}
  let totalVotosValidosNacional = 0

  // 2. Totalización de Votos 
  DatosProvincias.forEach((provincia) => {
    
    const { resultados } = provincia
    
    // Calcular votos válidos si no existen (común en nivel cantonal/parroquial)
    let votosTotalesItem = provincia.votos_validos || 0;
    if (!votosTotalesItem) {
        for (const p in resultados) {
            votosTotalesItem += (resultados[p].votos || 0);
        }
    }
    totalVotosValidosNacional += votosTotalesItem;

    for (const partido in resultados) {
      if (!acumuladoVotos[partido]) {
        acumuladoVotos[partido] = {
          candidato: resultados[partido].candidato,
          votosSuma: 0,
        }
      }
      acumuladoVotos[partido].votosSuma += resultados[partido].votos
    }
  })
  
  console.log("--- DEBUG HELPER ---");
  console.log("Total Votos Validos Nacional:", totalVotosValidosNacional);
  console.log("Acumulado Votos Keys:", Object.keys(acumuladoVotos));

  // Calculo de Porcetanje de Votos a nivel nacional
  const totalesFinales = {}

  for (const partido in acumuladoVotos) {
    if (totalVotosValidosNacional > 0) {
      const porcentaje =
        (acumuladoVotos[partido].votosSuma / totalVotosValidosNacional) * 100
      const candidatoNombre = acumuladoVotos[partido].candidato

      totalesFinales[partido] = {
        candidato: candidatoNombre,
        porcentaje: Number(porcentaje.toFixed(2)),
        color: obtenerColorPartido(partido),
      }
    }
  }

  console.log("Totales Finales:", totalesFinales);
  

  return totalesFinales
}


// Función Auxiliar para obtener el color 
const obtenerColorPartido = (partido) => {
  const coloresPartidos = {
    // 2025
    'ADN': '#93278F', // Morado ADN
    'RC/RETO': '#00AEEF', // Celeste RC 
    'CONSTRUYE': '#FFFF00', // Amarillo
    'PSC': '#003366', // Azul PSC
    'ACTUEMOS': '#FFA500', 
    'PSP': '#D32F2F',
    'PID': '#2E7D32',
    'AMIGO': '#41b6c4',
    'PSE': '#C2185B',
    'ID': '#FB8C00',
    'CD': '#F1C40F',
    'MUPP': '#54278f',
    'CREO': '#045A8D',
    'AVANZA': '#3498DB',
    'SUMA': '#E67E22',
    'UP': '#D35400',
    'DSI': '#1ABC9C',
    
    // Historico
    'PLRE-2': '#C62828', // Rojo liberal
    'PAB-3': '#0D47A1', // Azul bolivariano
    'CFP-4': '#E53935', // Rojo populista
    'DP-5': '#1565C0', // Azul democracia cristiana
    'PSC-6': '#003366', // Azul oscuro PSC
    'PUR-8': '#2E7D32', // Verde republicano
    'FADI-9': '#6A1B9A', // Morado izquierda
    'PRE-10': '#D32F2F', // Rojo PRE
    'ID-12': '#FB8C00', // Naranja ID (histórico)
    'APRE-13': '#5D4037', // Marrón militar
    'MPD-15': '#B71C1C', // Rojo marxista
    'PSE-17': '#C2185B', // Rosa socialista
  }

  return coloresPartidos[partido] || '#A0A0A0'
}

// Fachada pública del módulo
export const obtenerTotalesPresidenteFachada = (DatosProvincias) => {
  return obtenerTotalesPresidente(DatosProvincias)
}
