<template>
  <div class="confluence-card p-3"
       v-bind:class="{ reviewRequired : shopOrder.status === 'Review Required', orderPlaced: shopOrder.status === 'Order Placed' }">
    <h3>{{getShopName(shopOrder.shopId)}}</h3>
    <v-form
        ref="shopForm"
        v-model="validShopForm"
        lazy-validation>
      <div class="d-flex">
          <v-text-field
              v-on:change="shopOrderChanged = true"
              style="flex: 1"
              class="category-fields px-2"
              prepend-icon="mdi-card-account-details-outline"
              v-model="shopOrder.reference"
              hint="The order reference of the shopOrder"
              label="Reference Number"
              :rules="[(v) => (!!v || shopOrder.status === 'Queued') || 'A Reference is required']"
          ></v-text-field>
          <v-select
              v-on:change="shopOrderChanged = true"
              style="flex: 1"
              class="px-2"
              v-model="shopOrder.status"
              :items="['Queued', 'Order Placed', 'Review Required']"
              prepend-icon="mdi-card-account-details-outline"
              label="Order Status"
              hint="The status of the order at the shopOrder"
              :rules="[(v) => !!v || 'A Status is required']"
          ></v-select>
      </div>
    </v-form>
    <div class="table-responsive">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
        </tr>
        </thead>
        <tbody class="table-group-divider">
        <tr
            v-for="(product, index) of shopOrderProducts" :key="index"
            class="order-list-item">
          <th scope="row">{{product.name}}</th>
          <td>{{product.quantity}}</td>
          <td>P {{product.price * product.quantity}}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td>P {{shopOrder.total}}</td>
        </tr>
        </tfoot>
      </table>
    </div>
    <div>
      <button
          v-if="shopOrderChanged"
          @click="saveShopReference(shopOrder)"
          class="btn btn-primary">
        <v-progress-circular
            v-if="saving"
            :size="20"
            indeterminate
            color="primary"
        ></v-progress-circular>
        Save
      </button>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    shops: null,
    shopOrder: null,
    callBack: null,
  },
  data() {
    return {
      loading: false,
      saving: false,
      validShopForm: false,
      shopOrderProducts: [],
      shopOrderChanged: false
    };
  },
  async beforeMount() {
    if (this.shopOrder) {
      await this.loadShopProducts();
    }
  },
  mounted() {

  },
  methods: {
    async loadShopProducts() {
      const shopOrderProducts = await this.$store.dispatch('callMiddlewareRoute', {
        shopOrderId: this.shopOrder.id,
        route: 'orders/getShopOrderProducts'
      })
      if (shopOrderProducts) {
        this.shopOrderProducts = shopOrderProducts;
      }
    },
    getShopName(shopId) {
      const shop = baseMixin.methods.getObjectsWhereKeysHaveValues(this.shops, {id: shopId}, true);
      if (shop) {
        return shop.name;
      }
      return "";
    },
    async saveShopReference(reference) {
      // Save the shop order if the form is valid
      if (this.$refs.shopForm.validate()) {
        this.saving = true;
        const clone = baseMixin.methods.clone(reference);
        delete clone.products;
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: clone,
          tableName: "orderShopReferences",
          operation: "update",
        });
        this.callBack(reference)
        this.saving = false;
      }
    }
  },
};
</script>

<style scoped>
.reviewRequired {
  color: red !important;
  box-shadow: rgb(211 18 18 / 55%) 0px 1px 5px 2px !important;
}
.orderPlaced {
  color: #109600 !important;
  box-shadow: rgba(95, 211, 18, 0.55) 0px 1px 5px 2px !important;
}
</style>
