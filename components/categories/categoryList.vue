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
          </tr>
        </thead>
        <tbody>
        <tr
            @click="goToCategoryDashboard(category)"
            v-for="(category, index) of categories" :key="index">
          <td>{{category.name}}</td>
          <td>{{parentCategoryName(category.parentId)}}</td>
          <td>{{category.publish}}</td>
          <td>{{category.createdAt}}</td>
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
    type: '',
    categories: [],
  },
  data() {
    return {

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
  }
}
</script>

<style scoped>


.section-heading{
  margin-top: 30px;
}


</style>
