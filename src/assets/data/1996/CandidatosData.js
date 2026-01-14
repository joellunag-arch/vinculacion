// ============================================================
// ARCHIVO: src/assets/data/[AÑO]/CandidatosData.js
// SOLUCIÓN: Glob de imágenes + Rutas relativas correctas
// ============================================================

/**
 * ESTRUCTURA ESPERADA:
 * src/assets/
 * ├── data/
 * │   └── 1996/
 * │       └── CandidatosData.js  ← Estás aquí
 * └── img/
 *     ├── candidatos/
 *     └── Partidos/
 */

//  Importación glob de TODAS las imágenes
const imageModules = import.meta.glob('../../img/**/*.{png,jpg,jpeg,svg}', { eager: true });

// Helper mejorado que busca en los módulos importados
const img = (path) => {
  const fullPath = `../../img/${path}`;
  const module = imageModules[fullPath];
  
  if (module && module.default) {
    return module.default;
  }
  
  // Fallback: retorna placeholder si no encuentra
  console.warn(`⚠️ Imagen no encontrada: ${path}`);
  const placeholderPath = '../../img/candidatos/1.png';
  return imageModules[placeholderPath]?.default || '';
};

// 1. LEYENDA DE COLORES
export const dessertsData = [
    { porcentaje: 'Menor porcentaje de votos', p1: '#bdd7e7', p2: '#fdbe85', p3: '#cbaada', p4: '#fcdabc', p5: '#B1E1E7', p6: '#f8bbd0', p7: '#F5B7B1', p8: '#bdbdbd', p9: '#A4DFBF', p10: '#c7b69f', p11: '#f9e79f', p12: '#b4e4f9', p13: '#ffc9c2', p14: '#fcf099', p15: '#cbe5f6', p16: '#DFA4CB' },
    { porcentaje: 'Porcentaje de votos bajo', p1: '#6baed6', p2: '#fd8d3c', p3: '#A569BD', p4: '#f8c89c', p5: '#64C3CE', p6: '#f48fb1', p7: '#F1948A', p8: '#8c8c8c', p9: '#7DCEA0', p10: '#907761', p11: '#F4D03F', p12: '#54C3F2', p13: '#fb887d', p14: '#f3d367', p15: '#85c1e9', p16: '#CF77B0' },
    { porcentaje: 'Porcentaje de votos medio', p1: '#3182bd', p2: '#e6550d', p3: '#8E44AD', p4: '#f2b77c', p5: '#40b6c4', p6: '#f06292', p7: '#EC7063', p8: '#5f5f5f', p9: '#52BE80', p10: '#7e634e', p11: '#F1C40F', p12: '#27B4EF', p13: '#ef7e73', p14: '#c29b2b', p15: '#5dade2', p16: '#c5599f' },
    { porcentaje: 'Mayor porcentaje de votos', p1: '#08519c', p2: '#a63603', p3: '#7D3C98', p4: '#e69237', p5: '#35A0AC', p6: '#e91e63', p7: '#E74C3C', p8: '#4a4a4a', p9: '#229954', p10: '#553d2a', p11: '#D4AC0D', p12: '#1097D1', p13: '#e37469', p14: '#8f6e0f', p15: '#3498db', p16: '#b5408c' }
];

