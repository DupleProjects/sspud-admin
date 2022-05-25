<template>
  <products-product-detail
    :type="this.$router.currentRoute.params.type"
    :edit="true"
    :product="this.$router.currentRoute.params.product"
  />
</template>

<script>
export default {
  props: {
    product: [],
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style scoped></style>
