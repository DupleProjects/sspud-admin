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
    <!--Table-->
    <div class="table-responsive">
      <div class="m-3 card card-shadow">
        <table class="table table-hover">
          <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
            <th scope="col">Created At</th>
          </tr>
          </thead>
          <tbody class="table-group-divider">
          <tr
              v-on:click="goToOrder(order)"
              v-for="(order, index) of orders" :key="index"
              class="order-list-item">
            <th scope="row">{{order.wooCommerceId}}</th>
            <td>{{order.customerName}}</td>
            <td>P {{order.total}}</td>
            <td>{{order.status}}</td>
            <td><date :date="order.createdAt" /></td>
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

export default {
  components: {Date, usersList, CreateUserDialog },
  mixins: [baseMixin],
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
      await this.$router.push({
        name: "orders-dashboard-id",
        params,
      });
    }
  },
}
</script>

<style scoped>
.order-list-item {
  cursor: pointer;
}
</style>
