<template>
  <div v-if="product && scrapedProduct" class="fadeInUp animated animatedFadeInUp">
    <h1>Price Breakdown</h1>
    <hr />
    <div class="d-flex justify-content-between">
      <div class="confluence-card price-card">
        <p>R {{taxFreeZAR.toFixed(2)}}</p>
        <p class="text-muted"><small> Original Price (R{{scrapedProduct.price.toFixed(2)}}) / Domestic Tax ({{activeProcessVariables.domesticTax}}%)</small></p>
        <p>Tax Free ZAR</p>
      </div>
      <div class="confluence-card price-card">
        <p>P {{taxFreeBWP.toFixed(2)}}</p>
        <p class="text-muted"><small> Tax Free ZAR (R{{taxFreeZAR.toFixed(2)}}) / Foreign Conversion ({{activeProcessVariables.foreignConversion}})</small></p>
        <p>Tax Free Pula</p>
      </div>
      <div class="confluence-card price-card">
        <p>P {{profit.toFixed(2)}}</p>
        <p class="text-muted"><small> Tax Free Pula (P{{taxFreeBWP.toFixed(2)}}) * Profit Margin ({{activeProcessVariables.profitMargin}}%)</small></p>
        <p>Profit</p>
      </div>
      <div class="confluence-card price-card">
        <p>P{{BWPPrice.toFixed(2)}}</p>
        <p class="text-muted"><small> Tax Free Pula (R{{taxFreeBWP.toFixed(2)}}) / Foreign Tax ({{activeProcessVariables.foreignTax}}%)</small></p>
        <p>Pula Price</p>
      </div>
      <div class="confluence-card price-card">
        <p>P {{finalPrice.toFixed(2)}}</p>
        <p class="text-muted"><small> Pula Price (R{{BWPPrice.toFixed(2)}}) / Profit ({{profit.toFixed(2)}})</small></p>
        <p>Final Price</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: null,
    type: null,
  },
  data() {
    return {
      taxFreeZAR: null,
      taxFreeBWP: null,
      profit: null,
      BWPPrice: null,
      finalPrice: null,
      scrapedProduct: null,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;

      const processVariableResponse = await this.$store.dispatch('dataGate', {
        tableName: 'processVariables',
        operation: 'read',
        whereCriteria: {active: 1}
      });

      const scrapedProductResponse = await this.$store.dispatch('dataGate', {
        tableName: 'scrapedProducts',
        operation: 'read',
        whereCriteria: {id: this.product.scrapedProductId}
      });
      if (processVariableResponse && processVariableResponse.data && scrapedProductResponse && scrapedProductResponse.data) {
        this.scrapedProduct = scrapedProductResponse.data[0];
        this.activeProcessVariables = processVariableResponse.data[0];
        console.log('this.activeProcessVariables', this.activeProcessVariables)
        // Remove tax
        this.taxFreeZAR = (scrapedProductResponse.data[0].price / this.activeProcessVariables.domesticTax);
        // Convert to BWP
        this.taxFreeBWP = (this.taxFreeZAR / this.activeProcessVariables.foreignConversion);
        // Calculate profit
        this.profit = (this.taxFreeBWP * this.activeProcessVariables.profitMargin);
        // Add alcohol levy

        // Add BTW Tax
        this.BWPPrice = (this.taxFreeBWP * this.activeProcessVariables.foreignTax);
        // Add profit
        this.finalPrice = Number(this.BWPPrice) + Number(this.profit);
      }

      this.loading = false;
    });
  },
  mounted() {},
};
</script>

<style scoped>
.price-card {
  width: -webkit-fill-available;
  margin: 10px;
  padding: 10px;
}
</style>
