<!--

  FooterGeneral.vue
 
  Componente que renderiza el pie de página general del sitio SEVEE.

  Incluye el logo principal de SEVEE y los logos de las instituciones colaboradoras

  (IAEN, UCE, Ágora Ciudadana), así como la información de derechos de autor con

  año dinámico. El diseño es completamente responsive, adaptándose de layout vertical

  en móviles a horizontal en tablets y desktop.

-->
 
<template>
<!-- Pie de página principal del sitio SEVEE -->
<footer class="footer-sevee">
<!-- Contenedor Bootstrap responsive -->
<div class="container-fluid">
<!-- Fila principal con logos -->
<div class="row align-items-center justify-content-between g-3">
<!-- Sección del logo principal de SEVEE (12 cols en móvil, 4 en tablet, 3 en desktop) -->
<div class="col-12 col-md-4 col-lg-3 text-center text-md-start">
<img 

            src="@/assets/img/logos/P_Sevee.svg" 

            alt="SEVEE" 

            class="logo-sevee img-fluid"

          />
</div>
 
        <!-- Sección de logos de instituciones colaboradoras -->
<!-- (12 cols en móvil apilados, 8 en tablet, 9 en desktop) -->
<div class="col-12 col-md-8 col-lg-9">
<div class="row justify-content-center justify-content-md-end align-items-center g-3">
<!-- Logo IAEN -->
<div class="col-6 col-sm-4 col-md-3 col-lg-2 text-center">
<img 

                src="@/assets/img/logos/P_IAEN.svg" 

                alt="IAEN" 

                class="logo-institucional img-fluid"

              />
</div>
 
            <!-- Logo UCE -->
<div class="col-6 col-sm-4 col-md-3 col-lg-2 text-center">
<img 

                src="@/assets/img/logos/P_Uce.svg" 

                alt="UCE" 

                class="logo-institucional img-fluid"

              />
</div>
 
            <!-- Logo Ágora Ciudadana -->
<div class="col-6 col-sm-4 col-md-3 col-lg-2 text-center">
<img 

                src="@/assets/img/logos/P_Ac.svg" 

                alt="Ágora Ciudadana" 

                class="logo-institucional img-fluid"

              />
</div>
</div>
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

   TAMAÑOS Y PROPIEDADES DE LOGOS

   ======================================== */

.logo-sevee {

  max-height: 85px;

  max-width: 250px;

  object-fit: contain;

}
 
.logo-institucional {

  max-height: 85px;

  max-width: 200px;

  object-fit: contain;

}
 
/* ========================================

   AJUSTES RESPONSIVE PARA BOOTSTRAP

   ======================================== */

/* En móvil: espaciado reducido */

.footer-sevee {

  padding-top: 1.5rem;

  padding-bottom: 0;

}
 
/* En tablet y desktop: aumentar espaciado lateral */

@media (min-width: 768px) {

  .footer-sevee {

    padding-top: 2rem;

  }

  .logo-sevee {

    padding-left: 3rem;

  }

}
 
/* ========================================

   LÍNEA DE DERECHOS DE AUTOR

   ======================================== */

.pie-derechos {

  background-color: #2a2a2a;

  border-top: 1px solid #444;

  text-align: center;

  padding: 1rem 0;

  margin-top: 1.5rem;

  font-size: 0.9rem;

}
 
@media (max-width: 768px) {

  .pie-derechos {

    font-size: 0.8rem;

    padding: 0.75rem 0;

  }

}
</style>

 