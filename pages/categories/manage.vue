<template>
  <div class="">
    <!--Header-->
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mx-3">
      <h1 class="h2">Manage Categories</h1>
      <v-text-field
          v-model="search"
          label="Search"
          class="px-5"
      ></v-text-field>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <categories-create-category-dialog
            :categories="displayedCategories" :saveCallBack="saveCallBack" :allCategories="categories" />
          <export-modal :exportTableName="'mappedCategories'" :exportSheetName="'BambaZonke Categories'" :products="displayedCategories" />
        </div>
      </div>
    </div>
    <hr class="my-0 mx-3">
    <!--Table-->
    <categories-category-list
        :categories="displayedCategories" :allCategories="categories" :reloadCallBack="saveCallBack"/>
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
import exportModal from '../../components/dialogs/exportModal.vue';
export default {
  components: { exportModal },
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      page: 1,
      search: '',
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
      this.setPage();
    },

    search(val) {
      this.filteredCategories = this.categories.filter((category) => {
        return (
            category.name.toLowerCase().includes(val.toLowerCase())
        )
      })
      this.setPage()
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read'
      });

      if (categoriesResponse.count) {
        this.categoryCount = categoriesResponse.count;
      }

      if (categoriesResponse.data) {
        this.categories = categoriesResponse.data;
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
    async loadCategories() {
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read',
      });
      this.categories = categoriesResponse.data
      this.filteredCategories = categoriesResponse.data;
      this.setPage();
    },
    async saveCallBack() {
      await this.loadCategories()
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
