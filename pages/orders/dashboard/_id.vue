<template>
  <div>
    <div class="container">
      <header class="d-flex align-items-center pb-3 mx-3 border-bottom">
        <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
         <v-icon color="black" width="40" height="40" class="icon me-2" light>
            mdi-dropbox
          </v-icon>
          <span class="fs-4">Order Dashboard</span>
        </a>
      </header>
      <div class="text-center" style="margin-left:auto; margin-right:auto;">
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="blue"
            style="width:70px; height:70px"
        ></v-progress-circular>
        <h1 v-if="order && !order.wooCommerceOrder">Could not load order</h1>
      </div>
    </div>
    <div v-if="order && !loading">
      <div class="row m-0" v-if="order.wooCommerceOrder">
        <div class="col-2">
          <!-- Order overview -->
          <div class="confluence-card p-3">
            <p class="lead"><strong>Order</strong> #{{order.wooCommerceOrder.id}}</p>
            <v-alert
                v-if="order.sspudOrder.status === 'Review Required'"
                dense
                text
                type="error">
              {{order.sspudOrder.reviewReason}}
            </v-alert>
            <hr class="mt-0">
            <v-select
                v-model="order.sspudOrder.status"
                :items="['Awaiting Payment', 'Payment Received', 'Queued', 'Order Placed At Providers', 'Review Required', 'Processing At TH', 'In Transit To Depot', 'At Depot', 'n Transit To Customer', 'Order Complete']"
                label="Order Status"
                class="my-8"
                :hide-details="true"
                dense
            ></v-select>
            <v-select
                v-model="order.sspudOrder.paymentStatus"
                :items="['Awaiting Payment', 'Payment Received', 'Payment Cancelled']"
                label="Payment Status"
                class="my-8"
                :hide-details="true"
                dense
            ></v-select>
            <p><strong>Customer Note</strong> {{order.wooCommerceOrder.customer_note}}</p>
          </div>
          <orders-order-log class="my-3" :order="order" :shops="shops" />
        </div>
        <div class="col-8">
          <!-- Shops -->
          <div v-for="(shop, index) of order.sspudOrderReferences" :key="index" class="order-shop-reference mb-3">
            <orders-shop-order-component :shopOrder="shop" :shops="shops" :callBack="shopOrderUpdateCallBack" />
          </div>
          <!-- Price breakdown -->
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
        </div>
        <div class="col-2">
          <div class="confluence-card p-2 mb-2">
            <p class="lead">
              Customer
            </p>
            <p>{{order.wooCommerceOrder.billing.first_name}} {{order.wooCommerceOrder.billing.last_name}}</p>
            <p>{{order.wooCommerceOrder.billing.email}}</p>
            <p>{{order.wooCommerceOrder.billing.phone}}</p>
          </div>
          <div class="confluence-card p-2 my-2">
            <p class="lead">
              Billing
            </p>
            <p>{{order.wooCommerceOrder.billing.address_1}}</p>
            <p v-if="order.wooCommerceOrder.billing.address_2 !== ''">{{order.wooCommerceOrder.billing.address_2}}</p>
            <p>{{order.wooCommerceOrder.billing.city}}</p>
            <p>{{order.wooCommerceOrder.billing.state}}</p>
            <p>{{order.wooCommerceOrder.billing.country}}</p>
            <p>{{order.wooCommerceOrder.billing.postcode}}</p>
          </div>
          <div class="confluence-card p-2 my-2">
            <p class="lead">
              Shipping
            </p>
            <p>{{order.wooCommerceOrder.shipping.address_1}}</p>
            <p v-if="order.wooCommerceOrder.shipping.address_2 !== ''">{{order.wooCommerceOrder.shipping.address_2}}</p>
            <p>{{order.wooCommerceOrder.shipping.city}}</p>
            <p>{{order.wooCommerceOrder.shipping.state}}</p>
            <p>{{order.wooCommerceOrder.shipping.country}}</p>
            <p>{{order.wooCommerceOrder.shipping.postcode}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  components: {},

  mixins: [baseMixin],
  data() {
    return {
      order: null,
      loading: false,
      shops: []
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
      const shops = await this.$store.dispatch('dataGate', {
        tableName: 'shops',
        operation: 'read',
      });
      if (shops && shops.data) {
        this.shops = shops.data;
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
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
    async shopOrderUpdateCallBack(shopOrder) {
      // Check if the status is order placed.
      if (shopOrder.status === 'Order Placed') {
        // If it is then check the other shop orders and if all are
        // 'order placed' then the overall order should be set to order placed
        let ordersPlaced = true;
        for (let i = 0; i < this.order.sspudOrderReferences.length; i++) {
          if (this.order.sspudOrderReferences[i].status !== 'Order Placed') {
            ordersPlaced = false;
            break;
          }
        }
        // Now check if the order status is not something that should not be reverted
        if (ordersPlaced &&
            (this.order.sspudOrder.status === 'Review Required' || this.order.sspudOrder.status === 'Queued')) {
          this.order.sspudOrder.status = 'Order Placed At Providers';
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: {id: this.order.sspudOrder.id, status: 'Order Placed At Providers'},
            tableName: "orders",
            operation: "update",
          });
        }
      }
    }
  },
};
</script>

<style scoped>

.confluence-page-layout {
  display: flex;
  flex-basis: 100%;
  margin: 0 32px 0 40px;
  min-width: 400px;
  --homeIsSingleColumn: 0;
  --homeNavIsCollapsed: 0;
  --homeNavCollapsedDisplay: block;
}

.confluence-left-column {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: calc(var(--bannerHeight,0px) + var(--topNavigationHeight,0px) + 24px);
  margin-right: 32px;
  height: calc( 100vh - var(--bannerHeight,0px) - var(--topNavigationHeight,0px) - 40px );
  max-width: 240px;
}

.confluence-inner-left-column {
  -webkit-box-flex: 1;
  flex-grow: 1;
}

.confluence-profile-card {
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 3px;
  max-width: 240px;
  min-width: calc(240px - 240px * var(--homeNavIsCollapsed));
  background-color: rgba(255,255,255,calc(1 - var(--homeNavIsCollapsed)));
  box-shadow: 0px 1px 1px rgba(9,30,66,calc(0.25 - 0.25 * var(--homeNavIsCollapsed))),0px 0px 1px rgba(9,30,66,calc(0.31 - 0.31 * var(--homeNavIsCollapsed)));
}

.order-main-section {
  display: flex;
  flex-basis: 100%;
  max-width: 1300px;
  min-width: 516px;
}
.order-detail-grid {
  width: 100%;
  display: grid;
  column-gap: 32px;
  grid-template-columns: calc((100% - 24px - (1 - var(--homeIsSingleColumn)) * 380px)) calc((1 - var(--homeIsSingleColumn)) * 380px);
  grid-template-rows: auto auto 1fr;
}

.order-shop-reference {
  position: relative;
  grid-area: 1 / 1 / span 1 / span 1;
  margin-top: 0px;
  margin-bottom: calc( (32px - 32px * var(--homeIsSingleColumn)) + (12px * var(--homeIsSingleColumn)) );
}

.right-column {
  transition: margin-top 0.5s ease 0s;
  grid-column: calc(2 - var(--homeIsSingleColumn)) / span 1;
  grid-row: calc(1 + var(--homeIsSingleColumn)) / span calc(3 - 2 * var(--homeIsSingleColumn));
}
</style>
