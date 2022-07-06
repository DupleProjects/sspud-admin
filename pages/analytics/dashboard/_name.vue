<template>
  <div class="pa-3">
    <h1>Hallo World!</h1>
    <div style="height: 70vh;" v-if="!loading">
      <charts-bar-chart :chartdata="chartData" :options="options" :name="'Products'" />
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      chartData: {
        labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
        datasets: [{
          data: [86,114,106,106,107,111,133,221,783,2478],
          label: "Africa",
          borderColor: "#3e95cd",
          fill: false
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        name: "Products"
      },
    };
  },
  watch: {
    page(val) {},
    search(val) {},
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // console.log(this.$route.params.id);
      console.log('this.$route.params', this.$route.params)
      if (this.$route.params.name) {
        // Load all the categories so that the parent can still be chosen
        const processLogResponse = await this.$store.dispatch("dataGate", {
          tableName: "processLogs",
          operation: "read",
          whereCriteria: {name: this.$route.params.name},
          sortCriteria: {dateTime: 'asc'}
        });
        console.log('processLogResponse', processLogResponse);
        if (processLogResponse.data) {
          // this.categories = processLogResponse.data;
          const newData = {
            labels: [],
            datasets: [
                {
                  data: [],
                  label: "Duration",
                  borderColor: "#009bff",
                  fill: false,
                  fillColor: "rgb(0,166,255)", //version >2 useus background color
                  strokeColor: "blue",
                }
            ]
          };
          for (let i = 0; i < processLogResponse.data.length; i++) {
            if (processLogResponse.data[i].duration) {
              newData.datasets[0].data.push(Number(processLogResponse.data[i].duration) / 1000);
              newData.labels.push(processLogResponse.data[i].dateTime);
            }
          }
          console.log('newData', newData)
          this.chartData = newData;
          this.loading = false;
        }
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {

  },
};
</script>

<style scoped>
.linked-components {
  margin-top: 30px;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.category-fields {
  max-width: 600px;
}

.category-subcards {
  height: 185px;
  width:100%;
  margin-left: auto;
  margin-right: auto;
}

.category-subcard-text {
  text-align: center;
}

.card-title-style{
  background-color:#52bdfa;
  color:white;
}
</style>
