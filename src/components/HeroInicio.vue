<template>
  <section class="hero container-fluid bg-white py-4 py-md-5">
    <div class="container">
      <div class="row align-items-center">
        
        <!-- Lado Izquierdo: Logo Principal -->
        <div class="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
          <img
            src="@/assets/img/logos/Sevee_Logo.svg"
            alt="Logo Principal SEVEE"
            class="hero__logo img-fluid"
          />
        </div>

        <!-- Lado Derecho: Ilustración de Rompecabezas -->
        <div class="col-12 col-md-6 text-center">
          <img
            src="@/assets/img/logos/Sevee_Ilustracion.svg"
            alt="Ilustración SEVEE"
            class="hero__illustration img-fluid"
          />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
// Aplicando BEM y Tokens de diseño
.hero {
  @media (min-width: 768px) {
    min-height: 50vh; 
    display: flex;
    align-items: center;
  }

  &__logo {
    max-height: 180px;
    @media (min-width: 768px) {
      max-height: 250px;
    }
    object-fit: contain;
  }

  &__illustration {
    max-width: 85%;
    @media (min-width: 768px) {
      max-width: 100%;
    }
    filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1));
  }
}
</style>