<template>
  <div>
    <button
        @click="openDialog()"
        type="button" class="btn btn-sm btn-outline-secondary">
      New Category
    </button>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="newCategoryDialog" max-width="800">
      <v-card v-if="category">
        <v-card-title>
          New Category
        </v-card-title>
        <v-card-subtitle>
          Create a new category
        </v-card-subtitle>
        <v-card-text class="pb-0">
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
              v-on:click="saveCategory">
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
    saveCallBack: null
  },
  data() {
    return {
      loading: false,
      validCategoryForm: true,
      newCategoryDialog: false,
      category: null,
    }
  },
  mounted() {

  },
  methods: {
    async openDialog() {
      this.newCategoryDialog = true;
      // Create new  default category
      this.category = {
        name: '',
        parentId: null,
        publish: false
      }
    },
    async saveCategory() {
      this.loading = true;
    //   // Save the new category if the form is valid
    console.log("SAVED this.category",this.category);
    if(this.category.parentId == null){
      this.category.parentId = 0;
    }
      if (this.$refs.newCategoryForm.validate()) {
        const response = await this.$store.dispatch('dataGate', {
          primaryKey: 'id',
          entity: this.category,
          tableName: 'mappedCategories',
          operation: 'create',
        })
        // If valid response return value
        if (response && response.response) {
          this.saveCallBack = response.response;
          console.log("this.saveCallBack",this.saveCallBack);
          this.categories.push(this.category);
        }
      }
      this.newCategoryDialog = false;
      this.loading = false;
    },
  }
}
</script>

<style scoped>

</style>
