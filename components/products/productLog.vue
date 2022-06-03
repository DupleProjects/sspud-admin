<template>
  <div>
    <h1>History</h1>
    <hr />

    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(history, index) of prodHistory" :key="index">
          <td>
            <h5>
              <b>{{ history.description }}</b>
            </h5>
          </td>
          <td>
            <h5>
              <b>{{ history.date }}</b>
            </h5>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    product: [],
    type: null,
  },
  data() {
    return {
      prodHistory: [],
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      console.log("History", this.product);

      const historyResponce = await this.$store.dispatch("dataGate", {
        tableName: "auditLog",
        operation: "read",
        whereCriteria: { "\`table\`": this.type, recordId: this.product },
      });

      this.prodHistory = historyResponce.data;
      Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
      };
      this.prodHistory.forEach((element) => {
        element.date = new Date(element.date);
        element.date.addHours(2);
        element.date = element.date.toString().substring(0, 24);
      });

      this.loading = false;
    });
  },
  mounted() {},
};
</script>

<style scoped></style>
