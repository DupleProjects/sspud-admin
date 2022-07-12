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
      <!--Header-->
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mx-3">
        <h4 class="">
          Deleted Products
          <v-chip
              class="ma-2"
              color="primary"
              label>
            <v-icon left>
              mdi-counter
            </v-icon>
            {{productCount}}
          </v-chip>
        </h4>
        <!--Filter-->
        <products-product-list-filter
            v-if="filter"
            :filterChangeCallBack="filterChangeCallBack"
            :filter="filter"
            :type="'staged'"/>
      </div>
      <hr class="mt-0 mb-2 mx-3">
      <!--Table-->
      <products-product-list
        :type="'staged'"
        :products="products"
        :allCategories="allCategories"
        :allBrands="allBrands"
        :deleteProductCallBack="deleteProductCallBack"
        :sortCallbackStaged="sortCallback"
        :tableStyle="'height:80vh; overflow-y:auto; overflow-x: hidden;'"
      />
      <!--Pagination-->
      <template>
        <div class="d-flex justify-content-between">
          <div></div>
          <v-pagination
            color="primary"
            v-model="page"
            :length="Math.ceil(this.productCount / this.numberPerPage)"
            :total-visible="7"
          ></v-pagination>
          <export-modal :products="products" :exportTableName="'stagedProducts'" :exportSheetName="'Staged Products'" :exportCriteria="null" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";
import exportModal from "@/components/dialogs/exportModal";
export default {
  components: { exportModal },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      filter: {},
      productCount: 0,
      products: [],
      allCategories: [],
      criteria: { deleted: 1 },
      allBrands: [],
      sortCriteria: {},
      activeFilter: null
    };
  },
  watch: {
    page(val) {
      this.loadProducts();
      breadcrumbMixin.methods.savePageAndFilter('deletedList', {page: this.page, filter: this.activeFilter, sort: this.sortCriteria});
    },
    search(val) {},
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      const pageInfo = breadcrumbMixin.methods.getPageWithSort('deletedList');
      if (pageInfo.pagination) {
        this.page = pageInfo.pagination.page;
      }
      if (pageInfo.filter) {
        this.filter = pageInfo.filter;
        this.activeFilter = pageInfo.filter;
      }
      if (pageInfo.sort) {
        this.sortCriteria = pageInfo.sort;
      }
      // Load Products
      await this.loadProducts(this.activeFilter, this.sortCriteria);
      await this.loadCategoriesAndBrands();
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    // Loading stuff
    async loadProducts(criteria, sortCriteria) {
      if (!criteria) {
        criteria = this.criteria;
      } else {
        this.criteria = criteria;
      }
      // Load the products

      if (!sortCriteria) {
        sortCriteria = this.sortCriteria;
      } else {
        this.sortCriteria = sortCriteria;
      }

      const deletedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: criteria ? criteria : { deleted: 1 },
        sortCriteria: sortCriteria ? sortCriteria : {},
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
    async filterChangeCallBack(filter) {
      // Build the where clause
      if (filter) {
        this.activeFilter = filter;
        breadcrumbMixin.methods.savePageAndFilter('deletedList', {page: this.page, filter: this.activeFilter, sort: this.sortCriteria});
        await this.loadProducts(filter);
      }
    },
    async sortCallback(crit) {
      // Build the where clause
      if (crit) {
        if (this.activeFilter) {
          breadcrumbMixin.methods.savePageAndFilter('deletedList', {page: this.page, filter: this.activeFilter, sort: crit});
          await this.loadProducts(this.activeFilter, crit);
        } else {
          await this.loadProducts(null, crit);
        }
      }
    },
  },
};
</script>

<style scoped>
</style>
