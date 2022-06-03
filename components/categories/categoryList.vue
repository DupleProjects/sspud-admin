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
        <v-card-subtitle>
          Select a new parent category for the {{linkedSubcategoryCount}} subcategories that are currently linked to {{categoryToDelete.name}}
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
              prepend-icon="mdi-card-account-details-outline"
              disabled
              :messages="['The current parent category']"
              :label="categoryToDelete.name"
          ></v-text-field>
          <v-autocomplete
              prepend-icon="mdi-clipboard-check-multiple"
              label="Parent"
              :item-text="'name'"
              :item-value="'id'"
              :items="availableCategories"
              v-model="newParentId"
              :messages="['Choose a new parent category']"
          ></v-autocomplete>
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
      categoryToDelete: {},
      availableCategories: []
    }
  },
  mounted() {
    console.log("🔥",this.categories);
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
      console.log("🙌🙌", this.allCategories);
      // console.log("1. CHECK LINKED SUBCATEGORIES");
      this.categoryToDelete = category;
      var counter = 0;
      this.allCategories.forEach(element => {
        // console.log(element);
        if (element.parentId === category.id) {
          console.log(element.name);
          counter ++;
        }
        if (element.id != category.id) {
          if (element.parentId === 0 || element.parentId == null) {
            this.availableCategories.push(element);
          }
        }
        
        // var index = this.categories.find(c => c.parentId == element.id);
        // // console.log(index);
      });

        if(counter >= 1){
          console.log("2. OPEN FORM");
          this.linkedSubcategoryCount = counter;
          this.linkCategoriesDialog = true;
        }else{
          this.openTheDeleteDialog()
        }

    },
    openTheDeleteDialog(category) {
      console.log("3. OPEN DELETE DIALOG");
      if(category) {
        this.categoryToDelete = category;
      }
      // console.log("🔥🔥On Click", this.categoryToDelete);
      this.deleteDialog = true;
    },
    closeTheDeleteDialog() {
      this.deleteDialog = false;
      this.categoryToDelete = {};
    },
    closeLinkCategoriesDialog() {
      console.log("3. CLOSE LINKED FORM");
      this.linkCategoriesDialog = false;
      // this.categoryToDelete = {};
    },
    setNewParentId(){
      this.confirmedNewParentId = this.newParentId;
      this.linkCategoriesDialog = false;
      this.deleteDialog = true;
    }
    // async deleteCategory() {
    //   console.log("🔥🔥🔥🔥On Confirm",this.categoryToDelete.id);
      //delete the product from scrapedProducts
      // const deleteResponse = await this.$store.dispatch("callMiddlewareRoute", {
      //   category: this.categoryToDelete,
      //   route: 'categories/deleteCategory',
      //   newParentCategory: this.confirmedNewParentId
      // });

    //   if (deleteResponse && deleteResponse.response) {
    //     console.log("😁SUCCESSFULLY DELETED PRODUCT",this.categoryToDelete.id + "  " + this.categoryToDelete.name);
    //       this.deleteProductCallBack()
    //   } else {
    //     console.log("🔥COULD NOT DELETE PRODUCT");
    //   }

    //   this.deleteDialog = false;
    //   this.closeTheDeleteDialog();
    // },
  }
}
</script>

<style scoped>


.section-heading{
  margin-top: 30px;
}


</style>
