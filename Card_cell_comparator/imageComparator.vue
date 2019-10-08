<template>
  <v-layout row wrap>
    <v-flex xs3>
      <v-hover>
        <v-card top slot-scope="{ hover }">
          <v-img :src="v1" :aspect-ratio="16/9" contain class="grey lighten-2">
            <v-expand-transition>
              <v-img v-if="hover" :src="{v1}" class="transition-ease-in"></v-img>
            </v-expand-transition>
          </v-img>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs3 offset-xs2>
      <v-hover>
        <v-card top slot-scope="{ hover }">
          <v-img :src="v2" :aspect-ratio="16/9" contain class="grey lighten-2">
            <v-expand-transition>
              <v-img v-if="hover" :src="{v2}" class="transition-ease-in"></v-img>
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
  props: ["v1", "v2"]
};
</script>

<style>
</style>