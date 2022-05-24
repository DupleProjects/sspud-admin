<template>
  <div class="table-responsive">
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <!-- <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Header</th>
          <th scope="col">Header</th>
          <th scope="col">Header</th>
          <th scope="col">Header</th>
        </tr>
        </thead> -->
        <tbody>
        <tr
            @click="goToCategoryDashboard(category)"
            v-for="(category, index) of categories" :key="index">
          <td>{{category.name}}</td>
          <td>random</td>
          <td>data</td>
          <td>placeholder</td>
          <td>text</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: '',
    categories: []
  },
  data() {
    return {

    }
  },
  mounted() {
    console.log("🔥",this.categories);
  },
  methods: {
    goToCategoryDashboard(category) {
      this.$router.push(
          {
            name: 'categories-dashboard-id',
            params: {id: category.id}
          }
      )
    },
  }
}
</script>

<style scoped>

</style>
