<template>
  <v-btn style="border-color: grey" depressed small :color="`${color[sequential]}`" icon></v-btn>
</template>

<script>
export default {
  /*
  Comparator component expects 2 props:
    itemsDiff: an array of the difference for each row (the difference is calculated from customized comparator in this case)
    gradient: an array of the colors being, the first item will not actually be shown since it is "to right" in this case.
*/

  name: "Comparator",
  props: ["itemsDiff", "gradient"],
  data() {
    return {
      color: [], // stores the color-encoding hex value
      sequential: [] // stores the index of color array for every difference value
    };
  },
  watch: {
    itemsDiff: {
      handler() {
        // Initialize the color array
        if (this.color.length == 0) {
          this.color = this.gradient.split(", ");
          this.color.shift(); // The first index is not an actual color
        }
        // Calculate what bucket does the difference value fall into
        let interval = 1 / this.color.length;
        this.sequential = (() => {
          let i = 0;
          while (this.itemsDiff > i * interval) {
            i++;
          }
          if (i === this.color.length) {
            return i - 1;
          } else {
            return i;
          }
        })();
      },
      immediate: true
    }
  }
};
</script>

<style>
.v-btn:hover:before,
.v-btn:focus:before {
  background-color: transparent;
}
</style>
