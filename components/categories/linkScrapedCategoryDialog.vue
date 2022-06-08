<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on" color="blue" medium @click="openDialog()"
          >mdi-link-variant</v-icon
        >
      </template>
      <span>Link</span>
    </v-tooltip>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="linkCategoryDialog" max-width="800">
      <v-card v-if="scrapedCategory">
        <v-card-title>
          Link Scraped Category to BambaZonke Category
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form
              ref="validLinkedCategoryForm"
              v-model="validLinkedCategoryForm"
              lazy-validation>
            <h3>{{scrapedCategory.name}}</h3>
            <v-autocomplete
                v-model="scrapedCategory.mappedCategoryId"
                :items="categories"
                :item-value="'id'"
                :item-text="'name'"
                outlined
                dense
                chips
                small-chips
                label="Linked Category"
                prepend-icon="mdi-tractor"
                :rules="[(v) => !!v || 'A linked category is required']"
                :messages="['Choose a BambaZonke category for this scraped category to be linked to']"
            ></v-autocomplete>
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
              :disabled="!validLinkedCategoryForm"
              color="primary"
              text
              v-on:click="linkToCategory()">
            Save
          </v-btn>
          <v-btn
              :disabled="loading"
              color="primary"
              text
              @click="linkCategoryDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    categories: [],
    scrapedCategory: null,
    saveCallBack: null,
  },
  data() {
    return {
      loading: false,
      validLinkedCategoryForm: true,
      linkCategoryDialog: false,
    }
  },
  mounted() {

  },
  methods: {
    async openDialog() {
      this.linkCategoryDialog = true;
    },    
    async linkToCategory() {
      if (this.$refs.validLinkedCategoryForm.validate()) {
        this.loading = true;
        const scrapedCategoriesResponse = await this.$store.dispatch('dataGate', {
          primaryKey: 'id',
          entity: this.scrapedCategory,
          tableName: 'scrapedCategories',
          operation: 'update',
        });
        // If valid response return value
        if (scrapedCategoriesResponse && scrapedCategoriesResponse.success) {
          // this.saveCallBack = scrapedCategoriesResponse.response;
          // console.log("this.saveCallBack",this.saveCallBack);
          // this.categories.push(this.category);
          const categoryLinkResponse = await this.$store.dispatch("callMiddlewareRoute", {
            linkedScrapedCategory: this.scrapedCategory,
            route: 'categories/linkCategory'
          });
        }
        this.loading = false;
        this.linkCategoryDialog = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
