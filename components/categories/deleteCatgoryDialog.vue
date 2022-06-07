<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            small
            class="button-style"
            text
            @click="checkForLinkedSubcategories()"
            style="text-align: center"
            v-bind="attrs"
            v-on="on"
        >
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
      </template>
      <span>Delete</span>
    </v-tooltip>
    <!--Delete Dialog-->
    <v-dialog
        style="z-index: 10000"
        v-model="deleteDialog"
        max-width="800">
      <v-card>
        <v-card-title> Delete Category </v-card-title>
        <v-card-subtitle>
          Are you sure that you want to delete this category? This action
          cannot be undone.
        </v-card-subtitle>
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
              color="primary"
              text
              v-on:click="deleteCategory(category)">
            Confirm Delete
          </v-btn>
          <v-btn :disabled="loading" color="primary" text @click="closeTheDeleteDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Select New Main Category-->
    <v-dialog
        style="z-index: 10000"
        v-model="linkCategoriesDialog"
        max-width="800">
      <v-card>
        <v-card-title> Select Replacement </v-card-title>
        <v-card-subtitle>
          When deleting a category a replacement should be specified. Either choose one from the available options or create a new category.
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
              prepend-icon="mdi-card-account-details-outline"
              disabled
              :messages="['Category to be deleted']"
              :label="category.name"
          ></v-text-field>
          <v-radio-group v-model="createNewCategory">
            <v-radio
                :label="`Create New Subcategory`"
                :value="true"
            ></v-radio>
            <v-radio
                :label="`Select Existing Subcategory`"
                :value="false"
            ></v-radio>
          </v-radio-group>
          <v-autocomplete
              v-if="!createNewCategory"
              prepend-icon="mdi-clipboard-check-multiple"
              label="Replacement"
              required
              :item-text="'name'"
              return-object
              :items="replacementAlternatives"
              v-model="replacementCategory"
              :messages="['Choose a replacement category']"
          ></v-autocomplete>
          <v-text-field
              v-if="createNewCategory"
              v-model="newCategoryName"
              required
              prepend-icon="mdi-card-account-details-outline"
              :messages="['Create a new subcategory for the products that are currently linked to the current subcategory to be reassigned to.']"
              label="Create a new category"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              :disabled="loading"
              v-on:click="openConfirmation()">
            Confirm
          </v-btn>
          <v-btn :disabled="loading" color="primary" text @click="closeLinkCategoriesDialog()"
          >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    category: [],
    allCategories: []
  },
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      createNewCategory: false,
      deleteDialog: false,
      linkCategoriesDialog: false,
      replacementCategory: null,
      replacementAlternatives: [],
      newCategoryName: null,
    };
  },
  mounted() {},
  methods: {
    checkForLinkedSubcategories() {
      this.replacementAlternatives = [];
      if (this.category.parentId) {
        // If this is a sub category then all the replacement options should have the same parent
        this.replacementAlternatives = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {parentId: this.category.parentId}, false);
      } else {
        this.replacementAlternatives = baseMixin.methods.getObjectsWherePropertyHasValues(this.allCategories, 'parentId', [0, null]);
      }
      // Remove current category from list
      for (let i = 0; i < this.replacementAlternatives.length; i++) {
        if (this.replacementAlternatives[i].id === this.category.id) {
          this.replacementAlternatives.splice(i, 1);
          break;
        }
      }
      // Open the dialog
      this.linkCategoriesDialog = true;
    },
    closeTheDeleteDialog() {
      this.deleteDialog = false;
    },
    closeLinkCategoriesDialog() {
      this.linkCategoriesDialog = false;
    },
    openConfirmation(){
      this.linkCategoriesDialog = false;
      this.deleteDialog = true;
    },
    async deleteCategory() {
      console.log("👉Cat to delete",this.category);
      console.log("👉👉replacementCategory",this.replacementCategory);
      console.log("👉👉👉New category name",this.newCategoryName);
      // delete the product from scrapedProducts
      const deleteResponse = await this.$store.dispatch("callMiddlewareRoute", {
        categoryToDelete: this.category,
        route: 'categories/deleteCategory',
        replacementCategory: this.replacementCategory,
        newCategoryName: this.newCategoryName
      });

      this.closeTheDeleteDialog();
    },
  },
};
</script>

<style scoped>
</style>
