<template>
  <div v-if="productId" class="fadeInUp animated animatedFadeInUp logs-container">
    <p class="lead">History</p>
    <hr />
    <div class="confluence-card p-3" v-for="(history, index) of prodHistory" :key="index">
      <div class="d-flex justify-content-between px-3">
        <div class="d-flex align-center mb-2">
          <img
              :src="require(`assets/images/${ history.createdBy ? 'blankAvatar' : 'hacker'}.png`)"
              alt="image"
              class="avatar-image mr-2"
          />
          <p class="mb-0"><strong>{{getUserName(history.createdBy)}}</strong> updated the <strong>{{history.property}}</strong></p>
        </div>
        <p><small>{{history.createdAt}}</small></p>
      </div>
      <div class="d-flex justify-content-between">
        <div class="from-container p-3">
          <p class="mb-0" v-if="history.property === 'reviewRequired'">{{history.fromValue === '0' ? 'Review Not Required' : 'Review Required'}}</p>
          <p class="mb-0" v-if="history.property === 'publish'">{{history.fromValue === '1' ? 'Published' : 'Not Published'}}</p>
          <p
              v-if="history.property !== 'reviewRequired' && history.property !== 'publish'"
              class="mb-0">{{history.fromValue ? history.fromValue : 'None'}}</p>
        </div>
        <div class="align-self-center px-3">
          <v-icon color="black" width="40" height="40" class="icon me-2" light>
            mdi-arrow-right
          </v-icon>
        </div>
        <div class="to-container p-3">
          <p class="mb-0" v-if="history.property === 'reviewRequired'">{{history.toValue === '0' ? 'Review Not Required' : 'Review Required'}}</p>
          <p class="mb-0" v-if="history.property === 'publish'">{{history.toValue === '1' ? 'Published' : 'Not Published'}}</p>
          <p
              v-if="history.property !== 'reviewRequired' && history.property !== 'publish'"
              class="mb-0">{{history.toValue ? history.toValue : 'None'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";
export default {
  props: {
    productId: null,
    type: null,
  },
  data() {
    return {
      prodHistory: [],
      users: [],
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      const historyResponse = await this.$store.dispatch("dataGate", {
        tableName: "stagedProductLogs",
        operation: "read",
        whereCriteria: { stagedProductId: this.productId },
      });
      if (historyResponse.data) {
        this.prodHistory = historyResponse.data;
        for (let i = 0; i < this.prodHistory.length; i++) {
          this.prodHistory[i].createdAt = baseMixin.methods.formatDateTime(this.prodHistory[i].createdAt, false);
        }
        await this.loadUsers();
      }
      this.loading = false;
    });
  },
  mounted() {},
  methods: {
    async loadUsers() {
      // Get user ids
      const ids = baseMixin.methods.getPropertyValuesFromArray(this.prodHistory, 'createdBy');
      // Load
      const usersResponse = await this.$store.dispatch("dataGate", {
        tableName: "users",
        operation: "read",
        whereCriteria: { id: ids },
      });
      this.users = usersResponse.data;
    },
    getUserName(userId) {
      const user = baseMixin.methods.getObjectsWhereKeysHaveValues(this.users, {id: userId}, true);
      if (user) {
        return user.name + ' ' + user.surname;
      }
      return 'Anonymous';
    }
  }
};
</script>

<style scoped>
.from-container {
  flex: 1;
  background-color: #FFEBE9;
  border-radius: 25px;
}
.to-container {
  flex: 1;
  background-color: #E6FFEC;
  border-radius: 25px;
}
.logs-container {
  max-height: 80vh;
  overflow: auto;
}
.avatar-image {
  width: auto;
  vertical-align: middle;
  height: 30px;
}
</style>
