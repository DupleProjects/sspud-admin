<template>
  <div class="confluence-card p-3 mb-3 orderReceived transport-card">
    <p class="lead">Transport</p>
    <v-form
        ref="waybillForm"
        v-model="waybillForm"
        lazy-validation>
      <div class="d-flex flex-column text-center"
          v-if="order.status === 'In Transit To Depot'">
        <p>Waybill Number: {{order.waybillNumber}}</p>
        <div
            v-if="order.status === 'In Transit To Depot'"
            class="text-center"
            style="flex: 1">
          <v-btn
              color="primary"
              :disabled="!waybillForm"
              v-on:click="orderReceivedAtDepot()">
            <v-progress-circular
                v-if="saving"
                :size="20"
                indeterminate
                color="primary"
            ></v-progress-circular>
            Order Received At Depot
          </v-btn>
        </div>
      </div>
      <div class="d-flex">
        <v-text-field
            style="flex: 1"
            class="category-fields px-2"
            v-if="order.status === 'Processing At Transport Holdings'"
            prepend-icon="mdi-card-account-details-outline"
            v-model="order.waybillNumber"
            hint="The Waybill number for the order"
            label="Waybill Number"
        ></v-text-field>
        <div
            v-if="order.status === 'Processing At Transport Holdings'"
            class="text-center"
            style="flex: 1">
          <v-btn
              color="primary"
              :disabled="!waybillForm"
              v-on:click="orderShipped()">
            <v-progress-circular
                v-if="saving"
                :size="20"
                indeterminate
                color="primary"
            ></v-progress-circular>
            Order Shipped
          </v-btn>
<!--          <button-->
<!--              :disabled="!validShopForm"-->
<!--              v-on:click="orderShipped()"-->
<!--              class="btn btn-primary">-->
<!--            <v-progress-circular-->
<!--                v-if="saving"-->
<!--                :size="20"-->
<!--                indeterminate-->
<!--                color="primary"-->
<!--            ></v-progress-circular>-->
<!--            Order Shipped-->
<!--          </button>-->
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    saveCallBack: null,
    order: null,
  },
  data() {
    return {
      loading: false,
      saving: false,
      waybillForm: false
    };
  },
  async beforeMount() {
    if (this.order) {
      console.log('this.order', this.order)
    }
  },
  mounted() {

  },
  methods: {
    async orderShipped() {
      if (this.$refs.waybillForm.validate()) {
        this.order.status = 'In Transit To Depot';
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: {id: this.order.id, status: 'In Transit To Depot', waybillNumber: this.order.waybillNumber },
          tableName: "orders",
          operation: "update",
        });
        await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: {orderId: this.order.id, event: 'Order Dispatched To Depot', status: 1},
          tableName: "orderLogs",
          operation: "create",
        });
      }
    },
    async orderReceivedAtDepot() {
      this.order.status = 'At Depot';
      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: {id: this.order.id, status: 'At Depot' },
        tableName: "orders",
        operation: "update",
      });
      await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: {orderId: this.order.id, event: 'Order At Depot', status: 1},
        tableName: "orderLogs",
        operation: "create",
      });
    },
  },
};
</script>

<style scoped>
.orderReceived {
  box-shadow: rgba(18, 211, 176, 0.55) 0px 1px 5px 2px !important;
}
.transport-card {
  min-height: 20vh;
}
</style>
