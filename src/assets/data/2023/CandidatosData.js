// ============================================================
// ARCHIVO: src/assets/data/2023/CandidatosData.js
// DESCRIPCIÓN: Configuración de candidatos, colores y logos para 2023
// ============================================================

// Importación glob de TODAS las imágenes (Lazy Loading)
const imageModules = import.meta.glob("../../img/**/*.{png,jpg,jpeg,svg}", { eager: false });

// Helper para resolver imágenes
const img = (path) => {
  const fullPath = `../../img/${path}`;
  const loader = imageModules[fullPath];

  if (loader) {
    return async () => {
      const mod = await loader();
      return mod.default;
    };
  }
  // Fallback si no encuentra la imagen
  return async () => "";
};

// ============================================================
// 1. LEYENDA DE COLORES (Escala de intensidad para mapas de calor si se usa)
// ============================================================
export const dessertsData = [
  {
    porcentaje: "Nivel Bajo",
    p1: "#bdd7e7",
    p2: "#fdbe85",
    p3: "#cbaada",
    p4: "#fcdabc",
    p5: "#B1E1E7",
    p6: "#f8bbd0",
  },
  {
    porcentaje: "Nivel Medio",
    p1: "#6baed6",
    p2: "#fd8d3c",
    p3: "#A569BD",
    p4: "#f8c89c",
    p5: "#64C3CE",
    p6: "#f48fb1",
  },
  {
    porcentaje: "Nivel Alto",
    p1: "#08519c",
    p2: "#a63603",
    p3: "#7D3C98",
    p4: "#e69237",
    p5: "#35A0AC",
    p6: "#e91e63",
  },
];

// ============================================================
// 2. DICCIONARIO DE CANDIDATOS 2023
// ============================================================

export const candidatoData = [
  {
    partido: 1,
    nombre: "LUISA GONZALEZ",
    url: img("imagenes_presidentes/candidato_001.png"), // Placeholder
    logo: img("logos_partidos_politicos/ALIANZA PAIS.png"), // O Revolución Ciudadana
    color: "#12a2c2", // Celeste RC
    nombrePartido: "RC",
    json: "RC",
  },
  {
    partido: 2,
    nombre: "DANIEL NOBOA AZIN",
    url: img("imagenes_presidentes/candidato_002.png"),
    logo: img("logos_partidos_politicos/ADN.png"), // Asumiendo que existe o se usará placeholder
    color: "#8A2BE2", // Violeta/Morado ADN
    nombrePartido: "ADN",
    json: "ADN",
  },
  {
    partido: 3,
    nombre: "JAN TOPIC",
    url: img("imagenes_presidentes/candidato_003.png"),
    logo: img("logos_partidos_politicos/PSC.png"),
    color: "#FFFF00", // Amarillo PSC (o rojo secundario)
    nombrePartido: "PSC/PSP/CD",
    json: "PSC/PSP/CD",
  },
  {
    partido: 4,
    nombre: "OTTO SONNENHOLZNER",
    url: img("imagenes_presidentes/candidato_004.png"),
    logo: img("logos_partidos_politicos/AVANZA.png"),
    color: "#FFA500", // Naranja
    nombrePartido: "AVANZA/SUMA",
    json: "AVANZA/SUMA",
  },
  {
    partido: 5,
    nombre: "YAKU PEREZ",
    url: img("imagenes_presidentes/candidato_005.png"),
    logo: img("logos_partidos_politicos/CLARO QUE SE PUEDE.png"), // Ajustar nombre si no existe
    color: "#008000", // Verde
    nombrePartido: "UP/PSE/DSI",
    json: "UP/PSE/DSI",
  },
  {
    partido: 6,
    nombre: "XAVIER HERVAS",
    url: img("imagenes_presidentes/candidato_006.png"),
    logo: img("logos_partidos_politicos/RETO.png"),
    color: "#FFD700", // Dorado
    nombrePartido: "RETO",
    json: "RETO",
  },
  {
    partido: 7,
    nombre: "FERNANDO VILLAVICENCIO",
    url: img("imagenes_presidentes/candidato_007.png"),
    logo: img("logos_partidos_politicos/CONSTRUYE.png"),
    color: "#00008B", // Azul oscuro
    nombrePartido: "CONSTRUYE",
    json: "CONSTRUYE",
  },
  {
    partido: 8,
    nombre: "BOLIVAR ARMIJOS",
    url: img("imagenes_presidentes/candidato_008.png"),
    logo: img("logos_partidos_politicos/AMIGO.png"),
    color: "#00FA9A", // Verde claro
    nombrePartido: "AMIGO",
    json: "AMIGO",
  },
  // Alias para segunda vuelta si el nombre cambia ligeramente en JSON
  {
    partido: 9,
    nombre: "DANIEL NOBOA AZIN",
    url: img("imagenes_presidentes/candidato_002.png"),
    logo: img("logos_partidos_politicos/ADN.png"),
    color: "#8A2BE2",
    nombrePartido: "PID/MOVER", // A veces sale así en datos oficiales
    json: "PID/MOVER",
  },
  {
    partido: 10,
    nombre: "EMPATE",
    url: "",
    logo: "",
    color: "#808080", // Gris para empates
    nombrePartido: "EMPATE",
    json: "EMPATE",
  },
];
