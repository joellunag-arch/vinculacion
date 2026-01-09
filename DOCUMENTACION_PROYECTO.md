# 📘 SEVEE - Sistema Ecuatoriano de Visualización de Estadística Electoral
## Documentación Técnica Completa del Proyecto

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías y Dependencias](#tecnologías-y-dependencias)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Sistema de Rutas](#sistema-de-rutas)
6. [Componentes](#componentes)
7. [Composables](#composables)
8. [Sistema de Estilos](#sistema-de-estilos)
9. [Gestión de Datos](#gestión-de-datos)
10. [Configuración](#configuración)
11. [Próximas Implementaciones](#próximas-implementaciones)

---

## 📖 Descripción General

SEVEE (Sistema Ecuatoriano de Visualización de Estadística Electoral) es una plataforma web desarrollada con **Vue 3** y **Vite**, diseñada para facilitar la visualización dinámica e interactiva de los resultados electorales en Ecuador desde 1992 hasta 2023.

### 🎯 Objetivos del Proyecto
- Garantizar el acceso libre a la información electoral (Art. 61 Constitución del Ecuador)
- Proporcionar visualizaciones interactivas de datos electorales
- Separar datos de votantes nacionales y extranjeros
- Ofrecer múltiples vistas: mapas, gráficos y tablas

### 🏛️ Instituciones Involucradas
- Instituto de Altos Estudios Nacionales (IAEN)
- Universidad Central del Ecuador
- Ágora Ciudadana

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue el patrón **arquitectura de componentes de Vue 3** con **Composition API**, implementando:

### Patrón de Diseño
- **Single Page Application (SPA)** con Vue Router
- **Component-Based Architecture**: Componentes reutilizables y modulares
- **Composition API**: Lógica reactiva con `<script setup>`
- **Lazy Loading**: Carga diferida de vistas para optimización

### Flujo de Datos
```
Usuario → Router → Vista → Componentes → Composables → Datos JSON
```

### Principios de Diseño
1. **Separación de Responsabilidades**: Componentes, vistas y lógica separados
2. **Reutilización**: Componentes genéricos adaptables a diferentes contextos
3. **Escalabilidad**: Estructura preparada para nuevas funcionalidades
4. **Mantenibilidad**: Código limpio y bien documentado

---

## 🛠️ Tecnologías y Dependencias

### Core
- **Vue 3.5.25**: Framework principal (Composition API)
- **Vue Router 4.6.3**: Sistema de rutas SPA
- **Vite 7.2.4**: Build tool y dev server

### UI Framework
- **Bootstrap 5.3.8**: Sistema de grid y componentes UI
- **@popperjs/core 2.11.8**: Tooltips y popovers (requerido por Bootstrap)

### Preprocesadores y Herramientas de Desarrollo
- **Sass 1.97.1**: Preprocesador CSS
- **ESLint 9.39.1**: Linter de código JavaScript/Vue
- **Autoprefixer 10.4.23**: Prefijos CSS automáticos
- **Vite Plugin Vue DevTools 8.0.5**: Herramientas de desarrollo

### Requisitos del Sistema
```json
"engines": {
  "node": "^20.19.0 || >=22.12.0"
}
```

---

## 📁 Estructura de Carpetas

### 🌳 Árbol de Directorios Detallado

```
CodigoT/
│
├── 📄 Archivos de Configuración Raíz
│   ├── package.json              # Dependencias y scripts npm
│   ├── vite.config.js            # Configuración de Vite
│   ├── eslint.config.js          # Reglas de linting
│   ├── jsconfig.json             # Configuración de JavaScript/rutas
│   ├── index.html                # HTML principal (punto de entrada)
│   └── README.md                 # Documentación básica
│
├── 📁 public/                    # Archivos estáticos públicos
│   └── (Archivos servidos directamente sin procesamiento)
│
└── 📁 src/                       # Código fuente de la aplicación
    │
    ├── App.vue                   # Componente raíz de la aplicación
    ├── main.js                   # Punto de entrada de JavaScript
    │
    ├── 📁 assets/                # Recursos estáticos procesados por Vite
    │   │
    │   ├── 📁 data/              # ⭐ DATOS ELECTORALES ESTRUCTURADOS
    │   │   ├── 1992/
    │   │   ├── 1996/
    │   │   ├── 1998/
    │   │   ├── 2009/
    │   │   ├── 2013/
    │   │   ├── 2017/
    │   │   ├── 2021/
    │   │   └── 2023/
    │   │       └── informacion_electoral/
    │   │           ├── asambleistas/
    │   │           │   └── DatosProvincias.json
    │   │           └── presidentes/
    │   │               ├── primera_vuelta/
    │   │               │   └── DatosProvincias.json
    │   │               └── segunda_vuelta/
    │   │                   └── DatosProvincias.json
    │   │       └── mapas/
    │   │           └── (GeoJSON de provincias - próxima implementación)
    │   │
    │   ├── 📁 fonts/             # Fuentes tipográficas
    │   │   ├── Oswald/           # Títulos
    │   │   └── OpenSans/         # Cuerpo de texto
    │   │
    │   └── 📁 img/               # Imágenes del proyecto
    │       ├── fondos/           # Backgrounds
    │       ├── logos/            # Logos institucionales
    │       ├── logos_partidos_politicos/
    │       ├── imagenes_presidentes/
    │       └── imagenes_asambleistas/
    │
    ├── 📁 components/            # ⭐ COMPONENTES REUTILIZABLES
    │   ├── NavBar.vue            # Navegación principal con dropdowns
    │   ├── FooterGeneral.vue     # Pie de página institucional
    │   ├── BannerIntro.vue       # Banner informativo genérico
    │   ├── BarraGeneral.vue      # Barra de estadísticas (Sufragantes, Blancos, Nulos)
    │   ├── ContenedorCarrusel.vue # Carrusel de 3 slides (Mapa, Gráficos, Tablas)
    │   ├── TablaResultados.vue   # Tabla de resultados por provincia
    │   ├── HeroInicio.vue        # Hero section de la página de inicio
    │   └── TutorialSevee.vue     # Tutorial de uso del sistema
    │
    ├── 📁 composable/            # ⭐ LÓGICA REUTILIZABLE (Composition API)
    │   └── useElectoralData.js   # Hook para cargar y procesar datos electorales
    │
    ├── 📁 config/                # ⭐ CONFIGURACIONES DEL PROYECTO
    │   └── elecciones.js         # Configuración de años y etapas disponibles
    │
    ├── 📁 router/                # ⭐ SISTEMA DE RUTAS
    │   └── index.js              # Definición de rutas de Vue Router
    │
    ├── 📁 styles/                # ⭐ ESTILOS GLOBALES
    │   ├── variables.css         # Variables CSS (colores, fuentes)
    │   ├── fonts.css             # @font-face declarations
    │   └── EstilosGenerales.css  # Estilos base y utilidades
    │
    └── 📁 views/                 # ⭐ VISTAS/PÁGINAS PRINCIPALES
        ├── PaginaInicioView.vue  # Página de inicio (landing)
        ├── VotantesNacionales.vue # Vista de resultados nacionales
        ├── VotantesExtranjeros.vue # Vista de resultados extranjeros
        ├── AcercaDe.vue          # Información institucional
        └── HomeView.vue          # (Vista alternativa/auxiliar)
```

### 📂 Descripción de Carpetas Clave

#### `src/assets/data/` - JERARQUÍA DE DATOS
Esta carpeta sigue una **estructura estándar** para todos los años electorales:

```
data/
  └── [AÑO]/                      # Ej: 1992, 1998, 2009, etc.
      ├── informacion_electoral/
      │   ├── asambleistas/       # Elecciones de asambleístas
      │   │   └── DatosProvincias.json
      │   │
      │   └── presidentes/        # Elecciones presidenciales
      │       ├── primera_vuelta/
      │       │   └── DatosProvincias.json
      │       └── segunda_vuelta/
      │           └── DatosProvincias.json
      │
      └── mapas/                  # GeoJSON de provincias (próximamente)
          └── provincias.geojson
```

**Notas importantes:**
- ✅ La estructura es **uniforme** para todos los años
- ✅ Facilita la carga dinámica con `import()`
- ✅ Separación clara entre datos de presidentes y asambleístas
- ⚠️ Los nombres de carpetas están en **minúsculas** y usan **guiones bajos** (convención estándar)

---

## 🧭 Sistema de Rutas

### Configuración de Rutas (`src/router/index.js`)

| Ruta | Componente | Descripción | Props |
|------|-----------|-------------|-------|
| `/` | PaginaInicioView | Landing page principal | - |
| `/nacionales/:year` | VotantesNacionales | Resultados nacionales por año | `year` (String) |
| `/extranjeros/:year` | VotantesExtranjeros | Resultados extranjeros por año | `year` (String) |
| `/acerca-de` | AcercaDe | Información institucional | - |

### Características de las Rutas

#### 1. **Lazy Loading**
```javascript
component: () => import('@/views/VotantesNacionales.vue')
```
- ✅ Reduce el bundle inicial
- ✅ Mejora el tiempo de carga
- ✅ Solo carga componentes cuando se necesitan

#### 2. **Rutas Dinámicas**
```javascript
path: '/nacionales/:year'
```
- Permite URLs como `/nacionales/1998`, `/nacionales/2009`
- El parámetro `year` se pasa como prop al componente

#### 3. **Historia del Navegador**
```javascript
history: createWebHistory(import.meta.env.BASE_URL)
```
- URLs limpias sin `#` (modo history)
- Compatible con despliegue en subdirectorios

---

## 🧩 Componentes

### 📍 Componentes de Layout (Estructura General)

#### 1. `NavBar.vue` - Navegación Principal
**Ubicación:** `src/components/NavBar.vue`

**Responsabilidad:**
- Barra de navegación responsive con Bootstrap
- Dropdowns dinámicos para años electorales
- Indicación visual de rutas activas
- Control de acceso a años habilitados/deshabilitados

**Props:** Ninguno

**Features:**
- ✅ **Dropdown interactivo**: Hover + Click
- ✅ **Años dinámicos**: Lee configuración de `CONFIG_ELECCIONES`
- ✅ **Estados de enlaces**: 
  - Activo: Ruta actual
  - Deshabilitado: Año no disponible (badge "Próximamente")
- ✅ **Responsive**: Menú hamburguesa en móviles

**Datos Principales:**
```javascript
nacionalesYears: [1992, 1996, 1998, 2009, 2013, 2017, 2021, 2023]
extranjerosYears: [2009, 2013, 2017, 2021, 2023, 2025]
```

**Métodos Clave:**
- `isActivePrefix(path)`: Detecta si una ruta está activa
- `isYearEnabled(year, ambito)`: Verifica si un año está habilitado
- `toggleDropdown(menu)`: Manejo de dropdown
- `handleMouseEnter/Leave`: Efectos hover

---

#### 2. `FooterGeneral.vue` - Pie de Página
**Ubicación:** `src/components/FooterGeneral.vue`

**Responsabilidad:**
- Footer institucional con logos
- Enlaces a redes sociales
- Información de copyright
- Diseño responsive

**Características:**
- ✅ Fondo oscuro (`--bg-footer: #1e1e1e`)
- ✅ Grid de 3 columnas en desktop
- ✅ Apilado vertical en móviles

---

#### 3. `BannerIntro.vue` - Banner Informativo
**Ubicación:** `src/components/BannerIntro.vue`

**Responsabilidad:**
- Banner de introducción genérico
- Texto descriptivo del proyecto SEVEE
- Fondo con color institucional

**Props:** Ninguno (contenido estático)

**Estilo:**
- Fondo: `var(--color-primary)` (#246cb6)
- Texto blanco con interlineado 1.8
- Responsive: Ajuste de tamaño de fuente

**⚙️ Componente Genérico:** 
- ✅ Puede reutilizarse con props para texto dinámico
- ✅ Sugerencia: Convertir texto a prop para mayor flexibilidad

---

### 📊 Componentes de Visualización de Datos

#### 4. `BarraGeneral.vue` - Barra de Estadísticas
**Ubicación:** `src/components/BarraGeneral.vue`

**Responsabilidad:**
- Mostrar resumen de datos electorales
- 3 métricas principales: Sufragantes, Votos en Blanco, Votos Nulos
- Formato numérico con separadores de miles

**Props:**
```javascript
stats: { 
  type: Object, 
  default: () => ({
    votos_total: 0,
    votos_blancos: 0,
    votos_nulos: 0
  })
}
```

**Características:**
- ✅ **Grid responsive**: 3 columnas en desktop, apilado en móvil
- ✅ **Iconos SVG**: Filtro CSS para invertir color
- ✅ **Formato de números**: `toLocaleString()` para separadores

**⚙️ Componente Genérico:**
- ✅ Totalmente reutilizable
- ✅ Acepta cualquier objeto de estadísticas
- ✅ Maneja valores undefined con fallback a '0'

---

#### 5. `TablaResultados.vue` - Tabla de Resultados por Provincia
**Ubicación:** `src/components/TablaResultados.vue`

**Responsabilidad:**
- Mostrar resultados provinciales en formato tabular
- Ganador por provincia con porcentaje
- Partido/movimiento político asociado

**Props:**
```javascript
datos: { 
  type: Array, 
  default: () => [] 
}
```

**Estructura de Datos Esperada:**
```javascript
[
  {
    CODPRO: "01",
    PROVINCIA: "Azuay",
    ganador: "Candidato X",
    resultados: {
      "Candidato X": { porcentaje: 45.2 }
    }
  }
]
```

**Características:**
- ✅ **Tabla Bootstrap**: Responsive con scroll horizontal
- ✅ **Hover effects**: Resalta filas al pasar el mouse
- ✅ **Header personalizado**: Usa `--color-primary`
- ✅ **Badges**: Etiquetas para partidos políticos

**⚙️ Componente Genérico:**
- ✅ Totalmente reutilizable
- ✅ Se adapta a cualquier dataset con estructura similar
- ⚠️ Requiere campos específicos: `CODPRO`, `PROVINCIA`, `ganador`, `resultados`

---

### 🎠 Componente Contenedor Principal

#### 6. `ContenedorCarrusel.vue` - Carrusel de Visualizaciones
**Ubicación:** `src/components/ContenedorCarrusel.vue`

**Responsabilidad:**
- Contenedor principal de visualizaciones
- Carrusel de 3 slides: Mapa, Gráficos, Tablas
- Control de etapas electorales (Primera Vuelta, Segunda Vuelta, Asambleístas)
- Sistema de slots para contenido personalizado

**Props:**
```javascript
ambito: { type: String, default: "NACIONALES" }
periodo: { type: String, default: "1992" }
etapasDisponibles: { type: Array, default: () => [1] }
```

**Eventos Emitidos:**
```javascript
@update-etapa  // Cambio de etapa electoral
@toggle-search // Abrir/cerrar panel de búsqueda
```

**Estructura de Slides:**

1. **Slide 1: Mapa + Filtros**
   - Layout: 75% mapa | 25% panel lateral
   - Botón de búsqueda (FAB)
   - Botones de etapa electoral

2. **Slide 2: Gráficos**
   - Título: "GRÁFICOS DE RESULTADOS"
   - Espacio para gráficos estadísticos

3. **Slide 3: Tablas**
   - Título: "TABLAS DE RESULTADOS"
   - Espacio para tablas de datos

**Slots Disponibles:**
```vue
<slot name="mapa">       <!-- Contenido del mapa -->
<slot name="filtros">    <!-- Panel de filtros -->
<slot name="graficos">   <!-- Gráficos estadísticos -->
<slot name="tablas">     <!-- Tablas de resultados -->
```

**Características Técnicas:**
- ✅ **Bootstrap Carousel**: Control nativo de slides
- ✅ **Indicadores personalizados**: Flechas + dots
- ✅ **Control de etapas dinámico**: Botones habilitados según configuración
- ✅ **Título dinámico**: Cambia según el slide activo
- ✅ **Fondo personalizado**: Imagen de fondo configurable

**Estados Internos:**
```javascript
etapa: ref(1)           // Etapa electoral activa (1, 2, 3)
slideActivo: ref(0)     // Slide del carrusel activo (0, 1, 2)
```

**Lógica de Habilitación de Etapas:**
```javascript
etapaHabilitada(num) {
  return props.etapasDisponibles.includes(num)
}
```

**⚙️ Componente Genérico:**
- ✅ **Altamente reutilizable**
- ✅ Se adapta a diferentes ámbitos (Nacionales/Extranjeros)
- ✅ Control total mediante slots
- ✅ Configuración flexible de etapas

---

### 🎬 Componentes de Páginas de Inicio

#### 7. `HeroInicio.vue` - Hero Section
**Ubicación:** `src/components/HeroInicio.vue`

**Responsabilidad:**
- Sección hero de la página de inicio
- Presentación visual del proyecto
- Call-to-action

*(Pendiente de implementación completa)*

---

#### 8. `TutorialSevee.vue` - Tutorial del Sistema
**Ubicación:** `src/components/TutorialSevee.vue`

**Responsabilidad:**
- Guía de uso del sistema
- Explicación de funcionalidades
- Ayuda contextual

*(Pendiente de implementación completa)*

---

## 🪝 Composables

### `useElectoralData.js` - Composable de Datos Electorales
**Ubicación:** `src/composable/useElectoralData.js`

**Responsabilidad:**
- Cargar datos electorales dinámicamente
- Procesar y estructurar información
- Gestionar estados de carga y errores
- Calcular resúmenes nacionales

**Exporta:**
```javascript
export function useElectoralData() {
  return {
    // Estados reactivos
    provincias,       // Array de datos por provincia
    resumenNacional,  // Objeto con totales nacionales
    loading,          // Boolean: estado de carga
    error,            // String|null: mensaje de error
    
    // Métodos
    cargarResultados  // Función para cargar datos
  }
}
```

**Método Principal:**
```javascript
cargarResultados(year, etapa)
```

**Parámetros:**
- `year` (String): Año electoral (ej: "1998", "2009")
- `etapa` (Number): Etapa electoral
  - `1`: Primera vuelta presidencial
  - `2`: Segunda vuelta presidencial
  - `3` o cualquier otro: Asambleístas

**Flujo de Ejecución:**

1. **Determina la ruta del archivo:**
   ```javascript
   // Ejemplos de rutas generadas:
   // ../assets/data/1998/informacion_electoral/presidentes/primera_vuelta/DatosProvincias.json
   // ../assets/data/2009/informacion_electoral/asambleistas/DatosProvincias.json
   ```

2. **Importación dinámica:**
   ```javascript
   const modulo = await import(`../assets/data/${year}/informacion_electoral/${pathBase}${carpetaEtapa}/DatosProvincias.json`)
   ```

3. **Procesa los datos:**
   ```javascript
   provincias.value = data
   resumenNacional.value = {
     total: data.reduce((acc, p) => acc + (p.votos_total || 0), 0),
     blancos: data.reduce((acc, p) => acc + (p.votos_blancos || 0), 0),
     nulos: data.reduce((acc, p) => acc + (p.votos_nulos || 0), 0)
   }
   ```

4. **Manejo de errores:**
   - Captura errores de archivos no encontrados
   - Resetea estados a valores por defecto
   - Proporciona mensaje de error al usuario

**Características:**
- ✅ **Reactivo**: Usa `ref()` de Vue 3
- ✅ **Asíncrono**: Manejo con `async/await`
- ✅ **Robusto**: Manejo completo de errores
- ✅ **Reutilizable**: Funciona con cualquier año/etapa

**⚙️ Uso en Componentes:**
```vue
<script setup>
import { useElectoralData } from '@/composable/useElectoralData'

const { provincias, resumenNacional, loading, error, cargarResultados } = useElectoralData()

// Cargar datos de primera vuelta 1998
await cargarResultados('1998', 1)
</script>
```

---

## 🎨 Sistema de Estilos

### Arquitectura de Estilos

El proyecto implementa un **sistema de estilos en cascada** con tres niveles:

```
1. Variables CSS (variables.css)
   ↓
2. Estilos Generales (EstilosGenerales.css)
   ↓
3. Estilos de Componentes (Scoped)
```

---

### 1. `variables.css` - Tokens de Diseño
**Ubicación:** `src/styles/variables.css`

**Responsabilidad:** Definir la paleta de colores institucional y variables globales

#### 🎨 Paleta de Colores

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-primary` | #246cb6 | Azul institucional (títulos, navbar) |
| `--color-secondary` | #12a2c2 | Turquesa vibrante (fondos destacados) |
| `--color-accent` | #f78c0e | Naranja (botones activos, destacados) |
| `--bg-footer` | #1e1e1e | Gris oscuro/negro (footer) |
| `--bg-soft` | #f0f8fb | Azul muy claro (fondos suaves) |
| `--bg-celeste` | #d8edff | Celeste (variaciones de fondo) |
| `--text-main` | #333333 | Texto principal |
| `--text-muted` | #6c757d | Texto secundario |
| `--bg-light` | #f8f9fa | Fondo general |

#### 🔤 Tipografía

| Variable | Fuente | Uso |
|----------|--------|-----|
| `--font-titles` | 'Oswald', sans-serif | Solo títulos grandes y destacados |
| `--font-body` | 'Open Sans', sans-serif | Todo lo demás (párrafos, tablas, menús) |

**Convención de Tipografía:**
- ✅ **Oswald**: SOLO para títulos principales (h1, h2)
- ✅ **Open Sans**: Para TODO lo demás

---

### 2. `fonts.css` - Declaraciones de Fuentes
**Ubicación:** `src/styles/fonts.css`

**Responsabilidad:**
- Declaraciones `@font-face` para fuentes personalizadas
- Carga de variantes (Regular, Bold, Light, etc.)
- Optimización de carga de fuentes

**Fuentes Incluidas:**
- **Oswald**: Regular, Bold
- **Open Sans**: Regular, Bold, Light, SemiBold

---

### 3. `EstilosGenerales.css` - Estilos Base
**Ubicación:** `src/styles/EstilosGenerales.css`

**Responsabilidad:**
- Reset CSS básico
- Clases utilitarias
- Estilos globales de elementos HTML
- Helpers y mixins CSS

**Contenido Típico:**
- Estilos de body, html
- Clases helper (.text-center, .mb-3, etc.)
- Animaciones globales
- Media queries comunes

---

### 📋 Guía de Uso de Estilos

#### ✅ Buenas Prácticas

**1. Usar Variables CSS:**
```css
/* ✅ CORRECTO */
.mi-componente {
  background-color: var(--color-primary);
  font-family: var(--font-titles);
}

/* ❌ INCORRECTO */
.mi-componente {
  background-color: #246cb6;
  font-family: 'Oswald', sans-serif;
}
```

**2. Estilos Scoped en Componentes:**
```vue
<style scoped>
/* Estilos específicos del componente */
.mi-clase {
  /* ... */
}
</style>
```

**3. Uso de SCSS en Componentes:**
```vue
<style scoped lang="scss">
.componente {
  &__elemento {
    // Anidación BEM
  }
}
</style>
```

---

## 💾 Gestión de Datos

### Estructura de Datos JSON

#### `DatosProvincias.json` - Formato Estándar

**Ubicación:** `src/assets/data/[AÑO]/informacion_electoral/[TIPO]/[ETAPA]/DatosProvincias.json`

**Estructura:**
```json
[
  {
    "CODPRO": "01",
    "PROVINCIA": "Azuay",
    "votos_total": 500000,
    "votos_blancos": 25000,
    "votos_nulos": 15000,
    "ganador": "Candidato X",
    "resultados": {
      "Candidato X": {
        "votos": 200000,
        "porcentaje": 40.5
      },
      "Candidato Y": {
        "votos": 150000,
        "porcentaje": 30.2
      }
    }
  }
]
```

**Campos Principales:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `CODPRO` | String | Código de provincia (01-24) |
| `PROVINCIA` | String | Nombre de la provincia |
| `votos_total` | Number | Total de sufragantes |
| `votos_blancos` | Number | Votos en blanco |
| `votos_nulos` | Number | Votos nulos |
| `ganador` | String | Nombre del candidato ganador |
| `resultados` | Object | Desglose por candidato |

**Campos de `resultados`:**
- `votos` (Number): Votos obtenidos
- `porcentaje` (Number): Porcentaje de votos

---

### Carga Dinámica de Datos

**Ventajas del Sistema:**
- ✅ **Tree-shaking**: Solo carga datos necesarios
- ✅ **Bundle splitting**: Archivos JSON separados
- ✅ **Lazy loading**: Carga bajo demanda
- ✅ **Cache del navegador**: Archivos estáticos cacheables

**Ejemplo de Importación Dinámica:**
```javascript
const modulo = await import(`../assets/data/${year}/informacion_electoral/${pathBase}${carpetaEtapa}/DatosProvincias.json`)
const data = modulo.default
```

---

## 🧩 Composables

### `useElectoralData.js` - Hook de Datos Electorales
**Ubicación:** `src/composable/useElectoralData.js`

**Responsabilidad:**
- Centralizar la lógica de carga y procesamiento de datos electorales
- Proporcionar interfaz reactiva para datos de provincias
- Calcular resúmenes nacionales automáticamente
- Manejar errores y estados de carga

**Funcionalidad Principal:**

#### 1. **Carga de Resultados** (`cargarResultados`)
```javascript
const { cargarResultados } = useElectoralData()

// Uso
await cargarResultados('2023', 1)  // Carga primera vuelta 2023
```

**Parámetros:**
- `year` (String): Año electoral (ej: "1998", "2023")
- `etapa` (Number): Tipo de elección
  - `1`: Primera vuelta (presidentes)
  - `2`: Segunda vuelta (presidentes)
  - `3`: Asambleístas

**Comportamiento:**
- ✅ Importa dinámicamente el JSON correspondiente
- ✅ Calcula totales de votos, blancos y nulos
- ✅ Maneja errores si no existe el archivo
- ✅ Actualiza estados de `loading` y `error`

#### 2. **Obtener Etapas por Año** (`obtenerEtapasDelAno`) - ⭐ NUEVO
```javascript
const { obtenerEtapasDelAno } = useElectoralData()

// Uso
const etapas = obtenerEtapasDelAno("NACIONALES", "2023")
// Retorna: [1, 2, 3]
```

**Parámetros:**
- `ambito` (String): "NACIONALES" o "EXTRANJEROS"
- `year` (String): Año electoral

**Retorno:** Array con etapas disponibles o array vacío si está deshabilitado

**Estado Reactivo Expuesto:**

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `provincias` | Ref<Array> | Lista de provincias con resultados |
| `resumenNacional` | Ref<Object> | Totales: { total, blancos, nulos } |
| `loading` | Ref<Boolean> | Estado de carga |
| `error` | Ref<String\|null> | Mensaje de error si ocurre |

**Métodos Exportados:**
- `cargarResultados(year, etapa)`: Carga datos del JSON
- `obtenerEtapasDelAno(ambito, year)`: Retorna etapas disponibles

**Ejemplo de Uso Completo:**
```vue
<script setup>
import { computed } from 'vue'
import { useElectoralData } from '@/composable/useElectoralData'

const props = defineProps(['year'])
const { obtenerEtapasDelAno, cargarResultados } = useElectoralData()

// Etapas disponibles se actualizan automáticamente con el año
const etapasDisponibles = computed(() => 
  obtenerEtapasDelAno("NACIONALES", props.year)
)

// Cargar datos cuando cambia la etapa
const cargarEtapa = async (numEtapa) => {
  if (etapasDisponibles.value.includes(numEtapa)) {
    await cargarResultados(props.year, numEtapa)
  }
}
</script>
```

---

## ⚙️ Configuración

### `elecciones.js` - Configuración de Disponibilidad
**Ubicación:** `src/config/elecciones.js`

**Responsabilidad:**
- ✅ **Origen único de verdad (Single Source of Truth)**: Centraliza toda la configuración de años y etapas
- ✅ Especificar etapas habilitadas por año
- ✅ Control de acceso a datos de forma centralizada
- ✅ Facilita mantenimiento y escalabilidad

**Estructura Principal:**
```javascript
export const CONFIG_ELECCIONES = {
  NACIONALES: {
    "1998": { etapas: [1], habilitado: true },
    "1996": { etapas: [1, 2], habilitado: false },
    "2023": { etapas: [1, 2, 3], habilitado: true }
  },
  EXTRANJEROS: {
    "2009": { etapas: [1], habilitado: true },
    "2023": { etapas: [1, 2], habilitado: false }
  }
}
```

**Parámetros:**
- `ambito` (String): "NACIONALES" o "EXTRANJEROS"
- `year` (String): Año electoral (ej: "1998", "2023")
- `etapas` (Array): Etapas disponibles [1], [1,2], [1,2,3]
  - 1: Primera vuelta
  - 2: Segunda vuelta
  - 3: Asambleístas
- `habilitado` (Boolean): Si el año está disponible para acceso

#### Nueva Función: `obtenerEtapasDisponibles()` - ⭐ NUEVO
```javascript
/**
 * Obtiene las etapas disponibles para un ámbito y año específico
 * @param {string} ambito - NACIONALES o EXTRANJEROS
 * @param {string} year - Año electoral
 * @returns {array} Array con las etapas disponibles [1], [1,2], [1,2,3], etc.
 */
export const obtenerEtapasDisponibles = (ambito, year) => {
  const config = CONFIG_ELECCIONES[ambito]?.[year]
  return config?.habilitado ? config.etapas : []
}
```

**Lógica:**
- Usa optional chaining (`?.`) para acceso seguro
- Retorna array vacío si `habilitado: false` o no existe el año
- Si `habilitado: true`, retorna el array de etapas

**Ventajas:**
- ✅ Validación automática
- ✅ Evita errores por datos faltantes
- ✅ Uso centralizado desde múltiples componentes y vistas

**Cómo se usa en Componentes:**
```javascript
// Opción 1: Usar el composable (RECOMENDADO)
import { useElectoralData } from '@/composable/useElectoralData'
const { obtenerEtapasDelAno } = useElectoralData()
const etapas = obtenerEtapasDelAno("NACIONALES", "2023")

// Opción 2: Importar directamente (para lógica pura)
import { obtenerEtapasDisponibles } from '@/config/elecciones'
const etapas = obtenerEtapasDisponibles("NACIONALES", "2023")
```

---

#### Integración en Vistas

**VotantesNacionales.vue:**
```javascript
const { obtenerEtapasDelAno } = useElectoralData()

// Computed reactivo que se actualiza con cada cambio de año
const etapasDisponibles = computed(() => 
  obtenerEtapasDelAno("NACIONALES", props.year)
)

// Las etapas se pasan al componente ContenedorCarrusel
<ContenedorCarrusel
  :etapasDisponibles="etapasDisponibles"
  @update-etapa="manejarCambioVuelta"
/>
```

**Beneficio:** Los botones se habilitan/deshabilitan automáticamente sin lógica duplicada en vistas.

---

### `vite.config.js` - Configuración de Vite

**Alias de Rutas:**
```javascript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

Permite usar `@/` en lugar de `../../../` para importaciones:
```javascript
import NavBar from '@/components/NavBar.vue'
import { CONFIG_ELECCIONES } from '@/config/elecciones'
```

---

## � Convenciones de Nombres

El proyecto utiliza **múltiples convenciones** de nombres según el contexto, siguiendo estándares de la industria:

### 1. **camelCase** - Variables, Funciones y Métodos
**Uso:** Nombre de variables, funciones, métodos y propiedades en JavaScript

**Ejemplos:**
```javascript
// Variables y propiedades
const provincias = ref([])
const resumenNacional = ref({})
const etapasDisponibles = computed(() => {})

// Funciones y métodos
const cargarResultados = async (year, etapa) => {}
const obtenerEtapasDelAno = (ambito, year) => {}
const manejarCambioVuelta = (num) => {}

// Props en componentes
const props = defineProps(['year'])
const { obtenerEtapasDelAno } = useElectoralData()
```

**Reglas:**
- ✅ Primera palabra minúscula
- ✅ Palabras subsecuentes con mayúscula inicial
- ✅ Sin guiones, sin guiones bajos
- ✅ Nombres descriptivos y claros

### 2. **snake_case** - Rutas de Archivos y Datos JSON
**Uso:** Nombres de archivos, carpetas, campos en JSON

**Ejemplos:**
```
src/assets/data/
├── informacion_electoral/          # Carpeta
│   ├── primera_vuelta/             # Carpeta
│   │   └── DatosProvincias.json
│   └── segunda_vuelta/             # Carpeta
│       └── DatosProvincias.json
└── votantes_nacionales.json        # Archivo
```

**En JSON:**
```javascript
{
  "CODPRO": "01",
  "PROVINCIA": "Azuay",
  "votos_total": 500000,           // snake_case
  "votos_blancos": 25000,          // snake_case
  "votos_nulos": 15000,            // snake_case
  "resultados": {
    "Candidato X": {
      "votos": 200000,
      "porcentaje": 40.5
    }
  }
}
```

**Reglas:**
- ✅ Todo minúsculas
- ✅ Palabras separadas por guiones bajos `_`
- ✅ Usado en datos persistentes (JSON, bases de datos)

### 3. **PascalCase** - Componentes Vue y Clases
**Uso:** Nombre de componentes `.vue` y clases JavaScript

**Ejemplos:**
```javascript
// Componentes Vue
import NavBar from '@/components/NavBar.vue'
import ContenedorCarrusel from '@/components/ContenedorCarrusel.vue'
import VotantesNacionales from '@/views/VotantesNacionales.vue'
import FooterGeneral from '@/components/FooterGeneral.vue'

// En template
<ContenedorCarrusel :etapasDisponibles="etapasDisponibles" />
<TablaResultados :data="provincias" />
```

**Reglas:**
- ✅ Primera letra mayúscula
- ✅ Cada palabra comienza con mayúscula
- ✅ Sin separadores
- ✅ Nombres en singular (preferentemente)

### 4. **UPPER_SNAKE_CASE** - Constantes
**Uso:** Constantes y configuración inmutable

**Ejemplos:**
```javascript
export const CONFIG_ELECCIONES = {
  NACIONALES: {
    "1998": { etapas: [1], habilitado: true },
    "1996": { etapas: [1, 2], habilitado: false }
  },
  EXTRANJEROS: {
    "2009": { etapas: [1], habilitado: true }
  }
}

// Constantes de colores
const COLOR_PRIMARY = '#246cb6'
const COLOR_SECONDARY = '#f39200'
```

**Reglas:**
- ✅ Todo mayúsculas
- ✅ Palabras separadas por guiones bajos
- ✅ Valores que no cambian durante la ejecución

### 5. **kebab-case** - Atributos HTML y CSS
**Uso:** Atributos HTML, clases CSS, rutas de URL

**Ejemplos:**
```html
<!-- Atributos HTML -->
<div data-bs-toggle="dropdown" aria-label="Menu">
  <button class="btn-etapa activo">Primera Vuelta</button>
</div>

<!-- Rutas -->
<router-link to="/acerca-de">Acerca de</router-link>
<router-link to="/nacionales/1998">Nacionales 1998</router-link>
```

**En CSS:**
```css
.btn-etapa {
  background-color: var(--color-primary);
  font-family: var(--font-titles);
  border-radius: 4px;
}

.carousel-indicators-custom {
  display: flex;
  justify-content: center;
}
```

**Reglas:**
- ✅ Todo minúsculas
- ✅ Palabras separadas por guiones `-`
- ✅ Nunca usar guiones bajos en clases CSS

### 📋 Tabla Resumen de Convenciones

| Contexto | Convención | Ejemplo | Donde |
|----------|-----------|---------|-------|
| Variables | `camelCase` | `etapasDisponibles` | `.js`, `.vue` |
| Funciones | `camelCase` | `cargarResultados()` | `.js`, `.vue` |
| Props | `camelCase` | `:etapasDisponibles` | Templates Vue |
| Componentes | `PascalCase` | `NavBar.vue` | Nombres de archivos |
| Constantes | `UPPER_SNAKE_CASE` | `CONFIG_ELECCIONES` | `.js` |
| Carpetas | `snake_case` | `informacion_electoral/` | `src/assets/` |
| JSON Fields | `snake_case` | `votos_total` | `.json` |
| CSS Classes | `kebab-case` | `.btn-etapa` | `<style>` |
| Rutas URL | `kebab-case` | `/acerca-de` | `router/index.js` |

### ✅ Buenas Prácticas

**1. Ser Consistente:**
```javascript
// ✅ CORRECTO: Consistente
const etapasDisponibles = computed(() => {})
const cargarEtapas = async () => {}

// ❌ INCORRECTO: Inconsistente
const etapas_disponibles = computed(() => {})
const cargarEtapas = async () => {}
```

**2. Nombres Descriptivos:**
```javascript
// ✅ CORRECTO
const obtenerEtapasDelAno = (ambito, year) => {}

// ❌ INCORRECTO
const getEtapas = (a, y) => {}
```

**3. Evitar Abreviaturas Confusas:**
```javascript
// ✅ CORRECTO
const resultadosNacionales = ref([])

// ❌ INCORRECTO
const rsltNcnls = ref([])
```

---

## 🚀 Próximas Implementaciones

### 🗺️ Mapas Interactivos

**Objetivo:** Visualización geográfica de resultados electorales

**Tareas Pendientes:**
- [ ] Implementar librería de mapas (Leaflet/Mapbox)
- [ ] Cargar archivos GeoJSON de provincias
- [ ] Crear componente `MapaEcuador.vue`

- [ ] Colorear provincias según resultados
- [ ] Añadir tooltips interactivos
- [ ] Zoom y pan del mapa

**Ubicación de GeoJSON:**
```
src/assets/data/[AÑO]/mapas/provincias.geojson
```

**Componente Propuesto:**
```vue
<MapaEcuador 
  :datos="provincias" 
  :geojson="mapData"
  @provincia-click="handleProvinciaClick"
/>
```

---

### 📊 Gráficos Estadísticos

**Objetivo:** Visualización de datos con gráficos dinámicos

**Tareas Pendientes:**
- [ ] Implementar librería de gráficos (Chart.js/ECharts)
- [ ] Crear componente `GraficoResultados.vue`
- [ ] Tipos de gráficos:
  - Gráfico de barras (resultados por candidato)
  - Gráfico de torta (distribución porcentual)
  - Gráfico de líneas (evolución histórica)
- [ ] Exportación de gráficos a imagen

**Componente Propuesto:**
```vue
<GraficoResultados 
  tipo="barras"
  :datos="resultados"
  titulo="Resultados por Candidato"
/>
```

---

### 🔍 Sistema de Filtros

**Objetivo:** Filtrado y búsqueda avanzada de datos

**Tareas Pendientes:**
- [ ] Crear componente `PanelFiltros.vue`
- [ ] Filtros por:
  - Provincia
  - Candidato/Partido
  - Rango de porcentaje
- [ ] Búsqueda en tiempo real
- [ ] Estado persistente de filtros

**Componente Propuesto:**
```vue
<PanelFiltros 
  :provincias="listadoProvincias"
  @aplicar-filtros="handleFiltros"
/>
```

---

### 📈 Tablas Avanzadas

**Objetivo:** Tablas con funcionalidades avanzadas

**Tareas Pendientes:**
- [ ] Ordenamiento por columnas
- [ ] Paginación de resultados
- [ ] Exportación a CSV/Excel
- [ ] Búsqueda en tabla
- [ ] Columnas responsivas

**Mejoras para `TablaResultados.vue`:**
- Sorting bidireccional
- Filtro de búsqueda integrado
- Indicadores visuales (badges, colores)

---

### 📱 Mejoras de Responsive

**Tareas Pendientes:**
- [ ] Optimizar carrusel para móviles
- [ ] Mejorar navegación en pantallas pequeñas
- [ ] Adaptar tablas para touch screens
- [ ] Optimizar imágenes para dispositivos móviles

---

### ♿ Accesibilidad

**Tareas Pendientes:**
- [ ] Añadir etiquetas ARIA
- [ ] Mejorar contraste de colores
- [ ] Navegación por teclado completa
- [ ] Textos alternativos para imágenes
- [ ] Lectores de pantalla

---

### ⚡ Optimizaciones de Rendimiento

**Tareas Pendientes:**
- [ ] Implementar virtualización en tablas grandes
- [ ] Lazy loading de imágenes
- [ ] Compresión de archivos JSON
- [ ] Service Workers para cache
- [ ] Análisis de bundle size

---

## 📝 Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia servidor de desarrollo con hot-reload en `http://localhost:5173`

### Producción
```bash
npm run build
```
Compila y minifica para producción en carpeta `dist/`

### Preview de Producción
```bash
npm run preview
```
Previsualiza la versión de producción localmente

### Linting
```bash
npm run lint
```
Ejecuta ESLint para verificar y corregir problemas de código

---

## 🏗️ Guía de Contribución

### Estructura de Commits

```
tipo(ámbito): descripción corta

Descripción más detallada si es necesario
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, espacios, etc.
- `refactor`: Refactorización de código
- `test`: Añadir tests
- `chore`: Mantenimiento general

**Ejemplo:**
```
feat(mapa): añadir visualización de provincias con Leaflet

- Implementa componente MapaEcuador.vue
- Carga GeoJSON de provincias
- Añade colores según resultados electorales
```

---

### Convenciones de Código

#### Nombres de Archivos
- **Componentes:** PascalCase (`NavBar.vue`, `TablaResultados.vue`)
- **Composables:** camelCase con prefijo `use` (`useElectoralData.js`)
- **Utilidades:** camelCase (`formatters.js`, `validators.js`)
- **Vistas:** PascalCase con sufijo `View` (`VotantesNacionales.vue`)

#### Nombres de Variables
```javascript
// ✅ CORRECTO
const yearElectoral = 1998
const listadoProvincias = []
const esPresidente = true

// ❌ INCORRECTO
const YearElectoral = 1998
const lista_provincias = []
const EsPresidente = true
```

#### Estructura de Componentes Vue
```vue
<template>
  <!-- Template aquí -->
</template>

<script setup>
// 1. Imports
import { ref, computed } from 'vue'

// 2. Props
const props = defineProps({
  datos: { type: Array, default: () => [] }
})

// 3. Emits
const emit = defineEmits(['update', 'close'])

// 4. Reactive state
const loading = ref(false)

// 5. Computed
const total = computed(() => props.datos.length)

// 6. Methods
const handleClick = () => { /* ... */ }

// 7. Lifecycle
onMounted(() => { /* ... */ })
</script>

<style scoped>
/* Estilos scoped aquí */
</style>
```

---

## 📞 Contacto y Soporte

**Instituciones:**
- Instituto de Altos Estudios Nacionales (IAEN)
- Universidad Central del Ecuador
- Ágora Ciudadana

**Equipo de Desarrollo:**
- Proyecto de Vinculación 2025-2026

---

## 📄 Licencia

Este proyecto está desarrollado como parte de un proyecto de vinculación universitaria para uso público e institucional.

---

## 🎯 Resumen de Componentes Genéricos vs. Específicos

| Componente | Tipo | Reutilizable | Notas |
|-----------|------|--------------|-------|
| `NavBar.vue` | Layout | ⚠️ Parcial | Específico del proyecto pero estructura genérica |
| `FooterGeneral.vue` | Layout | ⚠️ Parcial | Específico del proyecto |
| `BannerIntro.vue` | Presentación | ✅ Sí | Puede convertirse en genérico con props |
| `BarraGeneral.vue` | Datos | ✅ Sí | Totalmente reutilizable |
| `TablaResultados.vue` | Datos | ✅ Sí | Reutilizable con estructura de datos correcta |
| `ContenedorCarrusel.vue` | Contenedor | ✅ Sí | Altamente genérico con sistema de slots |
| `HeroInicio.vue` | Presentación | ⚠️ Parcial | Pendiente de implementación |
| `TutorialSevee.vue` | Ayuda | ❌ No | Específico del proyecto |

---

**Última actualización:** Enero 2026  
**Versión del proyecto:** 0.0.0  
**Framework:** Vue 3.5.25 + Vite 7.2.4
