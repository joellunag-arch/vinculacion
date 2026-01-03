<template>
  <!-- Pie de página principal del sitio SEVEE -->
  <footer class="footer-sevee">
    <div class="container-fluid">
      <!-- Contenedor que agrupa todos los logos -->
      <div class="contenedor-logos">
        <!-- Sección del logo principal de SEVEE -->
        <div class="seccion-logo-principal">
          <img src="@/assets/img/logos/P_Sevee.svg" alt="SEVEE" class="logo-sevee" />
        </div>
        <!-- Sección de logos de instituciones colaboradoras -->
        <div class="seccion-logos-institucionales">
          <img src="@/assets/img/logos/P_IAEN.svg" alt="IAEN" class="logo-institucional" />
          <img src="@/assets/img/logos/P_Uce.svg" alt="UCE" class="logo-institucional" />
          <img src="@/assets/img/logos/P_Ac.svg" alt="Ágora Ciudadana" class="logo-institucional" />
        </div>
      </div>
    </div>
    <!-- Línea de derechos de autor con año dinámico -->
    <div class="pie-derechos footer-text">Copyright &#169; {{ anio }} | Derechos reservados</div>
  </footer>
</template>

<script setup>
// Obtiene el año actual de forma dinámica para el copyright
const anio = new Date().getFullYear();
</script>

<style scoped>
/* Importa estilos generales del proyecto */
@import '@/styles/EstilosGenerales.css';

/* ========================================
   CONTENEDOR PRINCIPAL DE LOGOS
   ======================================== */
/* Configuración de flexbox para disposición responsive de logos */
.contenedor-logos {
  display: flex;
  align-items: center;
  padding: 1.5rem 1rem;
  flex-wrap: wrap;
  gap: 1.5rem; /* Espacio entre elementos */
}

/* ========================================
   LOGO PRINCIPAL SEVEE
   ======================================== */
/* En móvil: logo centrado ocupando todo el ancho */
.seccion-logo-principal {
  flex: 1 1 100%;
  text-align: center;
}

/* ========================================
   LOGOS INSTITUCIONALES
   ======================================== */
/* En móvil: logos apilados verticalmente y centrados */
.seccion-logos-institucionales {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* Espacio entre logos */
}

/* ========================================
   ESTILOS RESPONSIVE (TABLET Y DESKTOP)
   ======================================== */
/* A partir de 768px cambia a layout horizontal */
@media (min-width: 768px) {
  .contenedor-logos {
    padding: 1.5rem 5rem; /* Mayor padding lateral en pantallas grandes */
    flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
  }

  /* Logo SEVEE ocupa 1/3 del ancho y se alinea a la izquierda */
  .seccion-logo-principal {
    flex: 0 0 33.333%;
    text-align: left;
  }

  /* Logos institucionales ocupan 2/3 del ancho y se alinean a la derecha */
  .seccion-logos-institucionales {
    flex: 0 0 66.666%;
    flex-direction: row; /* Disposición horizontal */
    justify-content: flex-end; /* Alineados a la derecha */
    gap: 10rem; /* Mayor espacio entre logos */
    margin-right: 10rem; /* Desplazamiento hacia la izquierda */
  }
}

/* ========================================
   TAMAÑOS Y PROPIEDADES DE LOGOS
   ======================================== */
/* Propiedades comunes para todos los logos */
.logo-sevee, .logo-institucional {
  max-height: 85px; /* Altura máxima de logos */
  object-fit: contain; /* Mantiene proporciones sin deformar */
  vertical-align: middle; /* Alineación vertical */
}

/* Ancho máximo específico del logo SEVEE */
.logo-sevee { max-width: 250px; }
/* Ancho máximo de logos institucionales */
.logo-institucional { max-width: 200px; }

/* ========================================
   LÍNEA DE DERECHOS DE AUTOR
   ======================================== */
/* Sección inferior con copyright */
.pie-derechos {
  background-color: #2a2a2a; /* Fondo más claro que el footer principal */
  border-top: 1px solid #444; /* Línea superior de separación más clara */
  text-align: center; /* Texto centrado */
  padding: 1.5rem 0; /* Espaciado vertical */
}
</style>
