<template>
  <div>
    
    <!--Header-->
    <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Orders</h1>
      <v-text-field
          v-model="search"
          label="Search"
          class="px-5"
          hide-details
      ></v-text-field>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          Export here please
        </div>
      </div>
    </div>
    <div >
      <template>
        <div class="text-center" style="margin-left:auto; margin-right:auto;">
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="black"
        ></v-progress-circular>
        </div>
      </template>
    
    </div>
    <!--Table-->
    <div v-if="!loading" class="p-3" style="border-radius: 20px !important;">
    <div class="fancy-table" :style="tableStyle">
      <table>
          <thead>
          <tr class="fancy-heading-row">
            <th scope="col">Order ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
            <th scope="col">Created At</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <tr
              v-for="(order, index) of orders" :key="index"
              class="fancy-row">
            <th>{{order.wooCommerceId}}</th>
            <td>{{order.customerName}}</td>
            <td>P {{order.total}}</td>
            <td>{{order.status}}</td>
            <td><date :date="order.createdAt" /></td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    class="button-style"
                    text
                    v-on:click="goToOrder(order)"
                    style="text-align: center"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>View Order</span>
              </v-tooltip>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--Pagination-->
    <template>
      <div class="text-end">
        <v-pagination
            color="primary"
            v-model="page"
            :length="Math.ceil(this.orderCount / this.numberPerPage)"
            :total-visible="7"
        ></v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
import usersList from '../../components/users/usersList.vue';
import CreateUserDialog from '../../components/users/createUserDialog.vue';
import Date from "@/components/base/date";
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";

export default {
  components: {Date, usersList, CreateUserDialog },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: false,
      page: 1,
      search: '',
      numberPerPage: 20,
      orderCount: 0,
      orders: [],
    }
  },
  watch: {
    async page(val) {
      await this.loadOrders();
      breadcrumbMixin.methods.savePage('ordersList', this.page)
    },
    async search(val) {
      await this.loadOrders(
          {
            customerName: {
              like: val
            }
          }
      );
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      this.loading = true;
      const pageInfo = breadcrumbMixin.methods.getPage('ordersList')
      this.page = pageInfo.page
      await this.loadOrders();
      this.loading = false;
    })
  },
  unmounted() {
    this.$nextTick(async function () {

    })
  },
  methods: {
    async loadOrders(filter) {
      const ordersResponse = await this.$store.dispatch('dataGate', {
        tableName: 'orders',
        operation: 'read',
        whereCriteria: filter ? {...filter} : null,
        page: this.page,
        numberPerPage: this.numberPerPage,
      });
      this.orders = ordersResponse.data;
      this.orderCount = ordersResponse.count;
    },
    async goToOrder(order) {
      const params = { id: order.id };
      this.loading = true
      await this.$router.push({
        name: "orders-dashboard-id",
        params,
      });
      this.loading = false
    }
  },
}
</script>

<style scoped>
.order-list-item {
  cursor: pointer;
}



.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  /* min-height: 75vh; */
  border-radius: 10px !important;
}

.fancy-heading-row {
  position: relative;
  background-color: #5268fa;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  color: white;
  border-image: initial;
  border-bottom: none;
  font-weight: normal !important;
}

.fancy-heading-row th {
  font-weight: normal;
  padding: 8px;
  padding-left: 15px;
}

.fancy-row {
  position: relative;
  background-color: white;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  border-image: initial;
  border-bottom: none;
}

.fancy-row:hover {
  background-color: #f5f6f8;
}
.fancy-row:hover .actions-column {
  display: flex;
}
.inner-fancy-heading-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-heading-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}

.fancy-row td {
  padding: 8px;
  font-size: 15px;
  padding-left: 15px;
}
.fancy-row th {
  padding: 8px;
  font-size: 15px;
  padding-left: 15px;
}

.product-list {
  min-height: 68vh;
  max-height: 68vh;
  overflow: auto;
}
</style>
