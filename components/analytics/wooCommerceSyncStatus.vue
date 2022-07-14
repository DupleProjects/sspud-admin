<template>
  <div class="p-3">
    <div class="confluence-card p-3">
      <p class="lead mb-0">Category Breakdown</p>
      <hr>
      <div class="d-flex justify-content-between">
        <div class="chart-container">
          <charts-pie-chart  v-if="productChartData.datasets[0].data.length > 0" :chartdata="productChartData" :options="productChartOptions" :name="'Products'" />
        </div>
        <div class="chart-container">
          <charts-pie-chart  v-if="categoryChartData.datasets[0].data.length > 0" :chartdata="categoryChartData" :options="categoryChartOptions" :name="'Products'" />
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
      category: null,
      stagedProductsCount: null,
      stagedPublishProductsCount: null,
      stagedDeletedProductsCount: null,
      stagedPublishProductsFraction: null,
      stagedProductsFraction: null,
      deletedProductsFraction: null,
      categoryChartData: {
        labels: ['SSPUD Published', 'Woo Commerce'],
        datasets: [
          {
            backgroundColor: ['#00D8FF', '#41B883'],
            data: []
          }
        ]
      },
      categoryChartOptions: {
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
      progressData: []
    };
  },
  async mounted() {
    await this.loadProductCategory();
    await this.loadProductData();
    await this.loadLinkedData();
  },
  methods: {
    async loadProductCategory() {
      // Load category
      const categoryResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
        whereCriteria: { id: this.categoryId },
      });
      if (categoryResponse && categoryResponse.data) {
        this.category = categoryResponse.data[0];
      }
    },
    async loadProductData() {
      // All category staged products
      const stagedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { deleted: 0, publish: 1 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (stagedProductsCountResponse && stagedProductsCountResponse.data) {
        this.stagedProductsCount = stagedProductsCountResponse.count;
      }
      const wooCommerceResponse = await this.$store.dispatch("callMiddlewareRoute", {
        route: 'products/wooCommerceProductReport'
      });
      console.log('wooCommerceResponse', wooCommerceResponse)
    },
    async loadLinkedData() {
      if (this.category) {
        //
        const data = [];
        for (let i = 0; i < this.linkedCategories.length; i++) {
          // All linked categories
          const stagedProductsCountResponse = await this.$store.dispatch("dataGate", {
            whereCriteria: this.linkedCategories[i].parentId ? { subCategoryId: this.linkedCategories[i].id, deleted: 0 } : { categoryId: this.linkedCategories[i].id, publish: 0 },
            tableName: "stagedProducts",
            operation: "read",
            page: 1,
            numberPerPage: 1,
          });
          if (stagedProductsCountResponse && stagedProductsCountResponse.data) {
            const fraction = (stagedProductsCountResponse.count / this.totalProducts * 100).toFixed(2);
            data.push(
                {
                  name: this.linkedCategories[i].name,
                  count: stagedProductsCountResponse.count,
                  fraction
                }
            )
          }
        }
        console.log('data', data)
        this.progressData = data;
      }
    },
  },
};
</script>

<style scoped>
.progress-label {
  flex: 1;
}
.breakdown-progress {
  flex: 4;
}
.chart-container {
  flex: 1;
}
.progress-container {
  flex: 1;

}
</style>
