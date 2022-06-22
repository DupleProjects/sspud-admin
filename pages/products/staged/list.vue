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
        :sortCallbackStaged="sortCallback"
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
import exportModal from "../../../components/dialogs/exportModal.vue";
export default {
  components: { exportModal },
  mixins: [baseMixin,breadcrumbMixin],
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
      sortCriteria: {},
      href: "",
      activeFilter: null
    };
  },
  watch: {
    page(val) {
      this.loadProducts();
      breadcrumbMixin.methods.savePage('stagedList', this.page)
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      var loggedInUser = this.$store.state.auth.user;
      console.log("loggedInUser", loggedInUser);
      // Load Products
      
      const pageInfo = breadcrumbMixin.methods.getPage('stagedList')
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
    async loadProducts(criteria, sortCrit) {
      if (!criteria) {
        criteria = this.criteria;
      } else {
        this.criteria = criteria;
      }

      if (!sortCrit) {
        sortCrit = this.sortCriteria;
      } else {
        this.sortCriteria = sortCrit;
      }
      // Load the products
      const stagedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: criteria ? criteria : { deleted: 0 },
        sortCriteria: sortCrit ? sortCrit : {},
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
        this.activeFilter = filter;
        await this.loadProducts(filter);
      }
    },
    async sortCallback(crit) {
      // Build the where clause
      if (crit) {
        if(this.activeFilter){
          await this.loadProducts(this.activeFilter, crit);
        }else{
          await this.loadProducts(null, crit);
        }
      }
    },
  },
};
</script>

<style scoped>
</style>
