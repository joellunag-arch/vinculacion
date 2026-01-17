<template>
  <section class="hero container-fluid bg-white pb-4 pb-md-5">
    <div class="container">
      <div class="row align-items-center">
        <!-- Izquierda: Logo -->
        <div class="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
          <AsyncImage
            :resolver="logoResolver"
            alt="Logo SEVEE"
            imgClass="hero__logo img-fluid mb-3"
          />
        </div>

        <!-- Derecha: Ilustración -->
        <div class="col-12 col-md-6 text-center">
           <AsyncImage
            :resolver="ilustracionResolver"
            alt="Ilustración"
            imgClass="hero__illustration img-fluid"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AsyncImage from "@/components/global/AsyncImage.vue";

// Define lazy loaders
const logoLoader = () => import('@/assets/img/logos/Sevee_Logo.svg');
const ilustracionLoader = () => import('@/assets/img/logos/Sevee_Ilustracion.svg');

export default {
  name: "HeroInicio",
  components: { AsyncImage },
  data() {
    return {
      logoResolver: async () => {
         const mod = await logoLoader();
         return mod.default;
      },
      ilustracionResolver: async () => {
        const mod = await ilustracionLoader();
        return mod.default;
      }
    };
  }
};
</script>

<style scoped>
.hero {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.hero.container-fluid {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

@media (max-width: 767.98px) {
  .hero {
    padding-top: 2rem !important;
  }
}

@media (min-width: 768px) {
  .hero {
    padding-top: 0 !important;
  }

  .hero .row.align-items-center {
    align-items: center !important;
    min-height: auto;
  }
}

.hero__logo {
  margin-top: 0 !important;
  transition: all 0.3s ease;
}

.hero__illustration {
  filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1));
  margin-top: 0 !important;
  transition: all 0.3s ease;
}

@media (min-width: 650px) {
  .hero__logo {
    max-height: 150px;
  }

  .hero__illustration {
    max-width: 85%;
  }
}

@media (min-width: 768px) {
  .hero__logo {
    max-height: 180px;
    max-width: 100%;
  }

  .hero__illustration {
    max-width: 90%;
  }
}

@media (min-width: 992px) {
  .hero__logo {
    max-height: 200px;
  }

  .hero__illustration {
    max-width: 95%;
  }
}

@media (min-width: 1200px) {
  .hero__logo {
    max-height: 220px;
  }

  .hero__illustration {
    max-width: 100%;
  }
}

@media (max-width: 575.98px) {
  .hero__logo {
    max-width: 75%;
    margin-bottom: 1rem !important;
  }

  .hero__illustration {
    max-width: 85%;
  }
}

.hero .container {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

.hero .row {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

@media (max-width: 375px) {
  .hero {
    padding-top: 1.5rem !important;
  }
}
</style>