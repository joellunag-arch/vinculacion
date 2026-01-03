<template>
  <section class="hero container-fluid bg-white pb-4 pb-md-5"> 
    <div class="container">
      <div class="row align-items-center">
        <!-- Izquierda: Logo y Título -->
        <div class="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
          <img
            src="@/assets/img/logos/Sevee_Logo.svg"
            alt="Logo SEVEE"
            class="hero__logo img-fluid mb-3"
          />
        </div>

        <!-- Derecha: Rompecabezas -->
        <div class="col-12 col-md-6 text-center">
          <img
            src="@/assets/img/logos/Sevee_Ilustracion.svg"
            alt="Ilustración"
            class="hero__illustration img-fluid"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.hero.container-fluid {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.hero .container,
.hero .row,
.hero .col-12 {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.hero__logo {
  margin-top: 0 !important;
}

@media (min-width: 650px) {
  .hero__title {
    font-size: 2.5rem;
  }
  .hero__logo {
    max-height: 180px;
    margin-top: 0 !important;
  }
}

.hero__illustration {
  max-width: 90%;
  filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1));
  margin-top: 0 !important;
}
</style>