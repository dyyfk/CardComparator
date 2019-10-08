<template>
  <div ref="distribution"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "ordinalDistribution",
  props: ["dis", "v1", "v2"],
  data() {
    return {
      svg: null,
      bar: null
    };
  },
  mounted() {
    console.log(this.$refs.distribution0);
  },
  methods: {
    createDistribution() {
      var color = "steelblue";

      var domain = [...new Set(this.dis)];

      // console.log(domain);

      // var values = d3.range(1000).map(d3.randomNormal(20, 5));
      var values = this.dis;
      if (domain.length > 100) values = values.filter((x, i) => i < 100);

      var domain = [...new Set(values)];

      // console.log(domain);
      // console.log(values);

      // return;

      // A formatter for counts.
      var formatCount = d3.format(",.0f");

      var margin = { top: 20, right: 30, bottom: 30, left: 30 },
        width = 400 - margin.left - margin.right,
        height = 80 - margin.top - margin.bottom;

      var max = d3.max(values);
      var min = d3.min(values);

      var x = d3
        .scaleOrdinal()
        .domain(domain)
        .range([0, width]);

      // var x = d3
      //   .scaleLinear()
      //   .domain([min, max])
      //   .range([0, width]);

      // Generate a histogram using ten uniformly-spaced bins.
      var data = d3.histogram()(values);

      var yMax = d3.max(data, function(d) {
        return d.length;
      });
      var yMin = d3.min(data, function(d) {
        return d.length;
      });

      var colorScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

      var y = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);

      var xAxis = d3.axisBottom(x).tickFormat(function(d) {
        return d;
      });

      var svg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var bar = svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        });

      bar
        .append("rect")
        .attr("x", 1)
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return height - y(d.length);
        })
        .attr("fill", function(d) {
          return colorScale(d.length);
        });

      bar
        .append("text")
        .style("font-size", "12px")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", function(d) {
          return (x(d.x1) - x(d.x0)) / 2;
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
          return formatCount(d.length);
        });

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      this.svg = svg;
      this.bar = bar;
    }
  },
  watch: {
    v1: {
      handler() {
        // if (!this.v1) {
        //   // null value passed
        //   return;
        // }
        // this.bar
        //   .filter(function(d) {
        //     console.log(d.x0);
        //     console.log(this.v1);
        //     return d.x0 < this.v1 && this.v1 < d.x1;
        //   })
        //   .style("fill", "orange");
      },
      immediate: true
    },
    v2: {
      handler() {
        // if (!this.v2) {
        //   // null value passed
        //   return;
        // }
        // this.bar
        //   .filter(function(d) {
        //     console.log(d.x0);
        //     console.log(this.v2);
        //     return d.x0 < this.v2 && this.v2 < d.x1;
        //   })
        //   .style("fill", "orange");
      },
      immediate: true
    },
    dis: {
      handler() {
        this.createDistribution();
      }
    }
  }
};
</script>

<style>
</style>