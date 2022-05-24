<template>
  <div>
    <h2>Category Dashboard</h2>
    <hr>

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
  watch: {
    page(val) {

    },
    search(val) {

    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      console.log(this.$route.params.id);
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      // const categoriesResponse = await this.$store.dispatch('dataGate', {
      //   tableName: 'mappedCategories',
      //   operation: 'read',
      //   page: 1,
      //   numberPerPage: this.numberPerPage
      // });
      // if (categoriesResponse.count) {
      //   this.categoryCount = categoriesResponse.count;
      // }
      // if (categoriesResponse.data) {
      //   this.categories = categoriesResponse.data;
      // }
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
