<template>
  <div class="confluence-card p-3">
    <div class="d-flex justify-content-between">
      <p class="lead">Payment Breakdown</p>
      <base-date :date="order.wooCommerceOrder.date_paid" />
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Payment</th>
          <th scope="col">Amount</th>
        </tr>
        </thead>
        <tbody class="table-group-divider">
        <tr>
          <th scope="row">Products</th>
          <td>P {{getProductSum()}}</td>
        </tr>
        <tr v-for="(fee_line, index) of order.wooCommerceOrder.fee_lines" :key="fee_line.id">
          <th scope="row">{{fee_line.name}}</th>
          <td>P {{fee_line.amount}}</td>
        </tr>
        <tr class="order-list-item">
          <th scope="row">Cart Tax</th>
          <td>P {{order.wooCommerceOrder.cart_tax}}</td>
        </tr>
        <tr class="order-list-item">
          <th scope="row">Shipping Tax</th>
          <td>P {{order.wooCommerceOrder.shipping_tax}}</td>
        </tr>
        <tr class="order-list-item">
          <th scope="row">Shipping Total</th>
          <td>P {{order.wooCommerceOrder.shipping_total}}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td>Total</td>
          <td>P {{order.wooCommerceOrder.total}}</td>
        </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    shops: [],
    order: null,
  },
  data() {
    return {
      loading: false,
      saving: false,
    };
  },
  async beforeMount() {
    if (this.order) {

    }
  },
  mounted() {

  },
  methods: {
    getProductSum() {
      let sum = 0;
      // Add fee lines
      for (let j = 0; j < this.order.wooCommerceOrder.fee_lines.length; j++) {
        sum += Number(this.order.wooCommerceOrder.fee_lines[j].amount);
      }
      sum += Number(this.order.wooCommerceOrder.cart_tax);
      sum += Number(this.order.wooCommerceOrder.shipping_tax);
      sum += Number(this.order.wooCommerceOrder.shipping_total);
      sum = Number(this.order.wooCommerceOrder.total) - sum;
      return sum;
    },
    getShopName(shopId) {
      const shop = baseMixin.methods.getObjectsWhereKeysHaveValues(this.shops, {id: shopId}, true);
      if (shop) {
        return shop.name;
      }
      return "";
    },
  },
};
</script>

<style scoped>

</style>
