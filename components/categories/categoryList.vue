<template>
  <div class="p-3" style="border-radius:20px !important;">
    <div  class="fancy-table">
      <table>
        <thead class="py-10">
          <tr class="fancy-heading-row">
            <th>Name</th>
            <th>Parent</th>
            <th>Publish</th>
            <th>CreatedAt</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="product-list">
        <tr
            v-for="(category, index) of categories" :key="index"
            class="fancy-row">
          <td style="font-weight:bold; font-size: 15px;">{{category.name}}</td>
          <td>{{parentCategoryName(category.parentId)}}</td>
          <td>
            <v-tooltip v-if="category.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" color="green" medium>mdi-check-circle</v-icon>
                </template>
                <span>Published</span>
              </v-tooltip>
              <v-tooltip v-if="!category.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" color="orange" medium>mdi-close-circle</v-icon>
                </template>
                <span>Published</span>
              </v-tooltip>
          </td>
          <td>
              {{formatDate(category.createdAt)}}
          </td>
          <td class="d-flex">
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
            <categories-delete-catgory-dialog :category="category" :allCategories="allCategories" :deleteCallBack="deleteCallBack" />
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
    reloadCallBack: null,
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
    deleteCallBack() {
      this.reloadCallBack();
    },
    formatDate(datetime){
      var date = new Date(datetime).toISOString().substring(0, 10)
      var time = new Date(datetime).toLocaleTimeString('en',
                 { timeStyle: 'short', hour12: false, timeZone: 'UTC' });

      return date + " " + time;
    }
  }
}
</script>

<style scoped>


.section-heading{
  margin-top: 30px;
}

.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  min-width: 600px;
  border-radius: 10px !important;
}

.fancy-heading-row {
  position: relative;
  background-color: #5268fa;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  color: white;
  border-image: initial;
  border-bottom: none;
  font-weight: normal !important;
}

.fancy-heading-row th{
  font-weight: normal;
  padding: 8px;
  padding-left:15px;
}

.fancy-row {
  position: relative;
  background-color: white;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  border-image: initial;
  border-bottom: none;
  cursor: pointer;
}


.fancy-row:hover {
  background-color: #F5F6F8;
}
.fancy-row:hover .actions-column {
  display: flex;
}
.inner-fancy-heading-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-heading-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}

.fancy-row td{
  padding: 8px;
   font-size: 15px;
   padding-left:15px;
}


.product-list {
  min-height: 68vh;
  max-height: 68vh;
  overflow: auto;
}


</style>
