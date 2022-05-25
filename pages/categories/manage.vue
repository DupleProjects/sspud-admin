<template>
  <div>
    <!--Header-->
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Manage Categories</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <categories-create-category-dialog
            :categories="displayedCategories" :saveCallBack="saveCallBack" />
        </div>
      </div>
    </div>
    <!--Table-->
    <categories-all-categories
        :categories="displayedCategories"/>
    <!--Pagination-->
    <template>
      <div class="text-end">
        <v-pagination
            color="primary"
            v-model="page"
            :length="Math.ceil(this.categoryCount / this.numberPerPage)"
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
      categoryCount: 0,
      categories: [],
      filteredCategories: [],
      displayedCategories: [],
      subCategories: [],
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
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read',
        whereCriteria: {parentId: 0}
      });

      if (categoriesResponse.count) {
        this.categoryCount = categoriesResponse.count;
      }

      if (categoriesResponse.data) {
        console.log('categoriesResponse.data', categoriesResponse.data)
        this.categories = categoriesResponse.data;
        console.log('this.categories',this.categories)
        this.filteredCategories = this.categories;
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
    async saveCallBack(newCategory) {
      // if(newCategory.parentId == 0){
      //   this.categories.push(newCategory)
      //   this.setPage();
      // }
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read',
        whereCriteria: {parentId: 0}
      });

      this.categories = categoriesResponse.data;
      this.filteredCategories = this.categories;
      this.setPage();


    },
    goToCategoryDashboard(category) {
      this.$router.push(
          {
            name: 'categories-dashboard-id',
            params: {id: category.id}
          }
      )
    },
    // Pagination
    setPage() {
      this.displayedCategories = []
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage)
      }
      // Validate page
      if (this.page < 1) this.page = 1
      if (this.page > numPages(this.filteredCategories.length, this.numberPerPage))
        this.page = numPages(this.filteredCategories.length, this.numberPerPage)
      for (
          let i = (this.page - 1) * this.numberPerPage;
          i < this.page * this.numberPerPage && i < this.filteredCategories.length;
          i++
      ) {
        if (this.filteredCategories[i]) {
          this.displayedCategories.push(this.filteredCategories[i])
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
