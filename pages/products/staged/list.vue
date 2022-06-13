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
          <h1>Loading Staged Products</h1>
        </div>
      </v-overlay>
    </client-only>
    <!--Header-->
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mx-3">
      <h1 class="h2">Staged Products</h1>
      <!--Search would be here-->

      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <export-modal :products="products" :exportTableName="'stagedProducts'" :exportSheetName="'Staged Products'" :exportCriteria="null" />
        </div>
      </div>
    </div>
    <hr class="mt-0 mb-2 mx-3">
    <div v-if="!loading">
      <!--Filter-->
      <products-product-list-filter
        :filterChangeCallBack="filterChangeCallBack"
        :filter="filter"
        :type="'staged'"
      />
      <!--Table-->
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
import exportModal from "../../../components/dialogs/exportModal.vue";
export default {
  components: { exportModal },
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 15,
      filter: {},
      productCount: 0,
      products: [],
      allCategories: [],
      allBrands: [],
      // Current criteria
      criteria: { deleted: 0, publish: 0 },
      href: "",
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
      var loggedInUser = this.$store.state.auth.user;
      console.log("loggedInUser", loggedInUser);
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
      if (!criteria) {
        criteria = this.criteria;
      }
      // Load the products
      const stagedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: criteria ? criteria : { deleted: 0 },
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
      console.log("filter", filter);
      // Build the where clause
      if (filter) {
        await this.loadProducts(filter);
      }
    },
  },
};
</script>

<style scoped>
</style>
