<template>
  <div>
    <div>
      <h2>Link Categories</h2>

      <v-text-field
          v-model="search"
          label="Search"
          class="mb-4"
      ></v-text-field>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Shop</th>
            <th scope="col">Linked Category</th>
            <th scope="col">Publish</th>
            <th scope="col">Created At</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
        <tr
            v-for="(scrapedCategory, index) of scrapedCategories" :key="index">
          <td>{{scrapedCategory.name}}</td>
          <td>{{scrapedCategory.shopId}}</td>
          <td>{{linkMappedCategoryName(scrapedCategory.mappedCategoryId)}}</td>
          <td>{{scrapedCategory.publish}}</td>
          <td>{{scrapedCategory.createdAt}}</td>
          <td>
            <!--Opens link dialog-->
            <categories-link-scraped-category-dialog
                :categories="categories"
                :scrapedCategory="scrapedCategory"
            />
          </td>
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
              :length="Math.ceil(this.scrapedCategoryCount / this.numberPerPage)"
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
      search: '',
      numberPerPage: 20,
      categoryCount: 0,
      scrapedCategoryCount: 0,
      categories: [],
      scrapedCategories: [],
      filteredCategories: [],
      filteredScrapedCategories: [],
      displayedCategories: [],
      displayedScrapedCategories: []
    }
  },
  watch: {
    page(val) {
      this.loadScrapedCategories()
    },
    search(val) {
      if (val && val !== '') {
        this.loadScrapedCategories(
            {
              name: {
                like: val
              }
            }
        )
      } else {
        this.loadScrapedCategories()
      }
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the mapped categories
      await this.loadMappedCategories();
      // Load the scraped categories
      await this.loadScrapedCategories();
    })
  },
  unmounted() {
    this.$nextTick(async function () {

    })
  },
  computed: {
  },
  methods: {
    // used to display the name of the linked category
    linkMappedCategoryName: function (mappedCategoryId) {
      const linkedMappedCategory = baseMixin.methods.getObjectsWhereKeysHaveValues(
          this.categories,
          {id: mappedCategoryId},
          true
      )
      if (linkedMappedCategory) {
        return linkedMappedCategory.name;
      }
      return 'No linked category'
    },
    async loadMappedCategories() {
      //main categories
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read'
      });
      //main category count
      if (categoriesResponse.count) {
        this.categoryCount = categoriesResponse.count;
      }
      //main category data
      if (categoriesResponse.data) {
        this.categories = categoriesResponse.data;
      }

    },
    async loadScrapedCategories(filter) {
      //scraped categories
      const scrapedCategoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'scrapedCategories',
        operation: 'read',
        whereCriteria: filter,
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      //scraped category count
      if (scrapedCategoriesResponse.count) {
        this.scrapedCategoryCount = scrapedCategoriesResponse.count;
      }
      //scraped category data
      if (scrapedCategoriesResponse.data) {
        this.scrapedCategories = scrapedCategoriesResponse.data;
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>

</style>
