<template>
  <div class="table-responsive">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th class="info-column" scope="col">Name</th>
          <th class="info-column" scope="col">Surname</th>
          <th class="info-column" scope="col">Email</th>
          <th class="actions-column" scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) of users" :key="index">
          <td class="info-column">{{ user.name }}</td>
          <td class="info-column">{{ user.surname }}</td>
          <td class="info-column">{{ user.email }}</td>
          <td class="actions-column">
            <div>
              <edit-user-dialog :users="users" :editedUser="user" :usersCallBack="usersCallBack" />
              <!-- View Button -->
              <!-- <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="type !== 'staged'"
                    small
                    class=""
                    text
                    @click="goToProductDashboard(product)"
                    style="text-align: center"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>View</span>
              </v-tooltip> -->
              <!-- View Button -->
              <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      class="button-style"
                      text
                      @click="openTheDeleteDialog(product)"
                      style="text-align: center"
                      v-bind="attrs"
                      v-on="on">
                      <v-icon small>mdi-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              <!--Delete Dialog-->
              <v-dialog
                  style="z-index: 10000"
                  v-model="deleteDialog"
                  max-width="800"
                >
                  <v-card>
                    <v-card-title> Delete Product </v-card-title>
                    <v-card-subtitle>
                      Are you sure that you want to delete this product from
                      staged products? This action cannot be undone.
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <!-- <v-progress-circular
                        v-if="loading"
                        :size="20"
                        indeterminate
                        color="primary"
                      ></v-progress-circular> -->
                      <v-btn
                        color="primary"
                        text
                        v-on:click="deleteThisProduct()"
                      >
                        Confirm Delete
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="closeTheDeleteDialog()"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import EditUserDialog from '../../components/users/editUserDialog.vue';

export default {
  components: { editUserDialogEditUserDialog },
  props: {
    type: "",
    products: [],
    allCategories: [],
    allBrands: [],
    deleteProductCallBack: null,
    users: [],
    usersCallBack: null,
    saveCallBack: null
  },
  data() {
    return {
      deleteDialog: false,
      loading: false,
      productToDelete: {}
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
      this.productToDelete = {};
    },
    getBrandName(brandId) {
      if (this.allBrands) {
        const brand = this.allBrands.find((x) => x.id === brandId);
        if (brand) {
          return brand.name;
        }
      }
      return 'Brand Not Found';
    },
    getCategoryName(categoryId) {
      if (this.allCategories) {
        const category = this.allCategories.find((x) => x.id === categoryId);
        if (category) {
          return category.name;
        }
      }
      return 'Category Not Found';
    },
    async deleteThisProduct() {
      console.log("🔥🔥🔥🔥On Confirm",this.productToDelete.id);
      //delete the product from scrapedProducts
      const deleteResponse = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: this.productToDelete,
        tableName: "stagedProducts",
        operation: "delete",
      });

      if (deleteResponse && deleteResponse.response) {
        console.log("😁SUCCESSFULLY DELETED PRODUCT",this.productToDelete.id);
          this.deleteProductCallBack()
      } else {
        console.log("🔥COULD NOT DELETE PRODUCT");
      }
      this.deleteDialog = false;
      this.closeTheDeleteDialog();
    },
    async openTheDeleteDialog(product) { 
      this.productToDelete = product;
      console.log("🔥🔥On Click",this.productToDelete.id);   
      this.deleteDialog = true;
    },
    usersCallBack(usersCallBack){
        this.saveCallBack();
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
</style>
