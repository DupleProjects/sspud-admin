<template>
  <div class="confluence-card p-3">
    <p class="lead">Order Log</p>
    <div v-for="(log, index) of orderLogs" :key="index" class="">
      <div class="d-flex">
        <span class="dot mr-3"
              v-bind:class="{ 'success-dot' : log.status === 1, 'danger-dot': log.status === 2, 'dot': log.status === 3  }"></span>
        <p>{{log.event}}</p>
      </div>
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
      orderLogs: []
    };
  },
  async beforeMount() {
    if (this.order) {
      await this.loadOrderLogs();
    }
  },
  mounted() {

  },
  methods: {
    async loadOrderLogs() {
      const orderLogsResponse = await this.$store.dispatch('dataGate', {
        tableName: 'orderLogs',
        operation: 'read',
        whereCriteria: {orderId: this.order.id}
      });
      if (orderLogsResponse && orderLogsResponse.data) {
        this.orderLogs = orderLogsResponse.data;
      }
    },
    getShopName(shopId) {
      const shop = baseMixin.methods.getObjectsWhereKeysHaveValues(this.shops, {id: shopId}, true);
      if (shop) {
        return shop.name;
      }
      return "";
    }
  },
};
</script>

<style scoped>
.dot {
  height: 20px;
  width: 20px;
  background-color: #0046fa;
  border-radius: 50%;
  display: inline-block;
}
.danger-dot {
  height: 20px;
  width: 20px;
  background-color: #ff0000;
  border-radius: 50%;
  display: inline-block;
}
.success-dot {
  height: 20px;
  width: 20px;
  background-color: #0bff00;
  border-radius: 50%;
  display: inline-block;
}
</style>
