import { ref } from 'vue';

export function useElectoralData() {
  const datosElectorales = ref({ provincias: [], cantones: [], parroquias: [] });
  const mapas = ref({ provincias: null, cantones: null, parroquias: null });
  const resumenNacional = ref({ votos_total: 0, votos_blancos: 0, votos_nulos: 0 });
  const candidatosInfo = ref([]);
  const loading = ref(false);

  // 1. Mapear TODOS los archivos de la carpeta 'data'
  const globArchivos = import.meta.glob('../assets/data/**/*.json');
  const globJS = import.meta.glob('../assets/data/**/*.js');

  const cargarTodo = async (year, etapa) => {
    loading.value = true;
    
    // Mapeo de carpetas según tu captura de pantalla
    const carpetaEtapa = etapa === 1 ? 'primera_vuelta' : (etapa === 2 ? 'segunda_vuelta' : 'asambleistas');
    const categoria = etapa === 3 ? 'asambleistas' : 'presidentes';
    
    // Construcción de la ruta de búsqueda
    const folderPath = `/data/${year}/informacion_electoral/${categoria}/${carpetaEtapa}/`;

    try {
      // Función para encontrar archivos que contengan un fragmento (ej: 'Provincias.json')
      const importarDinamico = async (fragmento) => {
        const rutaCompleta = Object.keys(globArchivos).find(key => 
          key.includes(folderPath) && key.includes(fragmento)
        );
        if (rutaCompleta) {
          const mod = await globArchivos[rutaCompleta]();
          return mod.default;
        }
        return [];
      };

      // 2. Cargar Resultados
      datosElectorales.value.provincias = await importarDinamico('Provincias.json');
      datosElectorales.value.cantones = await importarDinamico('Cantones.json');
      datosElectorales.value.parroquias = await importarDinamico('Parroquias.json');

      // 3. Cargar Mapas (desde la carpeta /mapas/ del año)
      const mapaPath = `/data/${year}/mapas/`;
      const importarMapa = async (file) => {
        const ruta = Object.keys(globArchivos).find(key => key.includes(mapaPath) && key.includes(file));
        return ruta ? (await globArchivos[ruta]()).default : null;
      };

      mapas.value.provincias = await importarMapa('provincias.json');
      mapas.value.cantones = await importarMapa('cantones.json');

      // 4. Cargar Info de Candidatos (CandidatosData.js)
      const rutaJS = Object.keys(globJS).find(key => key.includes(`/data/${year}/CandidatosData.js`));
      if (rutaJS) {
        const modJS = await globJS[rutaJS]();
        candidatosInfo.value = modJS.candidatoData;
      }

      // 5. Calcular Resumen para la Barra Turquesa
      if (datosElectorales.value.provincias.length > 0) {
        resumenNacional.value = {
          votos_total: datosElectorales.value.provincias.reduce((a, b) => a + (b.votos_total || 0), 0),
          votos_blancos: datosElectorales.value.provincias.reduce((a, b) => a + (b.votos_blancos || 0), 0),
          votos_nulos: datosElectorales.value.provincias.reduce((a, b) => a + (b.votos_nulos || 0), 0),
        };
      }

    } catch (e) {
      console.error("Error en controlador useElectoralData:", e);
    } finally {
      loading.value = false;
    }
  };

  const obtenerEtapasDelAno = (ambito, year) => {
    // Esto debería venir de tu config/elecciones.js idealmente
    if (year === '1996') return [1, 2];
    if (year === '2023') return [1, 2, 3];
    return [1];
  };

  return { loading, datosElectorales, mapas, candidatosInfo, resumenNacional, cargarTodo, obtenerEtapasDelAno };
}