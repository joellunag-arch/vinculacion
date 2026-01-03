<template>
  <section class="tutorial container-fluid bg-white pt-5 px-0"> <!-- Agrega px-0 -->
    <div class="container px-4 px-md-5"> <!-- Agrega padding horizontal solo en el contenido -->
      <div class="row align-items-center mb-5">
        <!-- Título -->
        <div class="col-12 col-md-5 text-center text-md-start mb-4">
          <h2 class="tutorial-heading text-lowercase"> <!-- Agregué text-lowercase -->
            Aprende más sobre cómo funciona el Sevee.
          </h2>
        </div>

        <!-- Video -->
        <div class="col-12 col-md-7 d-flex justify-content-center">
          <div class="video-frame shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/S_bhJ4hKKik"
              title="Video tutorial Sevee"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Imagen de Edificios -->
    <div class="edificios-wrapper">
      <img
        src="@/assets/img/logos/Sevee_Edificios.svg"
        class="img-fluid w-100"
      />
    </div>
  </section>
</template>

<style scoped>
.tutorial {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.tutorial-heading {
  font-family: var(--font-body); /* Oswald */
  color: var(--text-main);
  font-weight: 700;
  font-size: 2.2rem;
  text-transform: lowercase; /* Esto pondrá todo en minúsculas */
}

/* O si prefieres mantener la primera letra en mayúscula: */
.tutorial-heading::first-letter {
  text-transform: uppercase;
}

.video-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  border: 5px solid var(--bg-light);
}

@media (min-width: 768px) {
  .video-frame {
    width: 90%;
  }
}

.video-frame iframe {
  width: 100%;
  height: 100%;
}

.edificios-wrapper {
  width: 100%;
  overflow: hidden; 
}

.edificios-wrapper img {
  max-height: 500px;
  object-fit: cover;
  object-position: top;
  display: block;
  border: 0;
  padding: 0;
  margin: 0;
}
</style>