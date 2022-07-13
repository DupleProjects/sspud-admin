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
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mx-3">
      <h4 class="">
        Scraped Products
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
      <product-list-filter
          v-if="filter && !loading"
          :filter="filter"
          :filterChangeCallBack="filterChangeCallBackScraped"
          :type="'scraped'"
      />
    </div>
    <!--Filter-->
    <div v-if="!loading">
      <!--Table-->
      <products-product-list
          :type="'scraped'"
          :products="products"
          :canDelete="false"
          :sortCallback="sortCallback"
          :shops="allShops"
          :tableStyle="'height:80vh; overflow-y:auto; overflow-x: hidden;'" />
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
          <export-modal :products="products" :exportTableName="'scrapedProducts'" :exportSheetName="'Scraped Products'" />
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
import ScrapedProductListFilter from '../../../components/products/scrapedProductListFilter.vue';
export default {
  components: { exportModal, ProductListFilter, ScrapedProductListFilter },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: true,
      page: 1,
      numberPerPage: 20,
      productCount: 0,
      products: [],
      sortCriteria: {},
      filter: {},
      criteria: {},
      allShops: []
    }
  },
  watch: {
    page(val) {
      this.loadProducts();
      breadcrumbMixin.methods.savePageAndFilter('scrapedList', {page: this.page, filter: this.filter, sort: this.sortCriteria});
    },
    search(val) {

    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // var loggedInUser = this.$store.state.auth.user
      // Load Products
      const pageInfo = breadcrumbMixin.methods.getPageWithSort('scrapedList');
      if (pageInfo.pagination) {
        this.page = pageInfo.pagination.page;
      }
      if (pageInfo.filter) {
        this.filter = pageInfo.filter;
      }
      if (pageInfo.sort) {
        this.sortCriteria = pageInfo.sort;
      }
      await this.loadProducts(this.sortCriteria, this.filter);
      const shopsReturn = await this.$store.dispatch('dataGate', {
        tableName: 'shops',
        operation: 'read',
      });
      if(shopsReturn.data){
        this.allShops = shopsReturn.data
      }
      this.loading = false;
    })
  },
  unmounted() {
    this.$nextTick(async function () {
    })
  },
  methods: {
    // Loading stuff
    async loadProducts(crit, filter) {
      // this.loading = true
      if (!filter) {
        filter = this.criteria;
      } else {
        this.criteria = filter;
      }

      if (!crit) {
        crit = this.sortCriteria;
      } else {
        this.sortCriteria = crit;
      }

      // Load the products
      const scrapedProducts = await this.$store.dispatch('dataGate', {
        tableName: 'scrapedProducts',
        operation: 'read',
        sortCriteria: crit ? crit : {},
        whereCriteria: filter ? filter : {},
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      if (scrapedProducts.count) {
        this.productCount = scrapedProducts.count;
      }
      if (scrapedProducts.data) {
        this.products = scrapedProducts.data;
      }

      // this.loading = false
    },
    async sortCallback(sortCriteria) {
      // Build the where clause
      if (sortCriteria) {
        // Reset page
        this.page = 1;
        breadcrumbMixin.methods.savePageAndFilter('scrapedList', {page: this.page, filter: this.filter, sort: sortCriteria});
        await this.loadProducts(sortCriteria);
      }
    },
    async filterChangeCallBackScraped(filter) {
      // Build the where clause
      if (filter) {
        // Reset page
        this.page = 1;
        this.filter = filter;
        breadcrumbMixin.methods.savePageAndFilter('scrapedList', {page: this.page, filter: this.filter, sort: this.sortCriteria});
        await this.loadProducts(null,filter);
      }
    },
  },
}
</script>

<style scoped>

</style>
