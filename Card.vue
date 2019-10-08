<template>
  <v-card>
    <v-card-text id="card-contents">
      <v-layout>
        <v-flex xs3>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search the key or value"
            single-line
            hide-details
            hide-no-data
          ></v-text-field>
        </v-flex>
        <v-flex xs3 offset-xs3>
          <strong>Sort by &nbsp;</strong>
          <v-select
            v-model="sortBy"
            single-line
            class="d-inline-block"
            :items="sortOptions"
            @input="generateSortedList"
            label="Select the sort function"
          ></v-select>
          <v-switch :label="`Only show the same`" v-on:change="filterDifferent"></v-switch>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs2>
          <v-btn v-on:click="destroy(1)">
            <v-icon dark left color="red">remove_circle</v-icon>Remove left
          </v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn v-on:click="destroy(2)">
            <v-icon dark left color="red">remove_circle</v-icon>Remove right
          </v-btn>
        </v-flex>
        <!-- <v-flex xs2>
          <v-btn v-on:click="destroy(2)">
    <v-switch
      v-model="switch1"
      :label="`Switch 1: ${switch1.toString()}`"
    ></v-switch>
          </v-btn>
        </v-flex>-->
      </v-layout>
      <!-- Caption -->
      <v-layout row wrap>
        <v-flex xs4 class="text-xs-left">
          <strong>Different</strong>
        </v-flex>
        <v-flex xs4 class="text-xs-center">
          <strong>Somewhat different</strong>
        </v-flex>
        <v-flex xs4 class="text-xs-right">
          <strong>Same</strong>
        </v-flex>
      </v-layout>
      <div ref="legend"></div>

      <v-layout row wrap>
        <v-flex xs10>
          <draggable :list="list">
            <v-list v-for="(value, index) in filteredData" :key="value[0]">
              <v-layout row justify-space-between>
                <v-flex grow xs1>
                  <DiffComparator v-bind:itemsDiff="value[3]" v-bind:gradient="gradient"></DiffComparator>
                </v-flex>

                <v-flex grow xs2>
                  <span id="index">{{ value[0] }}:</span>
                </v-flex>

                <v-flex grow xs8 v-if="isUrl(value[1])">
                  <urlComparator v-bind:v1="value[1]" v-bind:v2="value[2]" />
                </v-flex>
                <v-flex grow xs8 v-else-if="value[2]&&isLongtext(value[1])">
                  <longTextComparator v-bind:v1="value[1]" v-bind:v2="value[2]" />
                </v-flex>
                <v-flex grow xs8 v-else-if="value[2]&&isImage(value[1])">
                  <imageComparator v-bind:v1="value[1]" v-bind:v2="value[2]" />
                </v-flex>
                <v-flex grow xs8 v-else>
                  <normalComparator v-bind:v1="value[1]" v-bind:v2="value[2]" />
                </v-flex>

                <v-flex grow xs2>
                  <div :ref="'distribution' + index"></div>

                  <numerialDistribution
                    v-if="isNumeralDistribution(index)"
                    :ref="'distribution' + index"
                    v-bind:dis="dis[index]"
                    v-bind:index="index"
                    v-bind:v1="value[1]"
                    v-bind:v2="value[2]"
                  />
                  <ordinalDistribution
                    v-else
                    v-bind:dis="dis[index]"
                    :ref="'distribution' + index"
                    v-bind:v1="value[1]"
                    v-bind:v2="value[2]"
                  />
                </v-flex>
              </v-layout>
            </v-list>
          </draggable>
        </v-flex>

        <!-- <v-flex xs2>
          <v-layout row wrap>
            <p>Place Holder for distribution</p>
          </v-layout>
        </v-flex>-->
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import * as d3 from "d3";

import DiffComparator from "./ColorEncodingComparator/Comparator";
import draggable from "vuedraggable";
import loadedComparators from "./comparison/compare";
import { schemeGnBu } from "d3-scale-chromatic";
import urlComparator from "./Card_cell_comparator/urlComparator";
import imageComparator from "./Card_cell_comparator/imageComparator";
import longTextComparator from "./Card_cell_comparator/longTextComparator";
import listComparator from "./Card_cell_comparator/listComparator";
import normalComparator from "./Card_cell_comparator/normalComparator";
import numerialDistribution from "./Card_cell_comparator/numerialDistribution";
import ordinalDistribution from "./Card_cell_comparator/ordinalDistribution";

/*
  [WARNING] This card element would not show until two rows are selected

  Card component expects 3 props:
    columnTypes: an array of the column types(string types), each string value should be "String" or "Number"
    leftItem: an array of key-value pair, (key-value pair is an array with index 0 being the key, index 1 being the pair)
      for one row data that is shown on the left
    rightItem: the data structure should be the same as the leftItem

*/

