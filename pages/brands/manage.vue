<template>
  <div>
    <!--Header-->
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Manage Brands</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <!--Create Button-->

        </div>
      </div>
    </div>
    <!--Table-->
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
            @click="goToBrandDashboard(brand)"
            v-for="(brand, index) of brands" :key="index">
          <td>{{brand.name}}</td>
          <td>random</td>
          <td>data</td>
          <td>placeholder</td>
          <td>text</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!--Pagination-->
    <template>
      <div class="text-end">
        <v-pagination
            color="primary"
            v-model="page"
            :length="Math.ceil(this.brandCount / this.numberPerPage)"
            :total-visible="7"
        ></v-pagination>
      </div>
    </template>
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
      brandCount: 0,
      brands: [],
      filteredBrands: [],
      displayedBrands: [],
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
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      const brandsResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedBrands',
        operation: 'read'
      });
      if (brandsResponse.count) {
        this.brandCount = brandsResponse.count;
      }
      if (brandsResponse.data) {
        console.log('brandsResponse.data', brandsResponse.data)
        this.brands = brandsResponse.data;
        this.filteredBrands = this.brands;
        this.setPage();
      }
      this.loading = false
    })
  },
  unmounted() {
    this.$nextTick(async function () {

    })
  },
  methods: {
    brandCreateCallBack(newBrand) {
      this.brands.push(newBrand)
    },
    goToBrandDashboard(brand) {
      this.$router.push(
          {
            name: 'brands-dashboard-id',
            params: {id: brand.id}
          }
      )
    },
    // Pagination
    setPage() {
      this.displayedBrands = []
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage)
      }
      // Validate page
      if (this.page < 1) this.page = 1
      if (this.page > numPages(this.filteredBrands.length, this.numberPerPage))
        this.page = numPages(this.filteredBrands.length, this.numberPerPage)
      for (
          let i = (this.page - 1) * this.numberPerPage;
          i < this.page * this.numberPerPage && i < this.filteredBrands.length;
          i++
      ) {
        if (this.filteredBrands[i]) {
          this.displayedBrands.push(this.filteredBrands[i])
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
