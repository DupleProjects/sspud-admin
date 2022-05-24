<template>
  <div>
    <h2>Product Dashboard</h2>
    <products-product-dashboard />
  </div>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 20,
      categoryCount: 0,
      categories: [],
    }
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true

      this.loading = false
    })
  },
  unmounted() {
    this.$nextTick(async function () {

    })
  },
  methods: {

  },
}
</script>

<style scoped>

</style>
