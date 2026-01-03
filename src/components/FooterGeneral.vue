<template>
  <footer class="footer-sevee mt-auto pb-4">
    <div class="container">
      <div class="row align-items-center">
     
        <div class="col-md-4 text-center text-md-start mb-4 mb-md-0">
          <img src="@/assets/img/logos/Sevee_NavBar.svg" alt="SEVEE" class="footer-main-logo mb-2">
          <p class="footer-text">Sistema Ecuatoriano de Visualización de Estadística Electoral</p>
        </div>

        <div class="col-md-8">
          <div class="d-flex justify-content-center justify-content-md-end align-items-center gap-4 flex-wrap">
            <div class="text-center">
              <img src="@/assets/img/logos/Logo_IAEN 2.svg" alt="IAEN" class="footer-inst-logo">
              <div class="tiny-text">Instituto de Altos Estudios Nacionales</div>
            </div>
            <div class="text-center">
              <img src="@/assets/img/logos/Logo_Uce.svg" alt="UCE" class="footer-inst-logo">
              <div class="tiny-text">Universidad Central del Ecuador</div>
            </div>
            <div class="text-center">
              <img src="@/assets/img/logos/Logo_AC 1.svg" alt="Ágora" class="footer-inst-logo">
              <div class="tiny-text">Ágora Ciudadana</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Línea de Copyright estilizada con el nuevo color -->
      <div class="row mt-4 pt-3" style="border-top: 1px solid #333;">
        <div class="col text-center">
          <p class="footer-text mb-0 opacity-75">
            Copyright © 2025 | Derechos reservados
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-main-logo {
  height: 45px;
  /* El filtro blanco se mantiene para que el logo resalte sobre el fondo oscuro #1e1e1e */
  filter: brightness(0) invert(1); 
}
.footer-inst-logo {
  height: 50px;
  margin-bottom: 5px;
}
/* No necesitamos definir .tiny-text ni .footer-text aquí 
   porque ya están en el EstilosGenerales.css de tu compañero */
</style>