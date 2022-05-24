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
    <div v-if="!loading">
      <!--Table-->
      <h2>Scraped Products</h2>
      <products-product-list :type="'scraped'" :products="products" />
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
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      productCount: 0,
      products: [],
    }
  },
  watch: {
    page(val) {
      this.loadProducts()
    },
    search(val) {

    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load Products
      await this.loadProducts()
    })
  },
  unmounted() {
    this.$nextTick(async function () {
    })
  },
  methods: {
    // Loading stuff
    async loadProducts() {
      this.loading = true
      // Load the products
      const scrapedProducts = await this.$store.dispatch('dataGate', {
        tableName: 'scrapedProducts',
        operation: 'read',
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      if (scrapedProducts.count) {
        this.productCount = scrapedProducts.count;
      }
      if (scrapedProducts.data) {
        this.products = scrapedProducts.data;
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>

</style>