// 2. DICCIONARIO DE CANDIDATOS
export const candidatoData = [
    // ========== CANDIDATOS 1996 ==========
    { 
        partido: 1, 
        nombre: 'DANIEL NOBOA AZIN', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#045A8D', 
        nombrePartido: 'ADN', 
        json: '1' 
    },
    { 
        partido: 2, 
        nombre: 'CANDIDATO 1996-2', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#EF8A62', 
        nombrePartido: 'AMIGO', 
        json: '2' 
    },

    // ========== CANDIDATOS 2021 ==========
    { 
        partido: 3, 
        nombre: 'GUILLERMO LASSO', 
        url: img('candidatos/GUILLERMO LASSO.png'), 
        logo: img('Partidos/CREO.png'), 
        color: '#045A8D', 
        nombrePartido: 'Alianza Creo 21 Psc 6', 
        json: '3' 
    },
    { 
        partido: 4, 
        nombre: 'ANDRÉS ARAUZ', 
        url: img('candidatos/ANDRES ARAUZ.png'), 
        logo: img('Partidos/UNION ESPERANZA.png'), 
        color: '#EF8A62', 
        nombrePartido: '1-5 Unión Por La Esperanza', 
        json: '4' 
    },
    { 
        partido: 5, 
        nombre: 'YAKU PÉREZ', 
        url: img('candidatos/YAKU PEREZ.png'), 
        logo: img('Partidos/PACHAKUTIK.png'), 
        color: '#54278f', 
        nombrePartido: 'Movimiento De Unidad Plurinacional Pachakutik', 
        json: '5' 
    },
    { 
        partido: 6, 
        nombre: 'XAVIER HERVAS', 
        url: img('candidatos/XAVIER HERVAS.png'), 
        logo: img('Partidos/IZQUIERDA DEMOCRATICA.png'), 
        color: '#fcbd00', 
        nombrePartido: 'Partido Izquierda Democrática', 
        json: '6' 
    },
    { 
        partido: 7, 
        nombre: 'PEDRO JOSÉ FREILE', 
        url: img('candidatos/PEDRO FREILE.png'), 
        logo: img('Partidos/AMIGO.png'), 
        color: '#41b6c4', 
        nombrePartido: 'Movimiento Amigo', 
        json: '7' 
    },
    { 
        partido: 8, 
        nombre: 'ISIDRO ROMERO', 
        url: img('candidatos/ISIDRO ROMERO.png'), 
        logo: img('Partidos/AVANZA.png'), 
        color: '#d81b60', 
        nombrePartido: 'Partido Político Avanza', 
        json: '8' 
    },
    { 
        partido: 9, 
        nombre: 'LUCIO GUTIÉRREZ', 
        url: img('candidatos/LUCIO GUTIERREZ.png'), 
        logo: img('Partidos/SOCIEDAD PATRIOTICA.png'), 
        color: '#cb4335', 
        nombrePartido: 'Partido Sociedad Patriótica 21 De Enero', 
        json: '9' 
    },
    { 
        partido: 10, 
        nombre: 'GERSON ALMEIDA', 
        url: img('candidatos/GERSON ALMEIDA.png'), 
        logo: img('Partidos/ECUATORIANO UNIDO.png'), 
        color: '#808080', 
        nombrePartido: 'Movimiento Ecuatoriano Unido', 
        json: '10' 
    },
    { 
        partido: 11, 
        nombre: 'XIMENA PEÑA', 
        url: img('candidatos/XIMENA PEÑA.png'), 
        logo: img('Partidos/ALIANZA PAIS.png'), 
        color: '#239b56', 
        nombrePartido: 'Movimiento Alianza País', 
        json: '11' 
    },
    { 
        partido: 12, 
        nombre: 'GUILLERMO CELI', 
        url: img('candidatos/GUILLERMO CELI.png'), 
        logo: img('Partidos/SOCIEDAD UNIDA.png'), 
        color: '#553d2a', 
        nombrePartido: 'Partido Político Sociedad Unida Más Acción', 
        json: '12' 
    },
    { 
        partido: 13, 
        nombre: 'JUAN F. VELASCO', 
        url: img('candidatos/JUAN VELASCO.png'), 
        logo: img('Partidos/CONSTRUYE.png'), 
        color: '#d4ac0d', 
        nombrePartido: 'Movimiento Construye', 
        json: '13' 
    },
    { 
        partido: 14, 
        nombre: 'CESAR MONTUFAR', 
        url: img('candidatos/CESAR MONTUFAR.png'), 
        logo: img('Partidos/ALIANZA HONESTIDAD.png'), 
        color: '#006691', 
        nombrePartido: 'Alianza Honestidad', 
        json: '14' 
    },
    { 
        partido: 15, 
        nombre: 'GUSTAVO LARREA', 
        url: img('candidatos/GUSTAVO LARREA.png'), 
        logo: img('Partidos/MOVIMIENTO DEMOCRACIA.png'), 
        color: '#fa8072', 
        nombrePartido: 'Movimiento Democracia Sí', 
        json: '15' 
    },
    { 
        partido: 16, 
        nombre: 'CARLOS SAGNAY', 
        url: img('candidatos/CARLOS SAGNAY.png'), 
        logo: img('Partidos/FUERZAS EC.png'), 
        color: '#765900', 
        nombrePartido: 'Partido Fuerza Ec', 
        json: '16' 
    },
    { 
        partido: 17, 
        nombre: 'GIOVANNY ANDRADE', 
        url: img('candidatos/GIOVANNY ANDRADE.png'), 
        logo: img('Partidos/UNION ECUATORIANA.png'), 
        color: '#00ffff', 
        nombrePartido: 'Unión Ecuatoriana', 
        json: '17' 
    },
    { 
        partido: 18, 
        nombre: 'PAÚL CARRASCO', 
        url: img('candidatos/PAUL CARRASCO.png'), 
        logo: img('Partidos/NACIONAL PODEMOS.png'), 
        color: '#cb35a3', 
        nombrePartido: 'Movimiento Nacional Podemos', 
        json: '18' 
    },

    // ========== CANDIDATOS 2025 ==========
    { 
        partido: 19, 
        nombre: 'DANIEL NOBOA AZIN', 
        url: img('candidatos/2.png'), 
        logo: img('Partidos/1.png'), 
        color: '#93278F', 
        nombrePartido: 'ADN', 
        json: '19' 
    },
    { 
        partido: 20, 
        nombre: 'JUAN IVAN CUEVA', 
        url: img('candidatos/3.png'), 
        logo: img('Partidos/1.png'), 
        color: '#41b6c4', 
        nombrePartido: 'AMIGO', 
        json: '20' 
    },
    { 
        partido: 21, 
        nombre: 'LUIS FELIPE TILLERIA', 
        url: img('candidatos/5.png'), 
        logo: img('Partidos/1.png'), 
        color: '#3498DB', 
        nombrePartido: 'AVANZA', 
        json: '21' 
    },
    { 
        partido: 22, 
        nombre: 'JIMMY JAIRALA VALLAZZA', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#F1C40F', 
        nombrePartido: 'CD', 
        json: '22' 
    },
    { 
        partido: 23, 
        nombre: 'HENRY CUCALON', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#FFFF00', 
        nombrePartido: 'CONSTRUYE', 
        json: '23' 
    },
    { 
        partido: 24, 
        nombre: 'FRANCESCO TABACCHI', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#045A8D', 
        nombrePartido: 'CREO', 
        json: '24' 
    },
    { 
        partido: 25, 
        nombre: 'IVAN SAQUICELA', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#1ABC9C', 
        nombrePartido: 'DSI', 
        json: '25' 
    },
    { 
        partido: 26, 
        nombre: 'CARLOS RABASCALL', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#FB8C00', 
        nombrePartido: 'ID', 
        json: '26' 
    },
    { 
        partido: 27, 
        nombre: 'LEONIDAS IZA', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#54278f', 
        nombrePartido: 'MUPP', 
        json: '27' 
    },
    { 
        partido: 28, 
        nombre: 'VICTOR ARAUS', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#2E7D32', 
        nombrePartido: 'PID', 
        json: '28' 
    },
    { 
        partido: 29, 
        nombre: 'HENRY KRONFLE KOZHAYA', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#003366', 
        nombrePartido: 'PSC', 
        json: '29' 
    },
    { 
        partido: 30, 
        nombre: 'PEDRO GRANJA', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#C2185B', 
        nombrePartido: 'PSE', 
        json: '30' 
    },
    { 
        partido: 31, 
        nombre: 'ANDREA GONZALEZ', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#D32F2F', 
        nombrePartido: 'PSP', 
        json: '31' 
    },
    { 
        partido: 32, 
        nombre: 'LUISA GONZALEZ', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#00AEEF', 
        nombrePartido: 'RC/RETO', 
        json: '32' 
    },
    { 
        partido: 33, 
        nombre: 'ENRIQUE GOMEZ', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#E67E22', 
        nombrePartido: 'SUMA', 
        json: '33' 
    },
    { 
        partido: 34, 
        nombre: 'JORGE ESCALA', 
        url: img('candidatos/1.png'), 
        logo: img('Partidos/1.png'), 
        color: '#D35400', 
        nombrePartido: 'UP', 
        json: '34' 
    },
];

