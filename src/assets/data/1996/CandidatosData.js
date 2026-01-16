// ============================================================
// ARCHIVO: src/assets/data/1996/CandidatosData.js
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

// Importación glob de TODAS las imágenes
const imageModules = import.meta.glob('../../img/**/*.{png,jpg,jpeg,svg}', { eager: true });

// Helper mejorado que busca en los módulos importados
const img = (path) => {
  const fullPath = `../../img/${path}`;
  const module = imageModules[fullPath];

  if (module && module.default) {
    return module.default;
  }

  console.warn(`⚠️ Imagen no encontrada: ${path}`);
  const placeholderPath = '../../img/candidatos/1.png';
  return imageModules[placeholderPath]?.default || '';
};

// ============================================================
// 1. LEYENDA DE COLORES
// ============================================================

export const dessertsData = [
  { porcentaje: 'Menor porcentaje de votos', p1: '#bdd7e7', p2: '#fdbe85', p3: '#cbaada', p4: '#fcdabc', p5: '#B1E1E7', p6: '#f8bbd0', p7: '#F5B7B1', p8: '#bdbdbd', p9: '#A4DFBF', p10: '#c7b69f', p11: '#f9e79f', p12: '#b4e4f9', p13: '#ffc9c2', p14: '#fcf099', p15: '#cbe5f6', p16: '#DFA4CB' },
  { porcentaje: 'Porcentaje de votos bajo', p1: '#6baed6', p2: '#fd8d3c', p3: '#A569BD', p4: '#f8c89c', p5: '#64C3CE', p6: '#f48fb1', p7: '#F1948A', p8: '#8c8c8c', p9: '#7DCEA0', p10: '#907761', p11: '#F4D03F', p12: '#54C3F2', p13: '#fb887d', p14: '#f3d367', p15: '#85c1e9', p16: '#CF77B0' },
  { porcentaje: 'Porcentaje de votos medio', p1: '#3182bd', p2: '#e6550d', p3: '#8E44AD', p4: '#f2b77c', p5: '#40b6c4', p6: '#f06292', p7: '#EC7063', p8: '#5f5f5f', p9: '#52BE80', p10: '#7e634e', p11: '#F1C40F', p12: '#27B4EF', p13: '#ef7e73', p14: '#c29b2b', p15: '#5dade2', p16: '#c5599f' },
  { porcentaje: 'Mayor porcentaje de votos', p1: '#08519c', p2: '#a63603', p3: '#7D3C98', p4: '#e69237', p5: '#35A0AC', p6: '#e91e63', p7: '#E74C3C', p8: '#4a4a4a', p9: '#229954', p10: '#553d2a', p11: '#D4AC0D', p12: '#1097D1', p13: '#e37469', p14: '#8f6e0f', p15: '#3498db', p16: '#b5408c' }
];

// ============================================================
// 2. DICCIONARIO DE CANDIDATOS
// ============================================================

export const candidatoData = [
  // ========== CANDIDATOS 1996 ==========
  {
    partido: 1,
    nombre: 'PAZ RODRIGO',
    url: img('1.png'),
    logo: img('ACTUEMOS.png'),
    color: '#08519c',
    nombrePartido: 'DP-5',
    json: '1'
  },
  {
    partido: 2,
    nombre: 'NEBOT JAIME',
    url: img('2.png'),
    logo: img('ADN.png'),
    color: '#a63603',
    nombrePartido: 'PSC-6',
    json: '2'
  },
  {
    partido: 3,
    nombre: 'BUCARAM ABDALA',
    url: img('3.png'),
    logo: img('AMIGO.png'),
    color: '#7D3C98',
    nombrePartido: 'PRE-10',
    json: '3'
  },
  {
    partido: 4,
    nombre: 'VARGAS FRANK',
    url: img('4.png'),
    logo: img('CLARO QUE SE PUEDE.png'),
    color: '#e69237',
    nombrePartido: 'APRE-13',
    json: '4'
  },
  {
    partido: 5,
    nombre: 'CASTELLO JUAN',
    url: img('5.png'),
    logo: img('CONSTRUYE.png'),
    color: '#35A0AC',
    nombrePartido: 'MPD-15',
    json: '5'
  },
  {
    partido: 6,
    nombre: 'EHLERS FREDDY',
    url: img('6.png'),
    logo: img('CREO.png'),
    color: '#e91e63',
    nombrePartido: 'MUPP-NP-18',
    json: '6'
  },
  {
    partido: 7,
    nombre: 'GALLARDO JOSE',
    url: img('7.png'),
    logo: img('PSC.png'),
    color: '#E74C3C',
    nombrePartido: 'UCI-19',
    json: '7'
  },
  {
    partido: 8,
    nombre: 'VALAZQUEZ JACINTO',
    url: img('8.png'),
    logo: img('RETO.png'),
    color: '#4a4a4a',
    nombrePartido: 'MITI-20',
    json: '8'
  },
  {
    partido: 9,
    nombre: 'NOBOA RICARDO',
    url: img('9.png'),
    logo: img('UNO.png'),
    color: '#229954',
    nombrePartido: 'PLRE-FRA-2/14',
    json: '9'
  }
];
