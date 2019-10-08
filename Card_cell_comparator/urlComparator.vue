<template>
  <v-layout row wrap>
    <v-flex xs3 grow>
      <a :href="{v1}">{{v1}}</a>
    </v-flex>
    <v-flex xs3 offset-xs2>
      <a :href="{v2}">{{v2}}</a>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "urlComparator",
  props: ["v1", "v2"]
};
</script>

<style>
</style>
