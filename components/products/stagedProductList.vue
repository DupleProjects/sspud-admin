<template>
  <div class="table-responsive">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th class="name-column" scope="col">Name</th>
        <th class="info-column" scope="col">Price</th>
        <th class="info-column" scope="col">Category</th>
        <th class="info-column" scope="col">Subcategory</th>
        <th class="info-column" scope="col">Brand</th>
        <th class="info-column" scope="col">Model Number</th>
      </tr>
      </thead>
      <tbody>
      <tr
          @click="goToProductDashboard(product)"
          v-for="(product, index) of products" :key="index">
        <td class="name-column">{{product.name}}</td>
        <td class="info-column">R{{product.price}}</td>
        <td class="info-column">{{product.categoryName}}</td>
        <td class="info-column">{{product.subCategoryName}}</td>
        <td class="info-column">{{product.brand}}</td>
        <td class="info-column">{{product.modelNumber}}</td>
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

.name-column{
  width:25%;
}

.info-column{
    width: 15%;
}

</style>
