<template>
  <div class="pa-3">
    <client-only>
      <v-overlay
          style="height: 80vh; margin-top: -60px"
          :value="loading"
          color="transparent"
          z-index="5"
          absolute
          opacity="1">
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
    <!--Header-->
    <div v-if="!loading">
      <product-list-filter
        :filterChangeCallBack="filterChangeCallBack"
        :filter="filter"
        :heading="'Published Products'"
        :type="'staged'"
      />
      <products-product-list
          :type="'published'"
          :allCategories="allCategories"
          :allBrands="allBrands"
          :products="products"
          :sortCallbackStaged="sortCallback"
          :tableStyle="'height:70vh; overflow-y:auto; overflow-x: hidden;'" />
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
          <export-modal :products="products" :exportTableName="'stagedProducts'" :exportSheetName="'Published Products'" :exportCriteria="{publish:1,deleted:0}" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";
import exportModal from "../../../components/dialogs/exportModal.vue";
import ProductListFilter from '../../../components/products/productListFilter.vue';
export default {
  components: { exportModal, ProductListFilter },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      filter: {},
      loading: false,
      page: 1,
      numberPerPage: 20,
      productCount: 0,
      products: [],
      allCategories: [],
      allBrands: [],
      sortCriteria: {},
      activeFilter: null
    }
  },
  watch: {
    page(val) {
      this.loadProducts()
      breadcrumbMixin.methods.savePageAndFilter('publishedList', {page: this.page, filter: this.activeFilter, sort: this.sortCriteria});
    },
    search(val) {

    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // Set page and filter from session
      const pageInfo = breadcrumbMixin.methods.getPageWithSort('publishedList');
      this.page = pageInfo.pagination.page;
      this.activeFilter = pageInfo.filter;
      this.filter = pageInfo.filter;
      this.sortCriteria = pageInfo.sort;
      // Load Products
      await this.loadProducts(this.activeFilter, this.sortCriteria);
      await this.loadCategoriesAndBrands();
      this.loading = false;
    })
  },
  unmounted() {
    this.$nextTick(async function () {
    })
  },
  methods: {
    // Loading stuff
    async loadProducts(criteria, sortCrit) {
      if (!criteria) {
        criteria = this.criteria;
      }else{
        criteria.deleted = 0
        criteria.publish = 1
      }

      if (!sortCrit) {
        sortCrit = this.sortCriteria;
      } else {
        this.sortCriteria = sortCrit;
      }
      // Load the products
      const scrapedProducts = await this.$store.dispatch('dataGate', {
        tableName: 'stagedProducts',
        operation: 'read',
        whereCriteria: criteria ? criteria : {deleted: 0, publish: 1},
        sortCriteria: sortCrit ? sortCrit : {},
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      if (scrapedProducts.count) {
        this.productCount = scrapedProducts.count;
      }
      if (scrapedProducts.data) {
        this.products = scrapedProducts.data;
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
    async filterChangeCallBack(filter) {
      // Build the where clause
      if (filter) {
        this.activeFilter = filter;
        breadcrumbMixin.methods.savePageAndFilter('publishedList', {page: this.page, filter: this.activeFilter, sort: this.sortCriteria});
        await this.loadProducts(filter);
      }
    },
    async sortCallback(crit) {
      // Build the where clause
      if (crit) {
        if(this.activeFilter){
          breadcrumbMixin.methods.savePageAndFilter('publishedList', {page: this.page, filter: this.activeFilter, sort: crit});
          await this.loadProducts(this.activeFilter, crit);
        }else{
          await this.loadProducts(null, crit);
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
