<template>
  <div class="table-responsive">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Header</th>
        <th scope="col">Header</th>
        <th scope="col">Header</th>
        <th scope="col">Header</th>
      </tr>
      </thead>
      <tbody>
      <tr
          @click="goToProductDashboard(product)"
          v-for="(product, index) of products" :key="index">
        <td>{{product.name}}</td>
        <td>random</td>
        <td>data</td>
        <td>placeholder</td>
        <td>text</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    type: '',
    products: []
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    goToProductDashboard(product) {
      const params = {id: product.id};
      // Go to different dashboards based on type
      if (this.type === 'scraped') {
        this.$router.push(
            {
              name: 'products-scraped-dashboard-id',
              params
            }
        )
      } else if (this.type === 'staged') {
        this.$router.push(
            {
              name: 'categories-dashboard-id',
              params
            }
        )
      } else if (this.type === 'published') {
        this.$router.push(
            {
              name: 'categories-dashboard-id',
              params
            }
        )
      }
    },
  }
}
</script>

<style scoped>

</style>
