<template>
  <v-app>
    <NavBar />

    <v-main>
      <router-view />
    </v-main>

    <FooterGeneral />
  </v-app>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import FooterGeneral from "./components/FooterGeneral.vue";
</script>

<style>
body {
  background-color: white !important;
  color: #212529 !important;
  margin: 0;
  padding: 0;
}
</style>
