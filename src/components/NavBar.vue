<template>
  <nav class="navbar navbar-expand-lg navbar-sevee sticky-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img src="@/assets/img/logos/Sevee_NavBar.svg" alt="SEVEE" height="40">
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link nav-link-custom" to="/">Inicio</router-link>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle nav-link-custom" href="#" data-bs-toggle="dropdown">
              Votantes Nacionales
            </a>
            <ul class="dropdown-menu shadow border-0">
              <li v-for="year in yearsNacionales" :key="year">
                <router-link class="dropdown-item" :to="'/nacionales/' + year">
                  Votantes Nacionales {{ year }}
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle nav-link-custom" href="#" data-bs-toggle="dropdown">
              Votantes Extranjeros
            </a>
            <ul class="dropdown-menu shadow border-0">
              <li v-for="year in yearsExtranjeros" :key="year">
                <router-link class="dropdown-item" :to="'/extranjeros/' + year">
                  Votantes Extranjeros {{ year }}
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link class="nav-link nav-link-custom" to="/acerca-de">Acerca De</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
const yearsNacionales = [1992, 1996, 1998, 2009, 2013, 2017, 2021, 2023];
const yearsExtranjeros = [2009, 2013, 2017, 2021, 2023, 2025];
</script>

<style scoped>
/* CSS PURO - Sin anidamiento */
.dropdown-menu {
  border-radius: 4px;
  padding: 1rem 0;
  min-width: 250px;
}

.dropdown-item {
  font-family: var(--font-body); 
  color: var(--color-primary);
  padding: 0.7rem 2rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--bg-soft);
  color: var(--color-accent);
}
</style>