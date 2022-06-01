<template>
  <div>
    <client-only>
      <v-overlay
        style="height: 80vh; margin-top: -60px"
        :value="loading"
        color="transparent"
        z-index="5"
        absolute
        opacity="1"
      >
        <div class="text-center">
          <v-progress-circular
            :size="70"
            :width="7"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <h1>Loading Scraped Products</h1>
        </div>
      </v-overlay>
    </client-only>
    <div v-if="!loading">
      <!--Table-->
      <h2>Staged Products</h2>
      <!--Filter-->
      <products-product-list-filter :filterChangeCallBack="filterChangeCallBack" :filter="filter" :type="'staged'" />
      <products-product-list
        :type="'staged'"
        :products="products"
        :allCategories="allCategories"
        :allBrands="allBrands"
        :deleteProductCallBack="deleteProductCallBack"
      />
      <!--Pagination-->
      <template>
        <div class="text-end">
          <v-pagination
            color="primary"
            v-model="page"
            :length="Math.ceil(this.productCount / this.numberPerPage)"
            :total-visible="7"
          ></v-pagination>
        </div>
      </template>
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
      page: 1,
      numberPerPage: 20,
      filter: {},
      productCount: 0,
      products: [],
      allCategories: [],
      allBrands: [],
    };
  },
  watch: {
    page(val) {
      this.loadProducts();
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      var loggedInUser = this.$store.state.auth.user
      console.log('loggedInUser', loggedInUser)
      // Load Products
      await this.loadProducts();
      await this.loadCategoriesAndBrands();
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    // Loading stuff
    async loadProducts(criteria) {
      // Load the products
      const stagedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: criteria ? criteria : {deleted: 0},
        page: this.page,
        numberPerPage: this.numberPerPage,
      });
      if (stagedProducts.count) {
        this.productCount = stagedProducts.count;
      }
      if (stagedProducts.data) {
        this.products = stagedProducts.data;
      }
    },
    async loadCategoriesAndBrands() {
      const categories = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });

      if (categories.data) {
        this.allCategories = categories.data;
      }

      const brands = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });

      if (brands.data) {
        this.allBrands = brands.data;
      }
    },
    async deleteProductCallBack() {
      await this.loadProducts();
    },
    async filterChangeCallBack(filter) {
      // Build the where clause
      if (filter) {
        const criteria = {
          deleted: 0
        }
        if (filter.name) {
          criteria.name = { like: filter.name }
        }
        if (filter.categoryId) {
          criteria.categoryId = filter.categoryId;
        }
        if (filter.subCategoryId) {
          criteria.subCategoryId = filter.subCategoryId;
        }
        if (filter.brandId) {
          criteria.brandId = filter.brandId;
        }
        await this.loadProducts(criteria);
      }

    }
  },
};
</script>

<style scoped>
</style>
