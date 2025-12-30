<template>
  <div class="hero-container container-fluid bg-white py-5">
    <div class="container">
      <div class="row align-items-center">
        <!-- Izquierda: Logo Principal y Título -->
        <div class="col-md-6 text-center text-md-start mb-4">
          <img
            src="@/assets/img/logos/Sevee_Logo.svg"
            alt="Logo Principal"
            class="img-fluid mb-3"
            style="max-height: 250px"
          />
        </div>

        <!-- Derecha: Ilustración de manos con rompecabezas -->
        <div class="col-md-6 text-center">
          <img
            src="@/assets/img/logos/Sevee_Ilustracion.svg"
            alt="Ilustración SEVEE"
            class="img-fluid illustration-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.illustration-img {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1));
}
</style>