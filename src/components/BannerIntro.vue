<template>
  <section class="banner-intro container-fluid py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-11 col-md-10">
          <p class="banner-intro__text text-center mb-0">
            El Sistema Ecuatoriano de Visualización de Estadística Electoral es una plataforma gratuita pensada para facilitar la observación dinámica de los resultados de los procesos electorales en Ecuador, garantizando el derecho de los ciudadanos y las ciudadanas al acceso libre a la información (Artículo 61 de la Constitución de la República del Ecuador). SEVEE es el resultado del trabajo conjunto entre el Instituto de Altos Estudios Nacionales y la Universidad Central, con el apoyo del Ágora Ciudadana.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.banner-intro {
  background-color: var(--primary); // Usamos el azul del estándar
  
  &__text {
    font-family: var(--font-secondary); // Oswald
    color: white;
    font-weight: 300;
    line-height: 1.4;
    font-size: 0.95rem;

    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }
}
</style>