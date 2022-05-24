<template>
  <div>
    <h2>Category Dashboard</h2>
    <hr>
    <!--Detail Section-->
    <div v-if="category">
      <v-form
          ref="newCategoryForm"
          v-model="validCategoryForm"
          lazy-validation>
        <v-text-field
            prepend-icon="mdi-card-account-details-outline"
            v-model="category.name"
            :rules="[(v) => !!v || 'A Name is required']"
            hint="The name of the category"
            label="Name"
        ></v-text-field>
        <v-select
            prepend-icon="mdi-clipboard-check-multiple"
            label="Parent"
            :item-text="'name'"
            :item-value="'id'"
            :items="categories"
            v-model="category.parentId"
            :messages="['Choose a parent or leave blank']"
        ></v-select>
      </v-form>
    </div>
    <!--Linked Section-->
    <div>
    <categories-category-list
        :type="'mapped'"
        :categories="linkedCategories"
        :title="'Linked Categories'"/>
    </div>
    <!--Linked Scraped Categories Section-->
    <!-- <h4 class="section-heading">Linked Scraped Categories</h4> -->
    <categories-category-list
        :type="'scraped'"
        :categories="linkedScrapedCategories"
        :title="'Linked Scraped Categories'"/>
  </div>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      category: null,
      categories: [],
      validCategoryForm: true,
      linkedCategories: [],
      linkedScrapedCategories: []
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
      // console.log(this.$route.params.id);
      if (this.$route.params.id) {
        // Load all the categories so that the parent can still be chosen
        const categoriesResponse = await this.$store.dispatch('dataGate', {
          tableName: 'mappedCategories',
          operation: 'read',
        });
        if (categoriesResponse.data) {
          this.categories = categoriesResponse.data;
          console.log("👉👉👉",this.categories);
          // Get the actual category and the linked ones
          for (let i = 0; i < this.categories.length; i++) {
              // console.log("this.categories[i]",this.categories[i]);
            if (this.categories[i].id === Number(this.$route.params.id)) {
              // console.log('this.category', this.category)
              this.category = this.categories[i];
              console.log("🔥👉👇THIS CATEGORY",this.category);
            } else if (this.categories[i].parentId === Number(this.$route.params.id)) {
              this.linkedCategories.push(this.categories[i]);
            }
          }
        }
        // Now load all the linked categories
        const linkedScraped = await this.$store.dispatch('dataGate', {
          tableName: 'scrapedCategories',
          operation: 'read',
          whereCriteria: {mappedCategoryId: this.$route.params.id}
        });
        if (linkedScraped.data) {
          this.linkedScrapedCategories = linkedScraped.data;
        }
      } else {
        alert('No category id found')
      }
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
