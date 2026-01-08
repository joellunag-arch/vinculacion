<!-- src/components/TablaResultados.vue -->
<template>
  <div class="table-responsive shadow-sm rounded">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-primary-custom">
        <tr>
          <th>Provincia</th>
          <th>Ganador</th>
          <th>Partido</th>
          <th class="text-end">Porcentaje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in datos" :key="item.CODPRO">
          <td class="fw-bold">{{ item.PROVINCIA }}</td>
          <td>{{ item.ganador }}</td>
          <td>
            <span class="badge bg-light text-dark border">{{
              item.ganador
            }}</span>
          </td>
          <td class="text-end fw-bold text-primary">
            {{ item.resultados[item.ganador]?.porcentaje }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  datos: { type: Array, default: () => [] },
});
</script>

<style scoped>
.table-primary-custom {
  background-color: var(--color-primary);
  color: white;
}
.table-primary-custom th {
  font-family: var(--font-titles);
  text-transform: uppercase;
  padding: 15px;
}
tbody td {
  font-family: var(--font-body);
  padding: 12px 15px;
}
</style>
