<template>
  <div>
    <button
      @click="openDialog()"
      type="button"
      class="btn btn-sm btn-outline-secondary"
    >
      New Category
    </button>
    <!--New Category Dialog-->
    <v-dialog
      style="z-index: 10000"
      v-model="newCategoryDialog"
      max-width="800"
    >
      <v-card v-if="category">
        <v-card-title> New Category </v-card-title>
        <v-card-subtitle> Create a new category </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
            ref="newCategoryForm"
            v-model="validCategoryForm"
            lazy-validation
          >
            <v-text-field
              prepend-icon="mdi-card-account-details-outline"
              v-model="category.name"
              :rules="[(v) => !!v || 'A Name is required']"
              hint="The name of the category"
              v-on:change="checkIfCategoryExists(category.name)"
              label="Name"
            ></v-text-field>
            <div v-show="categoryExists">
              <h5 style="color: red">
                This category already exists! Please enter another category
                name.
              </h5>
            </div>
            <v-select
              prepend-icon="mdi-clipboard-check-multiple"
              label="Parent"
              :item-text="'name'"
              :item-value="'id'"
              :items="availableCategories"
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
            :disabled="categoryExists"
            color="primary"
            text
            v-on:click="saveCategory"
          >
            Save
          </v-btn>
          <v-btn
            :disabled="loading"
            color="primary"
            text
            @click="newCategoryDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    categories: [],
    saveCallBack: null,
    allCategories: [],
  },
  data() {
    return {
      loading: false,
      validCategoryForm: true,
      newCategoryDialog: false,
      category: null,
      categoryExists: false,
      subCategoryExists: false,
      availableCategories: [],
    };
  },
  mounted() {},
  methods: {
    async openDialog() {
      this.newCategoryDialog = true;

      this.allCategories.forEach((element) => {
        // console.log(element);

        if (element.parentId === 0 || element.parentId == null) {
          this.availableCategories.push(element);
        }
      });

      // Create new  default category
      this.category = {
        name: "",
        parentId: null,
        publish: false,
      };
    },
    async saveCategory() {
      this.loading = true;
      // Save the new category if the form is valid
      if (this.$refs.newCategoryForm.validate()) {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.category,
          tableName: "mappedCategories",
          operation: "create",
        });
        // If valid response return value
        if (response && response.response) {
          this.saveCallBack(this.category);

          this.category.id = response.insertId;
          const responseInsertToWC = await this.$store.dispatch(
            "callMiddlewareRoute",
            {
              category: this.category,
              route: "categories/insertCategoryToWC",
            }
          );
        }
      }
      this.newCategoryDialog = false;
      this.loading = false;
    },
    async checkIfCategoryExists(categoryName) {
      const catResponse = await this.$store.dispatch("dataGate", {
        whereCriteria: { name: categoryName },
        tableName: "mappedCategories",
        operation: "read",
      });

      console.log("👉👉", catResponse.data);

      if (catResponse.data.length == 0) {
        this.categoryExists = false;
      } else {
        this.categoryExists = true;
      }
    },
  },
};
</script>

<style scoped>
</style>
