<template>
  <header class="site-header">
    <div class="top-line" />
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <div class="brand">
          <img :src="logo" alt="Sevee logo" class="logo" />
        </div>

        <!-- Botón hamburguesa para móviles -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menú colapsable -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto nav-items">
            <li class="nav-item">
              <router-link to="/" :class="{ active: isActiveExact('/') }"
                >Inicio</router-link
              >
            </li>

            <!-- Votantes Nacionales con dropdown -->
            <li
              class="nav-item dropdown has-dropdown"
              :class="{
                open: isActivePrefix('/nacionales'),
                show: openDropdown === 'nacionales',
              }"
              @mouseenter="handleMouseEnter('nacionales')"
              @mouseleave="handleMouseLeave"
            >
              <a
                href="#"
                :class="[
                  'dropdown-toggle',
                  { active: isActivePrefix('/nacionales') },
                ]"
                role="button"
                @click.prevent="toggleDropdown('nacionales', $event)"
                :aria-expanded="openDropdown === 'nacionales'"
              >
                Votantes Nacionales
              </a>
              <ul
                class="dropdown-menu"
                :class="{ show: openDropdown === 'nacionales' }"
              >
                <li v-for="year in nacionalesYears" :key="year">
                  <router-link
                    class="dropdown-item"
                    :to="`/nacionales/${year}`"
                    :class="{
                      'disabled-link': !isYearEnabled(year, 'NACIONALES'),
                    }"
                    @click="closeDropdown"
                  >
                    Votantes Nacionales {{ year }}
                    <span
                      v-if="!isYearEnabled(year, 'NACIONALES')"
                      class="badge-disabled"
                    >
                      (Próximamente)</span
                    >
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Votantes Extranjeros con dropdown -->
            <li
              class="nav-item dropdown has-dropdown"
              :class="{
                open: isActivePrefix('/extranjeros'),
                show: openDropdown === 'extranjeros',
              }"
              @mouseenter="handleMouseEnter('extranjeros')"
              @mouseleave="handleMouseLeave"
            >
              <a
                href="#"
                :class="[
                  'dropdown-toggle',
                  { active: isActivePrefix('/extranjeros') },
                ]"
                role="button"
                @click.prevent="toggleDropdown('extranjeros', $event)"
                :aria-expanded="openDropdown === 'extranjeros'"
              >
                Votantes Extranjeros
              </a>
              <ul
                class="dropdown-menu"
                :class="{ show: openDropdown === 'extranjeros' }"
              >
                <li v-for="year in extranjerosYears" :key="year">
                  <router-link
                    class="dropdown-item"
                    :to="`/extranjeros/${year}`"
                    :class="{
                      'disabled-link': !isYearEnabled(year, 'EXTRANJEROS'),
                    }"
                    @click="closeDropdown"
                  >
                    Votantes Extranjero {{ year }}
                    <span
                      v-if="!isYearEnabled(year, 'EXTRANJEROS')"
                      class="badge-disabled"
                    >
                      (Próximamente)</span
                    >
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <router-link to="/acerca-de">Acerca De</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="bottom-line" />
  </header>
</template>

<script>
import logo from "../assets/img/logos/Sevee_NavBar.svg";
import { CONFIG_ELECCIONES } from "@/config/elecciones";

export default {
  name: "NavBar",
  data() {
    return {
      logo,
      nacionalesYears: [1992, 1996, 1998, 2009, 2013, 2017, 2021, 2023],
      extranjerosYears: [2009, 2013, 2017, 2021, 2023, 2025],
      openDropdown: null,
      hoverTimeout: null,
    };
  },
  methods: {
    isActivePrefix(prefix) {
      return this.$route.path.startsWith(prefix);
    },
    isActiveExact(path) {
      return this.$route.path === path;
    },
    toggleDropdown(dropdown) {
      if (this.openDropdown === dropdown) {
        this.openDropdown = null;
      } else {
        this.openDropdown = dropdown;
      }
    },
    /**
     * Función para verificar si un año específico está habilitado en la configuración.
     * @param {Number|String} year - El año a verificar.
     * @param {String} type - Tipo de elección (NACIONALES o EXTRANJEROS).
     */
    isYearEnabled(year, type) {
      return CONFIG_ELECCIONES[type]?.[year]?.habilitado || false;
    },
    handleMouseEnter(dropdown) {
      if (window.innerWidth >= 992) {
        if (this.hoverTimeout) {
          clearTimeout(this.hoverTimeout);
        }
        this.openDropdown = dropdown;
      }
    },
    handleMouseLeave() {
      if (window.innerWidth >= 992) {
        this.hoverTimeout = setTimeout(() => {
          this.openDropdown = null;
        }, 200);
      }
    },
    closeDropdown() {
      this.openDropdown = null;
    },
  },
  beforeUnmount() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  },
};
</script>

