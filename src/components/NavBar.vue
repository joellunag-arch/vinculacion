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
							<router-link to="/" :class="{ active: isActiveExact('/') }">Inicio</router-link>
						</li>
						
						<!-- Votantes Nacionales con dropdown -->
						<li class="nav-item dropdown has-dropdown" :class="{ open: isActivePrefix('/nacionales') }">
							<router-link 
								:to="`/nacionales/${nacionalesYears[nacionalesYears.length - 1]}`" 
								:class="['dropdown-toggle', { active: isActivePrefix('/nacionales') }]"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Votantes Nacionales
							</router-link>
							<ul class="dropdown-menu">
								<li v-for="year in nacionalesYears" :key="year">
									<router-link 
										class="dropdown-item" 
										:to="`/nacionales/${year}`"
										>
											Votantes Nacionales {{ year }}
										</router-link>
								</li>
							</ul>
						</li>
						
						<!-- Votantes Extranjeros con dropdown -->
						<li class="nav-item dropdown has-dropdown" :class="{ open: isActivePrefix('/extranjeros') }">
							<router-link 
								:to="`/extranjeros/${extranjerosYears[extranjerosYears.length - 1]}`" 
								:class="['dropdown-toggle', { active: isActivePrefix('/extranjeros') }]"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Votantes Extranjeros
							</router-link>
							<ul class="dropdown-menu">
								<li v-for="year in extranjerosYears" :key="year">
									<router-link 
										class="dropdown-item" 
										:to="`/extranjeros/${year}`"
										>
											Votantes Extranjero {{ year }}
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
export default {
	name: 'NavBar',
	data() {
		return {
			logo: require('../assets/Sevee_NavBar.svg'),
			nacionalesYears: [1992, 1996, 1998, 2009, 2013, 2017, 2021, 2023],
			extranjerosYears: [2009, 2013, 2017, 2021, 2023, 2025]
		}
	},
	methods: {
		isActivePrefix(prefix) {
			return this.$route.path.startsWith(prefix)
		},
		isActiveExact(path) {
			return this.$route.path === path
		}
	}
}
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
	box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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

/* Dropdown styles */
.dropdown-toggle::after {
	display: none; /* Ocultar la flecha por defecto de Bootstrap */
}

.dropdown-menu {
	border: 1px solid #e7e7e7;
	box-shadow: 0 6px 20px rgba(0,0,0,0.15);
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
	
	.dropdown:hover .dropdown-menu {
		display: block;
	}
	
	.nav-item.dropdown:hover .dropdown-menu {
		display: block;
	}
	
	.dropdown-menu {
		left: 50% !important;
		transform: translateX(-50%) !important;
	}
}
</style>