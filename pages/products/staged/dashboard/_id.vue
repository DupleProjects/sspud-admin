<template>
  <div>
    <h2>Product Dashboard</h2>
    <div class="row" v-if="!loading">
      <div class="col-3" v-if="product">
        <div class="card m-2 card-shadow fadeInUp animated animatedFadeInUp">
          <img class="card-img-top" :src="product.imageSrc" alt="image" style="width:100%">
          <div class="card-body">
            <v-alert
                border="right"
                colored-border
                :type="product.hasStock ? 'success' : 'error'"
                elevation="2">
              Has Stock
            </v-alert>
            <v-alert
                border="right"
                colored-border
                :type="product.special ? 'success' : 'error'"
                elevation="2">
              Special
            </v-alert>
            <v-alert
                border="right"
                colored-border
                :type="'info'"
                elevation="2">
              <a target="_blank" :href="product.href">Shop Link</a>
            </v-alert>
            <v-alert
                border="right"
                colored-border
                :type="'info'"
                :to="'../../products/scraped/' + product.scrapedProductId"
                router
                elevation="2">
              <a :href="'../../../products/scraped/dashboard/' + product.scrapedProductId">Scraped Product</a>
            </v-alert>
          </div>
        </div>
      </div>
      <div class="col-9">
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="'details'" class="p-3">
            <products-product-detail
                v-if="product"
                :type="'staged'"
                :edit="true"
                class="m-2 fadeInUp animated animatedFadeInUp"
                :product="product"
            />
          </v-tab-item>
          <v-tab-item :key="'details'" class="p-3">
            <product-linked-entities :product="product" class="fadeInUp animated animatedFadeInUp"/>
            <products-product-publish :product="product" />
          </v-tab-item>
          <v-tab-item :key="'details'" class="p-3">
            <products-product-log
                :productId="this.$router.currentRoute.params.id"
                :type="'stagedProducts'"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
import productLinkedEntities from '../../../../components/products/productLinkedEntities.vue';
export default {
  components: { productLinkedEntities },
  mixins: [baseMixin],
  data() {
    return {
      tab: null,
      items: [
        'details', 'publish', 'log'
      ],
      product: null,
      loading: false,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // Get the product for the product id
      console.log(
        "this.$router.currentRoute.params.id",
        this.$router.currentRoute.params.id
      );
      if (this.$router.currentRoute.params.id) {
        const productResponse = await this.$store.dispatch("dataGate", {
          tableName: "stagedProducts",
          operation: "read",
          whereCriteria: { id: this.$router.currentRoute.params.id },
        });
        console.log("productResponse", productResponse);
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
