<template>
  <div class="confluence-card p-3">
    <p class="lead">Payment Breakdown</p>
    <div class="d-flex">
      <div class="px-3">
        <p><strong>Date Paid</strong></p>
        <p><base-date :date="order.wooCommerceOrder.date_paid" /></p>
      </div>
      <div class="px-3">
        <p><strong>Payment Method</strong></p>
        <p>{{order.wooCommerceOrder.payment_method}}</p>
      </div>
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
        <tr v-for="(shop, index) of order.sspudOrderReferences" :key="index">
          <th scope="row">Shop {{shop.shopId}}</th>
          <td>P {{shop.total}}</td>
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
          <td>P {{getPaymentSum()}}</td>
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
    getPaymentSum() {
      let sum = 0;
      // Add shop totals
      for (let i = 0; i < this.order.sspudOrderReferences.length; i++) {
        sum += Number(this.order.sspudOrderReferences[i].total);
      }
      // Add fee lines
      for (let j = 0; j < this.order.wooCommerceOrder.fee_lines.length; j++) {
        sum += Number(this.order.wooCommerceOrder.fee_lines[j].amount);
      }
      sum += Number(this.order.wooCommerceOrder.cart_tax);
      sum += Number(this.order.wooCommerceOrder.shipping_tax);
      sum += Number(this.order.wooCommerceOrder.shipping_total);
      return sum;
    },

  },
};
</script>

<style scoped>

</style>
