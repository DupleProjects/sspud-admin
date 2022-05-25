<template>
<div>
    <div>
      <h2>Link Categories</h2>
    </div>
    <categories-scraped-categories
          :categories="displayedCategories"
          :scrapedCategories="scrapedCategories"/>        
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
      this.loadProducts()
    },
    search(val) {

    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      await this.loadProducts();
      
    })
  },
  unmounted() {
    this.$nextTick(async function () {

    })
  },
  methods: {
    async loadProducts(){
      //main categories
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read',
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      //scraped categories
      const scrapedCategoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'scrapedCategories',
        operation: 'read',
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      //main category count
      if (categoriesResponse.count) {
        this.categoryCount = categoriesResponse.count;
      }
      //scraped category count
      if (scrapedCategoriesResponse.count) {
        this.scrapedCategoryCount = scrapedCategoriesResponse.count;
      }
      
      //main category data
      if (categoriesResponse.data) {
        this.categories = categoriesResponse.data;
        // console.log('this.categories',this.categories)
        this.filteredCategories = this.categories;
        this.setPage();
      }
      //scraped category data
      if (scrapedCategoriesResponse.data) {
        this.scrapedCategories = scrapedCategoriesResponse.data;
        // console.log('this.scrapedCategories',this.scrapedCategories)
        this.filteredScrapedCategories = this.scrapedCategories;
        this.setPage2();
      }
      
      this.loading = false
    },
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
    setPage2() {
      this.displayedScrapedCategories = []
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage)
      }
      // Validate page
      if (this.page < 1) this.page = 1
      if (this.page > numPages(this.filteredScrapedCategories.length, this.numberPerPage))
        this.page = numPages(this.filteredScrapedCategories.length, this.numberPerPage)
      for (
          let i = (this.page - 1) * this.numberPerPage;
          i < this.page * this.numberPerPage && i < this.filteredScrapedCategories.length;
          i++
      ) {
        if (this.filteredScrapedCategories[i]) {
          this.displayedScrapedCategories.push(this.filteredScrapedCategories[i])
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
