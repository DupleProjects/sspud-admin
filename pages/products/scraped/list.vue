<template>
  <div>
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
      <h1 class="h2">Scraped Products</h1>
      <!--Search would be here-->

      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <export-modal :products="products" :exportTableName="'scrapedProducts'" :exportSheetName="'Scraped Products'" />
        </div>
      </div>
    </div>
    <hr class="my-0 mx-3">
    <div v-if="!loading">
      <product-list-filter
        :filter="filter" 
        :filterChangeCallBack="filterChangeCallBackScraped" 
        :type="'scraped'" 
      />
      <!--Table-->
      <products-product-list :type="'scraped'" :products="products" :canDelete="false" :sortCallback="sortCallback" />
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
      loading: false,
      page: 1,
      numberPerPage: 20,
      productCount: 0,
      products: [],
      sortCriteria: {},
      filter: {},
      criteria: {},
    }
  },
  watch: {
    page(val) {
      this.loadProducts()
      breadcrumbMixin.methods.savePage('scrapedList', this.page)
    },
    search(val) {

    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load Products
      const pageInfo = breadcrumbMixin.methods.getPage('scrapedList')
      this.page = pageInfo.page
      await this.loadProducts()
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
    async sortCallback(crit) {
      // Build the where clause
      if (crit) {
        await this.loadProducts(crit);
      }
    },
    async filterChangeCallBackScraped(filter) {
      // Build the where clause
      if (filter) {
        this.activeFilter = filter;
        await this.loadProducts(null,filter);
      }
    },
  },
}
</script>

<style scoped>

</style>
