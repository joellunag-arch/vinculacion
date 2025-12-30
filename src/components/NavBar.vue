<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <!-- Logo específico para el Navbar -->
        <img src="@/assets/img/logos/Sevee_NavBar.svg" alt="SEVEE" height="40">
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link text-primary fw-bold" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/nacionales">Votantes Nacionales</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/extranjeros">Votantes Extranjeros</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-warning fw-bold" to="/acerca-de">Acerca De</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>