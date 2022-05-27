<template>
  <div>
    <h2>Product Dashboard</h2>
    <products-product-detail
        :type="'scraped'"
        :edit="false"
        :product="product"
    />
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      product: null,
      loading: false,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // Get the product for the product id
      console.log('this.$router.currentRoute.params.id', this.$router.currentRoute.params.id)
      if (this.$router.currentRoute.params.id) {
        const productResponse = await this.$store.dispatch('dataGate', {
          tableName: 'scrapedProducts',
          operation: 'read',
          whereCriteria: {id: this.$router.currentRoute.params.id}
        });
        console.log('productResponse', productResponse)
        // Check if valid response
        if (productResponse.data && productResponse.data.length > 0) {
          this.product = productResponse.data[0];
        }
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {},
};
</script>

<style scoped></style>
