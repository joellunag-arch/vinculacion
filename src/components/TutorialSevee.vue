<template>
  <section class="tutorial container-fluid bg-light pt-5">
    <div class="container">
      <div class="row align-items-center mb-5">
        <div class="col-12 col-md-5 text-center text-md-start mb-4 mb-md-0">
          <h2 class="tutorial__title">
            Aprende más sobre cómo funciona el Sevee.
          </h2>
        </div>

        <div class="col-12 col-md-7 d-flex justify-content-center">
          <div class="tutorial__video-container shadow-lg">
            <iframe 
              src="https://www.youtube.com/embed/S_bhJ4hKKik" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="tutorial__footer-img mt-4">
      <img src="@/assets/img/logos/Sevee_Edificios.svg" alt="Edificios" class="img-fluid w-100" />
    </div>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.tutorial {
  overflow: hidden;

  &__title {
    font-family: var(--font-primary);
    color: #333;
    font-weight: 700;
    font-size: 2.2rem;
    line-height: 1.2;
  }

  &__video-container {
    width: 100%; 
    height: 250px;
    border-radius: 12px;
    overflow: hidden;
    background-color: black; 
    border: 3px solid white;

    @media (min-width: 768px) {
      width: 90%; 
      height: 375px;
    }

    iframe {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__footer-img img {
    max-height: 400px;
    object-fit: cover;
    object-position: top;
    display: block;
  }
}
</style>