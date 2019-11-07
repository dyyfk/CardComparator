<template>
  <v-layout align-center justify-space-between row>
    <v-flex v-for="(v,i) in values" :key="i">
      <p v-if="v">{{v}}</p>
      <p v-else class="font-weight-black">NULL</p>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "normalComparator",
  props: ["values"]
};
</script>

<style>
</style>