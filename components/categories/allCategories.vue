<template>
  <div class="table-responsive">
    <div class="table-responsive">
      <div class="container">
        <div class="row">
          <!-- Main Categories -->
          <div class="col-sm">
            <div>
              <h3 style="margin-bottom:20px;">Category</h3>
            </div>
            <table class="table table-striped table-sm">
              <!-- <thead>
                <tr>
                  <th scope="col">Category Name</th>
                  <th scope="col"></th>
                </tr>
              </thead> -->
              <tbody class="table-row">
                <tr
                  v-for="(category, index) of categories"
                  :key="index"
                >
                  <td class="cell-style" @click="filterSubcategories(category)"><h5>{{ category.name }}</h5></td>
                  <td class="edit-button-cell-style"><h6 @click="goToCategoryDashboard(category)"><i class="fa fas fa-pencil"   style="margin-top:5px" ></i></h6></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="vr" style="width:2px;"></div>
          <!-- Subcategories -->
          <div class="col-sm">
            <div>
              <h3 style="margin-bottom:20px;">Subcategories</h3>
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
                  v-for="(subCategory, index) of filteredSubcategories"
                  :key="index"
                >
                  <td class="cell-style"><h5>{{ subCategory.name }}</h5></td>
                  <td class="edit-button-cell-style"><h6 @click="goToCategoryDashboard(subCategory)"><i class="fa fas fa-pencil" style="margin-top:5px"></i></h6></td>
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
export default {
  props: {
    type: "",
    categories: [],
  },
  data() {
    return {
      mainCategories: [],
      filteredSubcategories: [],
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
    async filterSubcategories(category){
      this.filteredSubcategories = [];

      const subcategoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read',
        whereCriteria: {parentId: category.id}
      });

      if(subcategoriesResponse.data){
        this.filteredSubcategories = subcategoriesResponse.data   
      }
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
</style>
