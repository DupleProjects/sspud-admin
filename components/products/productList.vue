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
      <tr v-for="(product, index) of products" :key="index">
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
    products: []
  },
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
