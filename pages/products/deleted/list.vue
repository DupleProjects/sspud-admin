<template>
  <div class="pa-3">
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
          <h1>Loading Deleted Products</h1>
        </div>
      </v-overlay>
    </client-only>
    <div v-if="!loading">
      <!--Table-->
      <h2>Deleted Products</h2>
      <products-product-list
        :type="'staged'"
        :products="products"
        :allCategories="allCategories"
        :allBrands="allBrands"
        :deleteProductCallBack="deleteProductCallBack"
        :sortCallbackStaged="sortCallback"
        :tableStyle="'height:75vh; overflow-y:auto; overflow-x: hidden;'"
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
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";
export default {
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      productCount: 0,
      products: [],
      allCategories: [],
      allBrands: [],
      sortCriteria: {},
    };
  },
  watch: {
    page(val) {
      this.loadProducts();
      breadcrumbMixin.methods.savePage('deletedList', this.page)
    },
    search(val) {},
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // var loggedInUser = this.$store.state.auth.user
      // Load Products
      const pageInfo = breadcrumbMixin.methods.getPage('deletedList')
      this.page = pageInfo.page
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
    async loadProducts(crit) {
      // Load the products

      if (!crit) {
        crit = this.sortCriteria;
      } else {
        this.sortCriteria = crit;
      }

      const deletedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: {deleted: 1},
        sortCriteria: crit ? crit : {},
        page: this.page,
        numberPerPage: this.numberPerPage,
      });
      if (deletedProducts.count) {
        this.productCount = deletedProducts.count;
      }
      if (deletedProducts.data) {
        this.products = deletedProducts.data;
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
    async sortCallback(crit) {
      // Build the where clause
      if (crit) {
        await this.loadProducts(crit);
      }
    },
  },
};
</script>

<style scoped>
</style>
