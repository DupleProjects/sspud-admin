<template>
  <div class="p-3">
    <div class="card p-3" v-if="publishedProductValue">
      <div class="d-flex justify-content-between">
        <div>
          <h1>{{nonDeletedStagedProducts}}</h1>
          <p class="text-muted"><small>Staged Products</small></p>
        </div>
        <div>
          <h1>{{publishedProducts}}</h1>
          <p class="text-muted"><small>Published Products</small></p>
        </div>
        <div>
          <h1>{{deletedProducts}}</h1>
          <p class="text-muted"><small>Deleted Products</small></p>
        </div>
      </div>
      <p class="lead mb-0">Staged Products Breakdown</p>
      <hr>
      <!--Published-->
      <div class="d-flex my-2">
        <div class="progress-label">
          Published
        </div>
        <v-progress-linear
            v-model="publishedProductValue"
            :color="'#00fc00'"
            class="mx-2 breakdown-progress"
            height="25">
          <strong>{{ (publishedProducts/nonDeletedStagedProducts * 100).toFixed(2) }}%</strong>
        </v-progress-linear>
      </div>
      <!--Review Required-->
      <div class="d-flex my-2">
        <div class="progress-label">
          Review Required
        </div>
        <v-progress-linear
            v-model="reviewProductValue"
            :color="'#ff0000'"
            class="mx-2 breakdown-progress"
            height="25">
          <strong>{{ (reviewRequiredProducts/nonDeletedStagedProducts * 100).toFixed(2) }}%</strong>
        </v-progress-linear>
      </div>
      <!--No Category-->
      <div class="d-flex my-2">
        <div class="progress-label">
          No Category
        </div>
        <v-progress-linear
            v-model="noCategoryProductValue"
            :color="'#cbb700'"
            class="mx-2 breakdown-progress"
            height="25">
          <strong>{{ (noCategoryProducts/nonDeletedStagedProducts * 100).toFixed(2) }}%</strong>
        </v-progress-linear>
      </div>
      <!--No Sub Category-->
      <div class="d-flex my-2">
        <div class="progress-label">
          No Sub Category
        </div>
        <v-progress-linear
            v-model="noSubCategoryProductValue"
            :color="'#cbb700'"
            class="mx-2 breakdown-progress"
            height="25">
          <strong>{{ (noSubCategoryProducts/nonDeletedStagedProducts * 100).toFixed(2) }}%</strong>
        </v-progress-linear>
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
      // Variables
      noCategoryProductValue: 0,
      noSubCategoryProductValue: 0,
      reviewProductValue: 0,
      publishedProductValue: null,
      nonDeletedStagedProducts: 0,
      publishedProducts: 0,
      reviewRequiredProducts: 0,
      noCategoryProducts: 0,
      noSubCategoryProducts: 0,
      deletedProducts: 0,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // All Non-deleted staged product
      const stagedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { deleted: 0 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (stagedProductsCountResponse && stagedProductsCountResponse.data) {
        this.nonDeletedStagedProducts = stagedProductsCountResponse.count;
      }
      // All review required products
      const reviewRequiredProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { reviewRequired: 1, deleted: 0 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (reviewRequiredProductsCountResponse && reviewRequiredProductsCountResponse.data) {
        this.reviewRequiredProducts = reviewRequiredProductsCountResponse.count;
      }
      // Deleted Products
      const deletedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { deleted: 1 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (deletedProductsCountResponse && deletedProductsCountResponse.data) {
        this.deletedProducts = deletedProductsCountResponse.count;
      }
      // Publish products
      const publishedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { publish: 1,deleted: 0 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (publishedProductsCountResponse && publishedProductsCountResponse.data) {
        this.publishedProducts = publishedProductsCountResponse.count;
      }
      // no category products
      const noCategoryStagedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { categoryId: null, deleted: 0 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (noCategoryStagedProductsCountResponse && noCategoryStagedProductsCountResponse.data) {
        this.noCategoryProducts = noCategoryStagedProductsCountResponse.count;
      }
      // no sub category products
      const noSubCategoryStagedProductsCountResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { subCategoryId: null, deleted: 0 },
        tableName: "stagedProducts",
        operation: "read",
        page: 1,
        numberPerPage: 1,
      });
      if (noSubCategoryStagedProductsCountResponse && noSubCategoryStagedProductsCountResponse.data) {
        this.noSubCategoryProducts = noSubCategoryStagedProductsCountResponse.count;
      }
      this.noCategoryProductValue = this.noCategoryProducts/ this.nonDeletedStagedProducts * 100;
      this.noSubCategoryProductValue = this.noSubCategoryProducts/ this.nonDeletedStagedProducts * 100;
      this.reviewProductValue = this.reviewRequiredProducts/ this.nonDeletedStagedProducts * 100;
      this.publishedProductValue = this.publishedProducts/ this.nonDeletedStagedProducts * 100;
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
</style>
