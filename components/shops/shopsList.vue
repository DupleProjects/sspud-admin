<template>
  <div class="p-3" style="border-radius: 20px !important;height:75vh; overflow-y:auto; overflow-x: hidden;">
    <div class="fancy-table">
      <table>
        <thead class="py-10" style="position:sticky; top: 0; z-index: 1;">
        <tr class="fancy-heading-row">
          <th class="info-column" scope="col" v-on:click="sort('name')">Name</th>
          <th class="info-column" scope="col" v-on:click="sort('active')">Status</th>
          <th class="info-column" scope="col" v-on:click="sort('deliveryCost')">Delivery Cost</th>
          <th class="actions-column" scope="col"></th>
        </tr>
        </thead>
        <tbody class="product-list">
        <tr v-for="(shop, index) of shops" :key="index" class="fancy-row">
          <td class="info-column">{{ shop.name }}</td>
          <td class="info-column" v-if="shop.active"> <h6 style="color:green">ACTIVE</h6> </td>
          <td class="info-column" v-else> <h6 style="color:red">INACTIVE</h6> </td>
          <td class="info-column"> <span v-if="shop.deliveryCost"> R {{ getCost(shop.deliveryCost) }}</span></td>
          <td class="actions-column">
            <div class="d-flex">
              <edit-shop-dialog
                  :shops="shops"
                  :editedShop="shop"
                  :shopsCallBackEdit="shopsCallBackEdit"
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import editShopDialog from "./editShopDialog.vue";
export default {
  components: { editShopDialog },
  props: {
    type: "",
    products: [],
    allCategories: [],
    deleteProductCallBack: null,
    shops: [],
    saveCallBack: null,
    sortCallback: null
  },
  data() {
    return {
      deleteDialog: false,
      loading: false,
      userToDelete: {},
      sortObject: {}
    };
  },
  mounted() {},
  methods: {
    goToProductDashboard(product) {
      const params = { id: product.id };
      // Go to different dashboards based on type
      if (this.type === "scraped") {
        this.$router.push({
          name: "products-scraped-dashboard-id",
          params,
        });
      } else if (this.type === "staged") {
        this.$router.push({
          name: "products-staged-dashboard-id",
          params,
        });
      } else if (this.type === "published") {
        this.$router.push({
          name: "products-published-dashboard-id",
          params,
        });
      }
    },
    closeTheDeleteDialog() {
      this.deleteDialog = false;
      this.userToDelete = {};
    },
    getCategoryName(categoryId) {
      if (this.allCategories) {
        const category = this.allCategories.find((x) => x.id === categoryId);
        if (category) {
          return category.name;
        }
      }
      return "Category Not Found";
    },
    openTheDeleteDialog(user) {
      this.userToDelete = user;
      this.deleteDialog = true;
    },
    async shopsCallBackEdit(usersCallBack) {
      await this.saveCallBack();
    },
    getCost(value){
        if(value != null && value != undefined && typeof(value) != "string"){
            var newValue = value.toFixed(2);
            return newValue;
        }else{
            return null;
        }
    },
    sort(calledFrom){
      
      // this.loading = true;

      if (this.sortObject.hasOwnProperty(calledFrom)) {
        if (this.sortObject[calledFrom] === 'DESC') {
            // Third Click
            delete this.sortObject[calledFrom]
        } else {
            // Second Click
              this.sortObject[calledFrom] = 'DESC'
        }
      } else {
          // First Click
          this.sortObject[calledFrom] = 'ASC'
      }

      this.sortCallback(this.sortObject)
      
    }
  },
};
</script>

<style scoped>
.info-column {
  width: 30%;
}
.actions-column {
  width: 10%;
  text-align: center;
}
.info-column2 {
  width: 7%;
}

.name-column {
  width: 28%;
}

/* .button-style{
  float:right;
} */


.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  /* min-height: 75vh; */
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

.fancy-heading-row th {
  font-weight: normal;
  padding: 8px;
  padding-left: 15px;
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
  background-color: #f5f6f8;
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

.fancy-row td {
  padding: 8px;
  font-size: 15px;
  padding-left: 15px;
}

.product-list {
  min-height: 68vh;
  max-height: 68vh;
  overflow: auto;
}
</style>
