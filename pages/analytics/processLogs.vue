<template>
  <div>
    <client-only>
      <v-overlay
          style="height: 80vh; margin-top: -60px"
          :value="loading"
          color="transparent"
          z-index="5"
          absolute
          opacity="1"
      >
        <div class="text-center">
          <v-progress-circular
              :size="70"
              :width="7"
              indeterminate
              color="primary"
          ></v-progress-circular>
          <h1>Loading Scraped Products</h1>
        </div>
      </v-overlay>
    </client-only>
    <div v-if="!loading">
      <!--Heading-->
      <div class="px-3">
        <h2 class="px-3">Process Logs</h2>
      </div>
      <!--Table-->
      <div class="card m-3">
        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Duration</th>
              <th scope="col">Logged At</th>
              <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(processLog, index) of processLogs" :key="index">
              <td>{{ processLog.name }}</td>
              <td>{{ processLog.duration }} seconds</td>
              <td> <base-date :date="processLog.dateTime"/></td>
              <td>
                <v-icon
                    :color="processLog.status ? 'green' : 'red'"
                >mdi-circle</v-icon>
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
              :length="Math.ceil(this.processLogCount / this.numberPerPage)"
              :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 15,
      processLogCount: 0,
      processLogs: [],
      // Current criteria
      criteria: {deleted: 0, publish: 0}
    };
  },
  watch: {
    page(val) {
      this.loadProducts();
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      var loggedInUser = this.$store.state.auth.user
      console.log('loggedInUser', loggedInUser)
      // Load Process logs
      await this.loadProcessLogs();
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    // Loading stuff
    async loadProcessLogs() {
      // Load the products
      this.processLogs = await this.$store.dispatch("callMiddlewareRoute", {
        route: 'processLogs/latestProcessLogs',
      });
    }
  },
};
</script>

<style scoped>
</style>
