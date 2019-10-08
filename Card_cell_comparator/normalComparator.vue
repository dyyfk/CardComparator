<template>
  <div>
    <v-layout row wrap v-if="v1&&v2">
      <v-flex xs3>{{ v1 }}</v-flex>
      <v-flex xs3 offset-xs2>{{ v2 }}</v-flex>
    </v-layout>
    <v-layout row wrap v-else-if="v1">
      <v-flex xs3>{{ v1 }}</v-flex>
      <v-flex offset-xs2>
        <p class="font-weight-black">NULL</p>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else-if="v2">
      <v-flex xs3>
        <p class="font-weight-black">NULL</p>
      </v-flex>
      <v-flex xs3 offset-xs2>{{ v2 }}</v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs3>
        <p class="font-weight-black">NULL</p>
      </v-flex>
      <v-flex xs3 offset-xs2>
        <p class="font-weight-black">NULL</p>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "normalComparator",
  props: ["v1", "v2"]
};
</script>

<style>
</style>