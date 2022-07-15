<template>
  <div>
    <div v-if="!loading">
      <analytics-staged-product-breakdown />
      <analytics-woo-commerce-sync-status />
    </div>
  </div>

</template>

 
<script>
import BarChart from '~/components/charts/BarChart.vue';
// import BarChart2 from '~/components/barChart/BarChart2.vue';

export default {
  name: "IndexPage",
  data() {
    return {
      loading: true,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      var loggedInUser = this.$store.state.auth.user;
      console.log("loggedInUser", loggedInUser);
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  },
  unmounted() {
    this.$nextTick(async function () { });
  },
  methods: {
    // Loading stuff

  },
}

</script>
<style>

</style>
