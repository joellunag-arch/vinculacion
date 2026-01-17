import { ref } from 'vue';

export function useElectoralData() {

  const loading = ref(false);

  const datosElectorales = ref({
    provincias: [],
    cantones: [],
    parroquias: []
  });

  const mapas = ref({
    provincias: null,
    cantones: null,
    parroquias: null
  });

  const resumenNacional = ref({
    votos_total: 0,
    votos_blancos: 0,
    votos_nulos: 0
  });

  const candidatosInfo = ref([]);

  // =========================
  // GLOBS ESTÁTICOS (OBLIGATORIO EN VITE)
  // =========================
  const globJSON = import.meta.glob('../assets/data/**/*.json');
  const globJS   = import.meta.glob('../assets/data/**/*.js');

  // =========================
  // CACHE
  // =========================
  const cache = new Map();

  // =========================
  // MAIN LOADER
  // =========================
  const cargarTodo = async (year, etapa) => {

    const cacheKey = `${year}-${etapa}`;
    if (cache.has(cacheKey)) {
      const c = cache.get(cacheKey);
      datosElectorales.value = structuredClone(c.datosElectorales);
      mapas.value = structuredClone(c.mapas);
      candidatosInfo.value = structuredClone(c.candidatosInfo);
      resumenNacional.value = structuredClone(c.resumenNacional);
      return;
    }

    loading.value = true;

    const carpetaEtapa =
      etapa === 1 ? 'primera_vuelta'
      : etapa === 2 ? 'segunda_vuelta'
      : 'asambleistas';

    const categoria = etapa === 3 ? 'asambleistas' : 'presidentes';

    try {
      // =========================
      // IMPORTADOR JSON FILTRADO
      // =========================
      const importarJSON = async (basePath, nombre) => {
        const ruta = Object.keys(globJSON).find(
          k =>
            k.includes(`/data/${year}/`) &&
            k.includes(basePath) &&
            k.includes(nombre)
        );

        if (!ruta) return [];
        const mod = await globJSON[ruta]();
        return mod.default || mod;
      };

      const baseResultados =
        `/informacion_electoral/${categoria}/${carpetaEtapa}/`;

      datosElectorales.value.provincias =
        await importarJSON(baseResultados, 'Provincias');

      datosElectorales.value.cantones =
        await importarJSON(baseResultados, 'Cantones');

      datosElectorales.value.parroquias =
        await importarJSON(baseResultados, 'Parroquias');

      // =========================
      // NORMALIZACIÓN
      // =========================
      datosElectorales.value.provincias.forEach(p => {
        if (p.CODPROV && !p.CODPRO) p.CODPRO = p.CODPROV;
      });

      // =========================
      // MAPAS
      // =========================
      const importarMapa = async (file) => {
        const ruta = Object.keys(globJSON).find(
          k =>
            k.includes(`/data/${year}/mapas/`) &&
            k.includes(file)
        );

        if (!ruta) return null;
        const mod = await globJSON[ruta]();
        return mod.default || mod;
      };

      mapas.value.provincias = await importarMapa('provincias.json');
      mapas.value.cantones   = await importarMapa('cantones.json');
      mapas.value.parroquias = await importarMapa('parroquias.json');

      // =========================
      // CANDIDATOS
      // =========================
      const rutaCandidatos = Object.keys(globJS).find(
        k => k.endsWith(`/data/${year}/CandidatosData.js`)
      );

      if (rutaCandidatos) {
        const mod = await globJS[rutaCandidatos]();
        candidatosInfo.value = mod.candidatoData || [];
      }

      // =========================
      // RESUMEN NACIONAL
      // =========================
      const provs = datosElectorales.value.provincias;

      resumenNacional.value = {
        votos_total: provs.reduce((a, b) => a + (b.votos_total || 0), 0),
        votos_blancos: provs.reduce((a, b) => a + (b.votos_blancos || 0), 0),
        votos_nulos: provs.reduce((a, b) => a + (b.votos_nulos || 0), 0),
      };

      // =========================
      // CACHE
      // =========================
      cache.set(cacheKey, {
        datosElectorales: structuredClone(datosElectorales.value),
        mapas: structuredClone(mapas.value),
        candidatosInfo: structuredClone(candidatosInfo.value),
        resumenNacional: structuredClone(resumenNacional.value)
      });

    } catch (e) {
      console.error('❌ Error en useElectoralData:', e);
    } finally {
      loading.value = false;
    }
  };

  const obtenerEtapasDelAno = (ambito, year) => {
    if (year === '1996') return [1, 2];
    if (year === '2023') return [1, 2, 3];
    return [1];
  };

  return {
    loading,
    datosElectorales,
    mapas,
    candidatosInfo,
    resumenNacional,
    cargarTodo,
    obtenerEtapasDelAno
  };
}
