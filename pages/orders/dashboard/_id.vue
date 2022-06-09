<template>
  <div>
    <h2>Order Dashboard</h2>

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
