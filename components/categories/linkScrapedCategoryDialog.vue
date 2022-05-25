<template>
  <div>
    <button
        @click="openDialog()"
        type="button" class="btn btn-sm btn-outline-secondary">
      <i class="fa fas fa-arrow-right" style="margin-top:5px"></i>
    </button>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="newCategoryDialog" max-width="800">
      <v-card v-if="scrapedCategory">
        <v-card-title>
          Link Scraped Category to BambaZonke Category
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form
              ref="newCategoryForm"
              v-model="validCategoryForm"
              lazy-validation>
            <v-select
                prepend-icon="mdi-clipboard-check-multiple"
                label="Scraped Category"
                :item-text="'name'"
                :item-value="'id'"
                :items="scrapedCategories"
                v-model="selectedScrapedCategory"
                disabled
            ></v-select>
            <v-select
                prepend-icon="mdi-clipboard-check-multiple"
                label="BambaZonke Category"
                :item-text="'name'"
                :item-value="'id'"
                :items="categories"
                v-model="selectedCategory"
                :messages="['Choose a BambaZonke category for this scraped category to be linked to']"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular
              v-if="loading"
              :size="20"
              indeterminate
              color="primary"
          ></v-progress-circular>
          <v-btn
              v-if="!loading"
              :disabled="!validCategoryForm"
              color="primary"
              text
              v-on:click="linkToCategory()">
            Save
          </v-btn>
          <v-btn
              :disabled="loading"
              color="primary"
              text
              @click="newCategoryDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    categories: [],
    scrapedCategories: [],
    saveCallBack: null,
    selectedScrapedCategory: [],
    selectedCategory: [],
  },
  data() {
    return {
      loading: false,
      validCategoryForm: true,
      newCategoryDialog: false,
      category: null,
      scrapedCategory: null,
      mainCategories:[],
    }
  },
  mounted() {

  },
  methods: {
    async openDialog() {
      this.newCategoryDialog = true;
      this.mainCategories = [];
      this.categories.forEach(element => {
        if(element.parentId == 0){
          this.mainCategories.push(element);
        }
      });
      // Create new  default category
      this.scrapedCategory = {
        ...this.selectedScrapedCategory
      }
      console.log("SCRAP CAT",this.scrapedCategory);
    },    
    async linkToCategory(){
      this.scrapedCategory.mappedCategoryId = this.selectedCategory.id;
      const scrapedCategoriesResponse = await this.$store.dispatch('dataGate', {
          primaryKey: 'id',
          entity: this.scrapedCategory,
          tableName: 'scrapedCategories',
          operation: 'update',
      });
      // If valid response return value
      if (scrapedCategoriesResponse && scrapedCategoriesResponse.response) {
        // this.saveCallBack = scrapedCategoriesResponse.response;
        // console.log("this.saveCallBack",this.saveCallBack);
        // this.categories.push(this.category);
      }
      this.newCategoryDialog = false;
    }
  }
}
</script>

<style scoped>

</style>
