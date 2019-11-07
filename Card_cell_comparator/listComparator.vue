<template>
  <v-layout>
    <v-flex grow pa-1 v-for="(value,index) in values" :key="index">
      <ul>
        <li v-for="(v,i) in value" :key="i">
          <div>{{v}}</div>
        </li>

        <!-- <v-expansion-panel-content>
            <template v-slot:header>
              <div class="text-truncate">More...</div>
            </template>
            <v-card>
              <v-card-text>More</v-card-text>
            </v-card>
        </v-expansion-panel-content>-->
      </ul>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "listComparator",
  props: ["values"],
  computed: {
    // More() {
    //   let arr = [];
    //   this.values.forEach(value => {
    //     let v = [];
    //     value.forEach((e, i) => {
    //       if (i > 2) {
    //         v.push(e);
    //       }
    //     });
    //     arr.push(v);
    //   });
    //   return arr;
    // }
  }
};
</script>

<style>
</style>