<style scoped>
.site-header {
  width: 100%;
}
.top-line {
  height: 2px;
  background: #222;
}
.bottom-line {
  height: 2px;
  background: #cfcfcf;
}

.navbar {
  padding: 14px 32px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.brand {
  margin-right: auto;
}

.logo {
  height: 36px;
  width: auto;
}

/* Estilos para el botón hamburguesa */
.navbar-toggler {
  border: 1px solid var(--color-primary);
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(247, 140, 14, 0.5);
  border-color: var(--color-accent);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(36, 108, 182, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Items de navegación */
.nav-items {
  list-style: none;
  display: flex;
  gap: 25px;
  margin: 0;
  padding: 0;
  align-items: center;
  font-family: var(--font-body);
}

.nav-item a {
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 600;
  display: block;
  padding: 0.5rem 1rem;
  font-family: var(--font-body);
  transition: color 0.3s ease;
}

.nav-item a.active,
.nav-item a.router-link-active {
  color: var(--color-accent);
}

.nav-item a:hover {
  color: var(--color-accent);
}

.nav-item a:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  border: 1px solid #e7e7e7;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 260px;
  margin-top: 0;
  left: 50% !important;
  transform: translateX(-50%) !important;
  right: auto !important;
  font-family: var(--font-body);
}

.dropdown-item {
  padding: 12px 16px;
  color: var(--color-primary);
  font-weight: 600;
  white-space: normal;
  text-align: center;
  font-family: var(--font-body);
}

.dropdown-item:hover {
  background-color: var(--bg-soft);
  color: var(--color-accent);
}

.dropdown-item:focus {
  background-color: var(--bg-soft);
  color: var(--color-accent);
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.dropdown-item.router-link-active {
  color: var(--color-accent);
  background-color: var(--bg-soft);
}

.has-dropdown.open > a {
  color: var(--color-accent);
}

/* Responsive para móviles */
@media (max-width: 991px) {
  .navbar {
    padding: 14px 16px;
    /* Ensure relative positioning for absolute child */
    position: relative; 
  }

  .navbar-collapse {
    position: absolute;
    top: 100%; /* Just below the navbar header */
    left: 0;
    width: 100%;
    z-index: 1050; /* Higher than map */
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-height: 80vh; /* Prevent taking full screen if too long */
    overflow-y: auto;
  }

  .nav-items {
    flex-direction: column;
    gap: 0;
    width: 100%;
    padding: 1rem 0;
  }

  .nav-item {
    width: 100%;
  }

  .nav-item a {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0; /* Separator for items */
  }

  .dropdown-menu {
    position: static !important;
    transform: none !important;
    box-shadow: none;
    border: none;
    border-top: 2px solid #f5a623;
    padding: 0;
    margin: 0;
    background-color: #f8f9fa;
    left: auto !important;
    text-align: center;
  }

  .dropdown-item {
    padding: 0.75rem 1rem;
    text-align: center;
  }
}

/* Estilos para tablet y desktop */
@media (min-width: 992px) {
  .navbar-collapse {
    justify-content: flex-end;
  }

  .dropdown-menu {
    left: 50% !important;
    transform: translateX(-50%) !important;
    display: none;
  }

  .dropdown-menu.show {
    display: block;
  }

  .has-dropdown.show .dropdown-menu {
    display: block;
  }
}

/* Estilo para los años deshabilitados */
.disabled-link {
  pointer-events: none;
  opacity: 0.5;
  color: var(--text-muted) !important;
  cursor: not-allowed;
}

.badge-disabled {
  font-size: 0.75rem;
  color: var(--color-accent);
  font-style: italic;
}
</style>
