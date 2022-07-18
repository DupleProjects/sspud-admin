<template>
  <div class="p-3">
    <div class="confluence-card p-3">
      <div class="header-style">
        <p class="lead mb-0"><strong>Category Breakdown</strong></p>
      </div>
      <hr class="header-hr">
      <div class="d-flex justify-content-between">
        <div v-if="totalProducts" class="w-100 progress-container d-flex flex-column justify-content-center">
          <!--Staged Products-->
          <p v-if="progressData.length > 0" class="text-muted">*Non deleted</p>
          <div
              v-for="(dataPoint, index) of progressData"
              :key="index"
              class="d-flex my-2">
            <div class="progress-label">
              {{dataPoint.name}}
            </div>
            <v-progress-linear
                v-model="dataPoint.fraction"
                :color="'#1e52ff'"
                class="mx-2 breakdown-progress"
                height="25">
              <strong>{{ dataPoint.count }}</strong>
            </v-progress-linear>
          </div>
          <div class="text-center" v-if="progressData.length === 0">
            <v-icon
                large
                color="warning"
                dark>
              mdi-alert
            </v-icon>
            <p class="lead">No Categories Linked</p>
          </div>
        </div>
        <div class="chart-container">
          <charts-pie-chart  v-if="chartData.datasets[0].data.length > 0" :chartdata="chartData" :options="chartOptions" :name="'Products'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    categoryId: null,
    linkedCategories: []
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
      chartData: {
        labels: ['Staged Products', 'Deleted Products', 'Published Products'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#DD1B16', '#00D8FF'],
            data: []
          }
        ]
      },
      chartOptions: {
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
      if (this.category) {
        // All category staged products
        const stagedProductsCountResponse = await this.$store.dispatch("dataGate", {
          whereCriteria: this.category.parentId ? { subCategoryId: this.category.id, deleted: 0, publish: 0 } : { categoryId: this.category.id, deleted: 0, publish: 0 },
          tableName: "stagedProducts",
          operation: "read",
          page: 1,
          numberPerPage: 1,
        });
        if (stagedProductsCountResponse && stagedProductsCountResponse.data) {
          this.stagedProductsCount = stagedProductsCountResponse.count;
        }
        // All category published products
        const stagedPublishProductsCountResponse = await this.$store.dispatch("dataGate", {
          whereCriteria: this.category.parentId ? { subCategoryId: this.category.id, deleted: 0, publish: 1 } : { categoryId: this.category.id, deleted: 0, publish: 1 },
          tableName: "stagedProducts",
          operation: "read",
          page: 1,
          numberPerPage: 1,
        });
        if (stagedPublishProductsCountResponse && stagedPublishProductsCountResponse.data) {
          this.stagedPublishProductsCount = stagedPublishProductsCountResponse.count;
        }
        // All category deleted products
        const stagedDeletedProductsCountResponse = await this.$store.dispatch("dataGate", {
          whereCriteria: this.category.parentId ? { subCategoryId: this.category.id, deleted: 1 } : { categoryId: this.category.id, deleted: 1 },
          tableName: "stagedProducts",
          operation: "read",
          page: 1,
          numberPerPage: 1,
        });
        if (stagedDeletedProductsCountResponse && stagedDeletedProductsCountResponse.data) {
          this.stagedDeletedProductsCount = stagedDeletedProductsCountResponse.count;
        }
        this.chartData.datasets[0].data = [
          this.stagedProductsCount,
          this.stagedDeletedProductsCount,
          this.stagedPublishProductsCount
        ];
        this.totalProducts = this.stagedProductsCount + this.stagedDeletedProductsCount + this.stagedPublishProductsCount;
        // Work out percentages
        this.stagedPublishProductsFraction = (this.stagedPublishProductsCount / this.totalProducts * 100).toFixed(2)
        this.stagedProductsFraction = (this.stagedProductsCount / this.totalProducts * 100).toFixed(2)
        this.deletedProductsFraction = (this.stagedDeletedProductsCount / this.totalProducts * 100).toFixed(2)

      }
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
.header-style {
  color: #1976d2 !important;
}

.header-hr {
  color: #1976d2 !important;
}
</style>
