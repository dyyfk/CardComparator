<template>
  <v-layout align-center justify-space-between row>
    <v-flex v-for="(v,i) in values" :key="i">
      <a :href="{v}">{{v}}</a>
      <br />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "urlComparator",
  props: ["values"]
};
</script>

<style>
a {
  word-break: break-word;
}
</style>
