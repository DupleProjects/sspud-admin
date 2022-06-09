<template>
  <div>
    <h2>Order Dashboard</h2>
    <div v-if="order">
      <div class="row">
        <div class="col-4">
          <div class="card card-shadow m-3 p-3">
            <p class="lead">
              Customer
            </p>
            <p>{{order.wooCommerceOrder.billing.first_name}} {{order.wooCommerceOrder.billing.last_name}}</p>
            <p>{{order.wooCommerceOrder.billing.email}}</p>
            <p>{{order.wooCommerceOrder.billing.phone}}</p>
          </div>
        </div>
        <div class="col-4">
          <div class="card card-shadow m-3 p-3">
            <p class="lead">
              Billing
            </p>
            <p>{{order.wooCommerceOrder.billing.address_1}}</p>
            <p>{{order.wooCommerceOrder.billing.address_2}}</p>
            <p>{{order.wooCommerceOrder.billing.city}}</p>
            <p>{{order.wooCommerceOrder.billing.country}}</p>
            <p>{{order.wooCommerceOrder.billing.state}}</p>
            <p>{{order.wooCommerceOrder.billing.postcode}}</p>
          </div>
        </div>
        <div class="col-4">
          <div class="card card-shadow m-3 p-3">
            <p class="lead">
              Shipping
            </p>
            <p>{{order.wooCommerceOrder.shipping.address_1}}</p>
            <p>{{order.wooCommerceOrder.shipping.address_2}}</p>
            <p>{{order.wooCommerceOrder.shipping.city}}</p>
            <p>{{order.wooCommerceOrder.shipping.country}}</p>
            <p>{{order.wooCommerceOrder.shipping.state}}</p>
            <p>{{order.wooCommerceOrder.shipping.postcode}}</p>
          </div>
        </div>
      </div>
      <div class="card card-shadow m-3 p-3">
        <p>Order ID: {{order.wooCommerceOrder.id}}</p>
        <p>cart_tax: {{order.wooCommerceOrder.cart_tax}}</p>
        <p>customer_note: {{order.wooCommerceOrder.customer_note}}</p>
        <p>date_paid: {{order.wooCommerceOrder.date_paid}}</p>
        <p>payment_method: {{order.wooCommerceOrder.payment_method}}</p>
        <p>shipping_tax: {{order.wooCommerceOrder.shipping_tax}}</p>
        <p>shipping_total: {{order.wooCommerceOrder.shipping_total}}</p>
        <p>shipping_total: {{order.wooCommerceOrder.shipping_total}}</p>
        <p>status: {{order.sspudOrder.status}}</p>
      </div>
      <div v-for="(shop, index) of order.sspudOrderReferences" :key="index" class="card card-shadow m-3 p-3">
        <h3>Shop {{shop.shopId}}</h3>
        <p>Shop Reference Number: {{shop.reference}}</p>
        <p>Status: {{shop.status}}</p>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
            </tr>
            </thead>
            <tbody class="table-group-divider">
            <tr
                v-for="(product, index) of shop.products" :key="index"
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
              <td>P {{shop.total}}</td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      order: null,
      loading: false,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // Get the product for the product id
      console.log("this.$router.currentRoute.params.id", this.$router.currentRoute.params.id);
      // Load the order detail
      const ordersResponse = await this.$store.dispatch('callMiddlewareRoute', {
        route: 'orders/getOrderDetail',
        orderId: this.$router.currentRoute.params.id
      });
      if (ordersResponse) {
        this.order = ordersResponse;
      }
      console.log('ordersResponse', ordersResponse)
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
