<template>
  <v-layout align-center justify-space-between row>
    <!-- <v-flex xs3>
      <v-hover>
        <v-card top slot-scope="{ hover }">
          <v-img :src="v1" :aspect-ratio="16/9" contain class="grey lighten-2">
            <v-expand-transition>
              <v-img v-if="hover" :src="{v1}" class="transition-ease-in"></v-img>
            </v-expand-transition>
          </v-img>
        </v-card>
      </v-hover>
    </v-flex>-->
    <v-flex v-for="(v,i) in values" :key="i">
      <v-hover>
        <v-card top slot-scope="{ hover }">
          <v-img :src="v" :aspect-ratio="16/9" contain class="grey lighten-2">
            <v-expand-transition>
              <v-img v-if="hover" :src="{v}" class="transition-ease-in"></v-img>
            </v-expand-transition>
          </v-img>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "imageComparator",
  props: ["values"]
};
</script>

<style>
</style>