export default {
  name: "Card",
  components: {
    DiffComparator,
    draggable,
    urlComparator,
    imageComparator,
    longTextComparator,
    listComparator,
    normalComparator,
    numerialDistribution,
    ordinalDistribution
  },
  props: ["columnTypes", "leftItem", "rightItem", "distribution"],

  data() {
    return {
      gradient:
        "to right, #f7fcf0, #e0f3db, #ccebc5, #a8ddb5, #7bccc4, #4eb3d3, #2b8cbe, #0868ac, #084081",
      search: "",
      sortBy: "default",
      sortOptions: [
        "default",
        "similarity",
        "key",
        "value",
        "shorttext",
        "text",
        "numerical",
        "categorical",
        "set",
        "image",
        "list"
      ],
      list: null, // the list that is shown, initialized from "joinedArray" props
      upSort: false,
      joinedArray: null,
      dis: []
    };
  },
  computed: {
    filteredData() {
      if (!this.search) return this.list;
      const regex = new RegExp(this.search, "i");

      return this.list.filter(
        item =>
          regex.test(item[0]) || regex.test(item[1]) || regex.test(item[2])
      );
    },
    isFilled() {
      return this.leftItem.length > 0 && this.rightItem.length > 0;
    },
    isCleared() {
      return this.leftItem.length === 0 && this.rightItem.length === 0;
    },

    dataType() {
      return ["String", "Url"];
    }
  },
  methods: {
    // Clear the saved list
    createLegend() {
      let width = 300;
      let height = 10;
      let gradientScheme = schemeGnBu[9];
      const svg = d3
        .select(this.$refs.legend)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`);
      let legend = svg
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");
      for (let i = 0; i < 9; i++) {
        legend
          .append("stop")
          .attr("offset", `${Math.round(((i + 1) / 9.0) * 100) / 100}`)
          .attr("stop-color", gradientScheme[i])
          .attr("stop-opacity", 1);
      }
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "url(#gradient)");
    },

    filterDifferent(flag) {
      if (flag) {
        this.list = this.list.filter(e => e[3] > 0);
      } else {
        this.list = this.joinedArray.slice();
      }
    },

    isNumeralDistribution(index) {
      if (this.columnTypes[index] == "Number") {
        return true;
      } else {
        return false;
      }
    },

    // Add key values as an object to list and sort
    generateSortedList(option) {
      let comparison = new loadedComparators();

      this.upSort = !this.upSort;
      this.sortBy = option;

      if (this.sortBy === "default") {
        this.list = this.joinedArray.slice();
        // this.
        return;
      }
      this.list.sort((a, b) => this.sortFunction(a, b, option, comparison));
    },
    sortFunction(a, b, option, comparison) {
      let result;
      switch (option) {
        case "key":
          result = a[0] > b[0] ? 1 : -1;
          break;
        case "value":
          result = a[1] > b[1] ? 1 : -1;
          break;
        case "numerical":
          result = comparison.compare(option, Number(a[1]), Number(b[1])) - 0.5;
          break;
        case "categorical":
        case "shorttext":
        case "text":
        case "image":
          result = comparison.compare(option, String(a[1]), String(b[1])) - 0.5;
          break;
        case "set":
          result = comparison.compare(option, a[1], b[1]) - 0.5;
          break;
        case "similarity":
          result = a[3] - b[3];
          break;
      }
      return this.upSort ? result : -result;
    },
    generateUnsortedList() {
      const comparator = new loadedComparators();
      let values = this.leftItem.map(
        (e, i) => {
          for (let [key, value] of Object.entries(this.columnTypes)) {
            if (key == e[0])
              return comparator.compare(value, e[1], this.rightItem[i][1]);
          }
          return e[1] == this.rightItem[i][1] ? 1 : 0;
        } // Index 0 is the key, index 1 is the value for each item
      );

      let joinedArray = new Array(this.leftItem.length);
      for (let i = 0; i < joinedArray.length; i++) {
        joinedArray[i] = new Array(4);
        joinedArray[i][0] = this.leftItem[i][0];
        joinedArray[i][1] = this.leftItem[i][1];
        joinedArray[i][2] = this.rightItem[i][1];
        joinedArray[i][3] = values[i];
      }
      this.joinedArray = joinedArray;
      this.list = joinedArray;
      // Generate the difference value for each field
      this.list = this.list.map((e, i) => {
        e[3] = comparator.compare(this.types[i], e[1], e[2]);
        return e;
      });
    },
    isImage(url) {
      if (!url || typeof url != "string") return false;
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    },
    isObject(value) {
      return value && typeof value === "object" && value.constructor === Object;
    },
    isLongtext(str) {
      if (!str) return false;
      return str.length > 100;
    },
    isUrl(str) {
      const pattern = new RegExp(
        "^(http?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );
      return !!pattern.test(str);
    },
    isArray(v) {
      return Array.isArray(v);
    },

    destroy(id) {
      this.list = this.list.map(e => {
        e[id] = null;
        return e;
      });
    }
  },
  mounted() {
    this.createLegend();
  },
  watch: {
    distribution() {
      // this.dis = this.distribution.map((e, i) => {
      //   if (this.columnTypes[i] == "Number") {
      //     return numeral(e)._value; // parse the number
      //   } else {
      //     return e;
      //   }
      // });
    },
    columnTypes() {
      this.types = this.columnTypes.map(type => {
        if (type === "String") return "text";
        else if (type === "Number") return "numerical";
        else return "categorical";
      });
    },
    leftItem: {
      handler() {
        if (this.isCleared) {
          this.list = [];
          return;
        }
        if (this.isFilled) {
          this.generateUnsortedList();
          this.sortBy = "default";
        }
      },
      immediate: true // To invoke the comparator function the first time instantiating it
    },
    rightItem: {
      handler() {
        if (this.isCleared) {
          this.list = [];
          return;
        }
        if (this.isFilled) {
          this.generateUnsortedList();
          this.sortBy = "default";
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
v-card {
  margin: 10px;
}
#card-contents {
  text-align: left;
}
#card-contents .v-list {
  display: flex;
}
a,
#index {
  color: #42b983;
  font-weight: bold;
  font-family: courier;
}
.transition-ease-in {
  transition: transform 50ms ease-in-out;
}
v-textarea {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-btn--icon {
  border: 1px solid black;
}
</style>