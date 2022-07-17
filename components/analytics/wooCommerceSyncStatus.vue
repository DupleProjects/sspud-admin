<template>
  <div class="p-3">
    <div class="confluence-card p-3">
      <p class="lead mb-0">Woo Commerce Sync Status</p>
      <hr>
      <div class="d-flex justify-content-around" v-if="!loading">
        <div
            v-bind:class="{ 'error-warning' : stagedProductsCount !== wcProductsCount}"
            class="chart-container">
          <div class="text-center m-3">
            <img
                v-if="stagedProductsCount !== wcProductsCount"
                :src="require(`assets/images/alarm.png`)"
                alt="image"
                class="alarm-image"
            />
          </div>
          <charts-pie-chart
              v-if="productChartData.datasets[0].data.length > 0"
              :chartdata="productChartData"
              :options="productChartOptions"
              :name="'Products'" />
          <div class="text-center mt-2">
            <v-alert
                v-if="stagedProductsCount !== wcProductsCount"
                style="font-size: small; margin-bottom: 0 !important;"
                dense
                color="error"
                text>
              <strong>Warning!</strong> The amount of published products on SSPUD and those on the Woo Commerce site do not match
            </v-alert>
          </div>
        </div>
        <div
            v-bind:class="{ 'error-warning' : sspudCount !== wcOrderCount}"
            class="chart-container">
          <div class="text-center m-3">
            <img
                v-if="stagedProductsCount !== wcProductsCount"
                :src="require(`assets/images/alarm.png`)"
                alt="image"
                class="alarm-image"
            />
          </div>
          <charts-pie-chart
              v-if="orderChartData.datasets[0].data.length > 0"
              :chartdata="orderChartData"
              :options="orderChartOptions"
              :name="'Orders'" />
          <div class="text-center mt-2">
            <v-alert
                v-if="stagedProductsCount !== wcProductsCount"
                style="font-size: small; margin-bottom: 0 !important;"
                dense
                color="error"
                text>
              <strong>Warning!</strong> The amount of orders on SSPUD and those on the Woo Commerce site do not match
            </v-alert>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column justify-content-center" v-if="loading">
        <div class="d-flex justify-content-center">
          <v-progress-circular
              :size="50"
              indeterminate
              color="primary"
          ></v-progress-circular>
          <h2>Loading</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {

  },
  data() {
    return {
      loading: true,
      stagedProductsCount: null,
      wcProductsCount: null,
      productPublishDifferenceCount: null,
      orderChartData: {
        labels: ['SSPUD Orders', 'Woo Commerce Orders'],
        datasets: [
          {
            backgroundColor: ['#00D8FF', '#41B883'],
            data: []
          }
        ]
      },
      orderChartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      productChartData: {
        labels: ['SSPUD Published', 'Woo Commerce'],
        datasets: [
          {
            backgroundColor: ['#00D8FF', '#41B883'],
            data: []
          }
        ]
      },
      productChartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      totalProducts: null,
      sspudCount: null,
      wcOrderCount: null,
      progressData: []
    };
  },
  async mounted() {
    await this.loadProductData();
    await this.loadOrderData();
    this.loading = false;
  },
  methods: {
    async loadProductData() {
      const wooCommerceResponse = await this.$store.dispatch("callMiddlewareRoute", {
        route: 'products/wooCommerceProductReport'
      });
      console.log('wooCommerceResponse', wooCommerceResponse)
      this.productPublishDifferenceCount = wooCommerceResponse.wcDifferenceIds.length;
      this.wcProductsCount = wooCommerceResponse.wcProductCount;
      // All category staged products
      const stagedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { deleted: 0, publish: 1 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      console.log('stagedProductsCountResponse', stagedProductsCountResponse)
      if (stagedProductsCountResponse && stagedProductsCountResponse.data) {
        this.stagedProductsCount = stagedProductsCountResponse.count;
      }
      // Add to chart
      this.productChartData.datasets[0].data = [this.stagedProductsCount, this.wcProductsCount];
    },
    async loadOrderData() {
      const wooCommerceResponse = await this.$store.dispatch("callMiddlewareRoute", {
        route: 'orders/wooCommerceOrderReport'
      });
      console.log('wooCommerceResponse', wooCommerceResponse)
      this.sspudCount = wooCommerceResponse.sspudCount;
      this.wcOrderCount = wooCommerceResponse.wcOrderCount;
      // Add to chart
      this.orderChartData.datasets[0].data = [this.sspudCount, this.wcOrderCount];
    },
  },
};
</script>

<style scoped>
.error-warning {
  color: red !important;
  box-shadow: rgb(211 18 18 / 55%) 0px 1px 5px 2px !important;
}
.alarm-image {
  height: 40px;
  width: auto;
}
</style>
