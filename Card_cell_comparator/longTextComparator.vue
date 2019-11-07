<template>
  <v-layout align-space-between justify-center column>
    <!-- <v-expansion-panels inset focusable> -->
    <v-expansion-panel v-for="(v,i) in values" :key="i">
      <v-expansion-panel-content>
        <template v-slot:header>
          <div class="text-truncate">Long Text {{i + 1}}</div>
        </template>
        <v-card>
          <v-card-text>{{v}}</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!-- </v-expansion-panels> -->
  </v-layout>
</template>

<script>
export default {
  name: "longTextComparator",
  props: ["values"]
};
</script>

<style>
</style>