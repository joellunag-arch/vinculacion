import { ref } from 'vue';

export function useElectoralData() {
  const datosProvincias = ref([]);
  const loading = ref(false);

  // 1. "Mapeamos" todos los archivos JSON de la carpeta datos de una sola vez
  const todosLosArchivos = import.meta.glob('../assets/datos/**/*.json');

  const cargarResultados = async (year, etapa) => {
    loading.value = true;
    
    let carpetaEtapa = etapa === 1 ? 'PrimeraVuelta' : (etapa === 2 ? 'SegundaVuelta' : 'asambleístas');
    let subPath = etapa === 3 ? '' : 'presidentes/';
    
    const rutaBusqueda = `../assets/datos/${year}/datos/${subPath}${carpetaEtapa}/DatosProvincias.json`;

    try {
      if (todosLosArchivos[rutaBusqueda]) {
        const modulo = await todosLosArchivos[rutaBusqueda]();
        datosProvincias.value = modulo.default;
        console.log(`Datos de ${year} cargados correctamente.`);
      } else {
        console.error("Archivo no encontrado en la ruta:", rutaBusqueda);
        datosProvincias.value = [];
      }
    } catch (e) {
      console.error("Error crítico al cargar:", e);
      datosProvincias.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { datosProvincias, loading, cargarResultados };
}