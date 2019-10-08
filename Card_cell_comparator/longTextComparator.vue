<template>
  <v-layout row wrap>
    <v-flex xs3>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div class="text-truncate">{{v1}}</div>
          </template>
          <v-card>
            <v-card-text>{{v1}}</v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
    <v-flex xs3 offset-xs2>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div class="text-truncate">{{v2}}</div>
          </template>
          <v-card>
            <v-card-text>{{v2}}</v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "longTextComparator",
  props: ["v1", "v2"]
};
</script>

<style>
</style>