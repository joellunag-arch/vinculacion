<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
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
            <router-link class="nav-link nav-link--inicio" to="/">Inicio</router-link>
          </li>

          <!-- Dropdown Votantes Nacionales -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="nacionalesDrop" role="button" data-bs-toggle="dropdown">
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

          <!-- Dropdown Votantes Extranjeros -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="extranjerosDrop" role="button" data-bs-toggle="dropdown">
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
            <router-link class="nav-link nav-link--acerca" to="/acerca-de">Acerca De</router-link>
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

<style lang="scss" scoped>
.nav-link {
  font-family: var(--font-primary);
  color: var(--primary) !important;
  font-weight: 600;
  padding: 0.5rem 1rem;

  &--inicio { color: #f39c12 !important; } // Naranja según manual
  &--acerca { color: #f39c12 !important; }
}

.dropdown-menu {
  border-radius: 0;
  padding: 1rem 0;
  min-width: 250px;
}

.dropdown-item {
  font-family: var(--font-secondary); // Oswald
  color: var(--primary);
  padding: 0.7rem 2rem;
  font-size: 1.1rem;

  &:hover {
    background-color: var(--gray-100);
    color: var(--secondary);
  }
}

/* Flecha del dropdown */
.dropdown-toggle::after {
  vertical-align: middle;
  color: var(--secondary);
}
</style>