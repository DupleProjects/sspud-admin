<template>
  <div class="table-responsive">
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Parent</th>
            <th scope="col">Publish</th>
            <th scope="col">CreatedAt</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
        <tr
            v-for="(category, index) of categories" :key="index">
          <td>{{category.name}}</td>
          <td>{{parentCategoryName(category.parentId)}}</td>
          <td>{{category.publish}}</td>
          <td>{{category.createdAt}}</td>
          <td>
            <!-- Edit button -->
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    class="button-style"
                    text
                    @click="goToCategoryDashboard(category)"
                    style="text-align: center"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>mdi-lead-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    class="button-style"
                    text
                    @click="checkForLinkedSubcategories(category)"
                    style="text-align: center"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>mdi-trash-can</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--Delete Dialog-->
    <v-dialog
        style="z-index: 10000"
        v-model="deleteDialog"
        max-width="800"
    >
      <v-card>
        <v-card-title> Delete Category </v-card-title>
        <v-card-subtitle>
          Are you sure that you want to delete this category? This action
          cannot be undone.
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              v-on:click="deleteCategory(categoryToDelete)"
          >
            Confirm Delete
          </v-btn>
          <v-btn color="primary" text @click="closeTheDeleteDialog()"
          >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Select New Main Category-->
    <v-dialog
        style="z-index: 10000"
        v-model="linkCategoriesDialog"
        max-width="800"
    >
      <v-card>
        <v-card-title> Select New Parent Category </v-card-title>
        <v-card-subtitle v-if="linkedSubcategoryCount > 0">
          Select a new parent category for the {{linkedSubcategoryCount}} subcategories that are currently linked to {{categoryToDelete.name}}
        </v-card-subtitle>
        <v-card-subtitle v-if="linkedSubcategoryCount == 0">
          Create a new subcategory for the products that are currently linked to {{categoryToDelete.name}} to be reassigned to.
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
              prepend-icon="mdi-card-account-details-outline"
              disabled
              :messages="['The current parent category']"
              :label="categoryToDelete.name"
          ></v-text-field>
          <v-row>
          <v-col cols="4">
          <v-checkbox
            v-model="newCheckbox"
            :disabled="disableNew"
            v-on:change="selectField('new')"
            label="Create New Subcategory:"
          ></v-checkbox>
          </v-col>
          <v-col cols="4">
          <v-checkbox
            v-model="existingCheckbox"
            :disabled="disableExisting"
            v-on:change="selectField('existing')"
            label="Select Existing Subcategory:"
          ></v-checkbox>
          </v-col>
          </v-row>
          <v-autocomplete
              v-if="existingCheckbox == true"
              prepend-icon="mdi-clipboard-check-multiple"
              label="Parent"
              required
              :item-text="'name'"
              :item-value="'id'"
              :items="availableCategories"
              v-model="newParentId"
              :messages="['Choose a new parent category']"
          ></v-autocomplete>
          <v-text-field
              v-if="newCheckbox == true"
              v-model="newCreatedParentName"
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
              v-on:click="setNewParentId()"
          >
            Confirm
          </v-btn>
          <v-btn color="primary" text @click="closeLinkCategoriesDialog()"
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
    categories: [],
    allCategories: []
  },
  data() {
    return {
      deleteDialog: false,
      linkCategoriesDialog: false,
      linkedSubcategoryCount: 0,
      newParentId: null,
      confirmedNewParentId: null,
      confirmedNewCategoryName: null,
      categoryToDelete: {},
      availableCategories: [],
      newAssignedCategory: false,
      newCreatedParentName: null,
      disableExisting: false,
      disableNew: false,
      newCheckbox: false,
      existingCheckbox:false
    }
  },
  mounted() {
  },
  methods: {
    goToCategoryDashboard(category) {
      this.$router.push(
          {
            name: 'categories-dashboard-id',
            params: {id: category.id}
          }
      )
    },
    parentCategoryName: function (parentId) {
      const parentCategory = baseMixin.methods.getObjectsWhereKeysHaveValues(
          this.categories,
          {id: parentId},
          true
      )
      if (parentCategory) {
        return parentCategory.name;
      }
      return 'No parent category'
    },
    checkForLinkedSubcategories(category){
      this.categoryToDelete = category;
      var counter = 0;
      this.availableCategories = [];

      if(category.parentId != 0 && category.parentId != null){
          this.allCategories.forEach(element => {
              if (element.parentId == category.parentId && element.id != category.id) {
                this.availableCategories.push(element);
              }
          });

          if(this.availableCategories.length == 0){
            this.existingCheckbox = false;
            this.newCheckbox = true;
            this.disableExisting = true;
            this.disableNew = true;
            this.newCreatedParentName = null;
          }else{
            this.existingCheckbox = true;
            this.newCheckbox = false;
            this.disableExisting = true;
            this.disableNew = false;
            this.newParentId = null;
          }

          this.linkCategoriesDialog = true;
          this.newAssignedCategory = true;
          this.linkedSubcategoryCount = 0;
          
          this.newParentId = null
          this.newCreatedParentName = null


      }else{
        this.newAssignedCategory = false;
          this.allCategories.forEach(element => {
            if (element.parentId === category.id) {
              counter ++;
            }
            if (element.id != category.id) {
              if (element.parentId === 0 || element.parentId == null) {
                this.availableCategories.push(element);
              }
            }
          });

          if(this.availableCategories.length == 0){
            this.existingCheckbox = false;
            this.newCheckbox = true;
            this.disableExisting = true;
            this.disableNew = true;
            this.newCreatedParentName = null;
          }else{
            this.existingCheckbox = true;
            this.newCheckbox = false;
            this.disableExisting = true;
            this.disableNew = false;
            this.newParentId = null;
          }

          if(counter >= 1){
            this.linkedSubcategoryCount = counter;
            this.linkCategoriesDialog = true;
          }else{
            this.openTheDeleteDialog()
          }
      }
      

    },
    openTheDeleteDialog(category) {
      if(category) {
        this.categoryToDelete = category;
      }
      this.deleteDialog = true;
    },
    closeTheDeleteDialog() {
      this.deleteDialog = false;
      this.confirmedNewParentId = null;
      this.confirmedNewCategoryName = null;
      this.categoryToDelete = {};
    },
    closeLinkCategoriesDialog() {
      this.linkCategoriesDialog = false;
      // this.categoryToDelete = {};
    },
    setNewParentId(){
      if(this.newParentId){
        this.confirmedNewParentId = this.newParentId;
      }else{
        this.confirmedNewParentId = null;
      }
      if(this.newCreatedParentName){
        this.confirmedNewCategoryName = this.newCreatedParentName;
      }else{
        this.confirmedNewCategoryName = null;
      }

      console.log("👉Cat to delete",this.categoryToDelete);
      console.log("👉👉New parentId",this.confirmedNewParentId);
      console.log("👉👉👉New category name",this.confirmedNewCategoryName);

      this.linkCategoriesDialog = false;
      this.deleteDialog = true;
    },
    async deleteCategory() {
      // delete the product from scrapedProducts
      const deleteResponse = await this.$store.dispatch("callMiddlewareRoute", {
        category: this.categoryToDelete,
        route: 'categories/deleteCategory',
        newParentCategoryId: this.confirmedNewParentId,
        newCategoryName: this.confirmedNewCategoryName
      });

      this.deleteDialog = false;
      this.closeTheDeleteDialog();
    },
    selectField(checkbox){
      if(checkbox == "new"){
        this.existingCheckbox = false;
        this.disableNew = true;
        this.disableExisting = false;
        this.newParentId = null;
      }
      if(checkbox == "existing"){
        this.newCheckbox = false;
        this.disableNew = false;
        this.disableExisting = true;
        this.newCreatedParentName = null;
      }
    }
  }
}
</script>

<style scoped>


.section-heading{
  margin-top: 30px;
}


</style>
