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
            <categories-delete-catgory-dialog :category="category" :allCategories="allCategories" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
  }
}
</script>

<style scoped>


.section-heading{
  margin-top: 30px;
}


</style>
