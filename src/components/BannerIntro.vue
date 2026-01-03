<template>
  <section class="banner-intro container-fluid py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-11 col-lg-10 text-center">
          <p class="banner-text">
            El Sistema Ecuatoriano de Visualización de Estadística Electoral es una plataforma gratuita pensada para facilitar la observación dinámica de los resultados de los procesos electorales en Ecuador, garantizando el derecho de los ciudadanos y las ciudadanas al acceso libre a la información (Artículo 61 de la Constitución de la República del Ecuador). SEVEE es el resultado del trabajo conjunto entre el Instituto de Altos Estudios Nacionales y la Universidad Central, con el apoyo del Ágora Ciudadana.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner-intro {
  background-color: var(--color-primary); 
}

.banner-text {
  color:var(--bg-light);
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .banner-text { font-size: 1.2rem; }
}
</style>