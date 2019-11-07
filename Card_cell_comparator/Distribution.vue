<template></template>

<script>
import * as d3 from "d3";

export default {
  name: "Distribution",
  props: ["values", "descriptor"],
  data() {
    return {};
  },
  mounted() {
    this.createDistribution();
  },
  methods: {
    createDistribution() {
      if (
        !this.descriptor ||
        !this.descriptor.histogram ||
        !this.descriptor.bucketName
      ) {
        return;
      }

      if (
        this.descriptor.histogram.length === this.descriptor.bucketName.length
      ) {
        this.createOrdinalChart();
      } else {
        this.createNumericalChart();
      }
    },
    createOrdinalChart() {
      if (this.descriptor.bucketName.length > 50) {
        console.error(
          `${this.descriptor.name} has ${this.descriptor.bucketName.length} buckets,
            maximum threshold to fit on the screen is 50`
        );
        return;
      }

      let domain = [];
      let data = [];
      for (let i = 0; i < this.descriptor.histogram.length; i++) {
        let name = this.descriptor.bucketName[i];
        let value = this.descriptor.histogram[i];
        let obj = {};
        obj["value"] = value;
        obj["name"] = name;
        data.push(obj);
        domain.push(name);
      }

      let color = "steelblue";
      let margin = { top: 40, right: 0, bottom: 50, left: 50 },
        width = 400 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;
      let x = d3
        .scaleBand()
        .rangeRound([0, width])
        .domain(domain)
        .padding(0.1);

      let binIndexArr = [];
      if (this.descriptor.indices) {
        // Users provide the indicator function
        for (let i = 0; i < this.values.length; i++) {
          let index = this.descriptor.indices(this.values[i]);
          binIndexArr.push(index);
        }
      } else {
        // Default to find the binIndex
        for (let i = 0; i < this.values.length; i++) {
          let value = this.values[i];
          let index = 0;

          data.forEach((e, j) => {
            if (e.name === value) index = j;
          });
          binIndexArr.push(index);
        }
      }

      let yMin = Math.min(...data.map(e => e.value));
      let yMax = Math.max(...data.map(e => e.value));

      let colorScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
      let y = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);
      let xAxis = d3.axisBottom(x).tickFormat(function(d) {
        return d;
      });

      let svg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let tooltip = d3
        .select(this.$el)
        .append("div")
        .attr("class", "tooltip")
        // .style("display", "inline-block")
        .style("background", "#f4f4f4")
        .style("padding", "5 15px")
        .style("border", "1px #333 solid")
        .style("border-radius", "5px")
        .style("opacity", 0);

      let bar = svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
          return "translate(" + x(d.name) + "," + y(d.value) + ")";
        });

      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("class", "marker")
        .attr("d", "M0,-5L10,0L0,5");

      let binIndexMap = new Array(data.length).fill(0);

      // let binIndexArr = [binIndex1, binIndex2, binIndex3];
      binIndexArr.forEach(e => (binIndexMap[e] += 1));

      let div = svg.selectAll("line.arrow");
      let arrowDiv = svg.selectAll("arrow");
      binIndexMap.forEach((e, index) => {
        for (let j = 0; j < e; j++) {
          div
            .data(
              data.filter(function(d, i) {
                return i === index;
              })
            )
            .enter()
            .append("line")
            .attr("class", "arrow")
            .attr("x1", function(d, i) {
              return x(d.name) + 5;
            })
            .attr("x2", function(d, i) {
              return x(d.name) + 5;
            })
            .attr("y1", function(d) {
              return y(d.value) - 40 - j * 8;
            })
            .attr("y2", function(d) {
              return y(d.value) - 10 - j * 8;
            })
            .attr("marker-end", "url(#arrow)");
        }
      });

      for (let j = binIndexArr.length - 1; j >= 0; j--) {
        let binIndex = binIndexArr[j];
        let offset = --binIndexMap[binIndex];
        arrowDiv
          .data(
            data.filter(function(d, i) {
              return i === binIndex;
            })
          )
          .enter()
          .append("text")
          .attr("class", "label")
          .style("font-size", "10px")
          .attr("x", function(d) {
            return x(d.name) + 15;
          })
          .attr("y", function(d) {
            return y(d.value) - 5 - offset * 8;
          })
          .attr("class", "barsEndlineText")
          .attr("text-anchor", "middle")
          .text(j + 1);
      }

      bar
        .append("rect")
        .attr("x", 1)
        .attr("width", function(d) {
          return x.bandwidth();
        })
        .attr("height", function(d) {
          return height - y(d.value);
        })
        .attr("fill", function(d, i) {
          return colorScale(d.value);
        })
        .on("mouseover", function(d) {
          tooltip.transition().style("opacity", 1);
          tooltip
            .html(`${d.name}: ${d.value}`)
            .style("left", d3.event.pageX - 20 + "px")
            .style("top", d3.event.pageY - 30 + "px");
          d3.select(this).style("opacity", 0.5);
        })
        .on("mouseout", function(d) {
          tooltip.transition().style("opacity", 0);
          d3.select(this).style("opacity", 1);
        });

      svg
        .append("g")
        .attr("class", "axis")
        .call(
          d3
            .axisLeft(y)
            .ticks(3)
            .tickFormat(d3.format(".0s"))
        );

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    },

    createNumericalChart() {
      if (this.descriptor.bucketName.length > 200) {
        console.error(
          `${this.descriptor.bucket} has ${this.descriptor.bucketName.length} buckets,
            maximum threshold to fit on the screen is 200, consider to map the string to string length to reduce bucket numbers`
        );
        return;
      }

      let buckets = [];

      for (let i = 1; i < this.descriptor.bucketName.length; i++) {
        let obj = {};
        obj.offset = this.descriptor.bucketName[i - 1];
        obj.y = this.descriptor.histogram[i - 1];
        obj.width = this.descriptor.bucketName[i] - obj.offset;

        obj.height = obj.y / obj.width;

        if (obj.width !== 0) buckets.push(obj);
        // If the width is infinity, the height would be infinity.
      }

      let color = "steelblue";
      let formatCount = d3.format(",.0f");

      let margin = { top: 40, right: 0, bottom: 50, left: 50 },
        width = 400 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

      let binIndexArr = [];
      if (this.descriptor.indices) {
        // Users provide the indicator function
        for (let i = 0; i < this.values.length; i++) {
          let index = this.descriptor.indices(this.values[i]);
          binIndexArr.push(index);
        }
      } else {
        for (let j = 0; j < this.values.length; j++) {
          let value = this.values[j];
          let index;

          for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].offset > value) {
              index = i;
              break;
            }
          }
          binIndexArr.push(index);
        }
      }
      let max =
        buckets[buckets.length - 1].offset + buckets[buckets.length - 1].width;
      let min = buckets[0].offset;

      let x = d3.scaleLinear().range([0, width]);
      let y = d3.scaleLinear().range([height, 0]);

      let yMax = d3.max(buckets, function(d) {
        return d.y;
      });
      let yMin = d3.min(buckets, function(d) {
        return d.y;
      });
      x.domain([min, max]);
      y.domain([
        0,
        d3.max(
          buckets.map(function(d) {
            return d.height;
          })
        )
      ]);

      let colorScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

      let xAxis = d3.axisBottom(x).tickFormat(function(d) {
        return d;
      });

      let tooltip = d3
        .select(this.$el)
        .append("div")
        .attr("class", "tooltip")
        // .style("display", "inline-block")
        .style("background", "#f4f4f4")
        .style("padding", "5 15px")
        .style("border", "1px #333 solid")
        .style("border-radius", "5px")
        .style("opacity", 0);

      let svg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("class", "marker")
        .attr("d", "M0,-5L10,0L0,5");

      let binIndexMap = new Array(buckets.length).fill(0);

      // let binIndexArr = [binIndex1, binIndex2, binIndex3];

      binIndexArr.forEach(e => (binIndexMap[e] += 1));

      let div = svg.selectAll("line.arrow");
      let arrowDiv = svg.selectAll("arrow");

      binIndexMap.forEach((e, index) => {
        for (let j = 0; j < e; j++) {
          div
            .data(
              buckets.filter(function(d, i) {
                return i === index;
              })
            )
            .enter()
            .append("line")
            .attr("class", "arrow")
            .attr("x1", function(d, i) {
              return x(d.offset) + 5;
            })
            .attr("x2", function(d, i) {
              return x(d.offset) + 5;
            })
            .attr("y1", function(d) {
              return y(d.height) - 40 - j * 8;
            })
            .attr("y2", function(d) {
              return y(d.height) - 5 - j * 8;
            })

            .attr("marker-end", "url(#arrow)");
        }
      });

      for (let j = binIndexArr.length - 1; j >= 0; j--) {
        let binIndex = binIndexArr[j];
        let offset = --binIndexMap[binIndex];
        arrowDiv
          .data(
            buckets.filter(function(d, i) {
              return i === binIndex;
            })
          )
          .enter()
          .append("text")
          .attr("class", "label")
          .style("font-size", "10px")
          .attr("x", function(d) {
            return x(d.offset) + 15;
          })
          .attr("y", function(d) {
            return y(d.height) - offset * 8;
          })
          .attr("class", "barsEndlineText")
          .attr("text-anchor", "middle")
          .text(j + 1);
      }

      let bar = svg
        .selectAll(".bar")
        .data(buckets)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
          return "translate(" + x(d.offset) + "," + y(d.height) + ")";
        });

      bar
        .append("rect")
        .attr("x", 1)
        .attr("width", function(d) {
          return x(d.width + d.offset) - x(d.offset) - 1;
        })
        .attr("height", function(d) {
          return height - y(d.height);
        })
        .attr("fill", function(d, i) {
          return colorScale(d.y);
        })
        .on("mouseover", function(d) {
          tooltip.transition().style("opacity", 1);
          tooltip
            .html(`[${d.offset}, ${d.offset + d.width}): ${d.y}`)
            .style("left", d3.event.pageX - 20 + "px")
            .style("top", d3.event.pageY - 30 + "px");
          d3.select(this).style("opacity", 0.5);
        })
        .on("mouseout", function(d) {
          tooltip.transition().style("opacity", 0);
          d3.select(this).style("opacity", 1);
        });

      // bar
      //   .append("text")
      //   .style("font-size", "12px")
      //   .attr("dy", ".75em")
      //   .attr("y", -12)
      //   .attr("x", function(d) {
      //     return x(d.width) / 2;
      //   });

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      svg
        .append("g")
        .attr("class", "axis")
        .call(
          d3
            .axisLeft(y)
            .ticks(3)
            .tickFormat(d3.format(".0s"))
        );
    }
  },
  watch: {
    values() {
      d3.select(this.$el).html(null); // new value passed in, clear the graph
      this.createDistribution(); // redraw the graph
    }
  }
};
</script>

<style>
.axis {
  font: 12px sans-serif;
}
</style>