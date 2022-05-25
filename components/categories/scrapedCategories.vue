<template>
  <div class="table-responsive">
    <div class="table-responsive">
      <div class="container">
        <div class="row">
          
          
          <!-- Scraped Categories -->
          <div class="col-sm">
            <div>
              <h3 style="margin-bottom:20px;">Scraped Categories</h3>
            </div>
            <div class="search-wrapper">
                    <input style="width:250px;border: 2px solid gray; border-radius: 4px; padding:5px"  type="text" placeholder="Search Scraped Categories"  v-on:change="filterScrapedCategories()" v-model="search"/>
                    
            <button
                @click="resetScrapedFilter()"
                type="button" class="btn btn-sm btn-outline-secondary">
                Reset Filter
            </button>
            </div>
            <table class="table table-striped table-sm">
              <!-- <thead>
                <tr>
                  <th scope="col">Subcategory Name</th>
                  <th scope="col"></th>
                </tr>
              </thead> -->
              <tbody>
                <tr
                  v-for="(scrapedCategory, index) of scrapedCategories"
                  :key="index"
                >
                  <td class="cell-style"><h5>{{ scrapedCategory.name }}</h5></td>
                  <td class="edit-button-cell-style"><h6 @click="linkToCategory(scrapedCategory)"><link-scraped-category-dialog :categories="categories" :scrapedCategories="scrapedCategories" :selectedCategory="selectedCategory" :selectedScrapedCategory="scrapedCategory" /></h6></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="vr" style="width:2px;"></div>
          <!-- Main Categories -->
          <div class="col-sm">
            <div>
              <h3 style="margin-bottom:20px;">BambaZonke Categories</h3>
            </div>
            <div class="search-wrapper">
                <input style="width:250px;border: 2px solid gray; border-radius: 4px; padding:5px" type="text" placeholder="Search BambaZonke Categories" v-on:change="showLinkedCategories()" v-model="searchCategories"/>
                <button
                @click="resetFilter()"
                type="button" class="btn btn-sm btn-outline-secondary">
                Reset Filter
            </button>
            </div>
            
            <table class="table table-striped table-sm">
              <tbody class="table-row">
                <tr
                  v-for="(category, index) of categories"
                  :key="index"
                >
                  <td class="cell-style" @click="showLinkedCategories(category)"><h5>{{ category.name }}</h5></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import linkScrapedCategoryDialog from './linkScrapedCategoryDialog.vue';
export default {
  components: { linkScrapedCategoryDialog },
  props: {
    type: "",
    categories: [],
    scrapedCategories: [],
  },
  data() {
    return {
      mainCategories: [],
      filteredCategories: [],
      search: '',
      searchCategories: '',
      selectedCategory: []
    };
  },
  mounted() {
      
  },
  methods: {
    goToCategoryDashboard(category) {
      this.$router.push({
        name: "categories-dashboard-id",
        params: { id: category.id },
      });
    },
    linkToCategory(){

    },
    async showLinkedCategories(cat){
        if(cat){
            console.log("CAT!!!!", cat);
            this.selectedCategory = cat;
            this.categories = [];
            const categoriesResponse = await this.$store.dispatch('dataGate', {
                tableName: 'mappedCategories',
                operation: 'read',
                whereCriteria: { id: cat.id}
            });

            if(categoriesResponse.data){
                categoriesResponse.data.forEach(element => {
                    console.log("⚡⚡ELEMENT:", element);
                });
                this.categories = categoriesResponse.data
            }

            const subcategoriesResponse = await this.$store.dispatch('dataGate', {
                tableName: 'mappedCategories',
                operation: 'read',
                whereCriteria: { parentId: cat.id}
            });

            if(subcategoriesResponse.data){
                subcategoriesResponse.data.forEach(element => {
                    this.categories.push(element)
                });
            }

        }else{
            if(this.searchCategories != ''){
                const categoriesSearchResponse = await this.$store.dispatch('dataGate', {
                    tableName: 'mappedCategories',
                    operation: 'read',
                    whereCriteria: { name: this.searchCategories}
                });

                this.categories = categoriesSearchResponse.data
            }else{
                this.resetFilter();
            }
            
        }
        
        
        // if(cat){}
        // console.log("CATEGORY",cat);
    },
    async filterScrapedCategories(){
        if(this.search != ''){
            const scrapedCategoriesSearchResponse = await this.$store.dispatch('dataGate', {
                tableName: 'scrapedCategories',
                operation: 'read',
                whereCriteria: { name: this.search}
            });

            this.scrapedCategories = scrapedCategoriesSearchResponse.data
        }else{
            this.resetScrapedFilter();
        }
    },
    async resetFilter(){
        this.categories = [];
        const categoriesResponse = await this.$store.dispatch('dataGate', {
            tableName: 'mappedCategories',
            operation: 'read',
            page: 1,
            numberPerPage: 20
        });

        categoriesResponse.data.forEach(element => {
            this.categories.push(element);
        })

        // this.categories = categoriesResponse.data;
    },
    async resetScrapedFilter(){
        this.scrapedCategories = [];
        const scrapedCategoriesResponse = await this.$store.dispatch('dataGate', {
            tableName: 'scrapedCategories',
            operation: 'read',
            page: 1,
            numberPerPage: 20
        });

        scrapedCategoriesResponse.data.forEach(element => {
            this.scrapedCategories.push(element);
        })

        // this.categories = categoriesResponse.data;
    }
  },
};
</script>

<style scoped>
  .cell-style{
    padding-top: 14px;
    padding-bottom: 10px;
    padding-left: 10px;
  }

  .edit-button-cell-style{
    text-align: right;
    padding-right: 50px;
    padding-top: 14px;
    padding-bottom: 10px;
  }

  .search-wrapper{
      margin-bottom: 20px;
      margin-top: 20px;
  }
</style>
