<template>
  <footer class="bg-dark text-white py-4 mt-auto">
    <div class="container">
      <div class="row align-items-center">
     
        <div class="col-md-4 text-center text-md-start mb-4 mb-md-0">
          <img src="@/assets/img/logos/Sevee_NavBar.svg" alt="SEVEE" class="footer-main-logo mb-2">
          <p class="small opacity-75">Sistema Ecuatoriano de Visualización de Estadística Electoral</p>
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
      <div class="row mt-4 pt-3 border-top border-secondary">
        <div class="col text-center">
          <p class="small mb-0 opacity-50">Copyright © 2025 | Derechos reservados</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-main-logo {
  height: 45px;
  filter: brightness(0) invert(1); 
}
.footer-inst-logo {
  height: 50px;
  margin-bottom: 5px;
}
.tiny-text {
  font-size: 0.65rem;
  max-width: 100px;
  line-height: 1;
  opacity: 0.8;
}
</style>