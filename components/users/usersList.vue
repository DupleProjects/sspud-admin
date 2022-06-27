<template>
  <div class="p-3" style="border-radius: 20px !important;">
    <div class="fancy-table">
      <table>
        <thead class="py-10">
        <tr class="fancy-heading-row">
          <th class="info-column" scope="col" v-on:click="sort('name')">Name <v-icon v-if="nameSort == 'ASC'" color="white" small>mdi-arrow-up</v-icon><v-icon v-if="nameSort == 'DESC'" color="white" small>mdi-arrow-down</v-icon></th>
          <th class="info-column" scope="col" v-on:click="sort('surname')">Surname <v-icon v-if="surnameSort == 'ASC'" color="white" small>mdi-arrow-up</v-icon><v-icon v-if="surnameSort == 'DESC'" color="white" small>mdi-arrow-down</v-icon></th>
          <th class="info-column" scope="col" v-on:click="sort('email')">Email <v-icon v-if="emailSort == 'ASC'" color="white" small>mdi-arrow-up</v-icon><v-icon v-if="emailSort == 'DESC'" color="white" small>mdi-arrow-down</v-icon></th>
          <th class="info-column" scope="col" v-on:click="sort('role')">Role <v-icon v-if="roleSort == 'ASC'" color="white" small>mdi-arrow-up</v-icon><v-icon v-if="roleSort == 'DESC'" color="white" small>mdi-arrow-down</v-icon></th>
          <th class="actions-column" scope="col"></th>
        </tr>
        </thead>
        <tbody class="product-list">
        <tr v-for="(user, index) of users" :key="index" class="fancy-row">
          <td class="info-column">{{ user.name }}</td>
          <td class="info-column">{{ user.surname }}</td>
          <td class="info-column">{{ user.email }}</td>
          <td class="info-column">{{ user.role }}</td>
          <td class="actions-column">
            <div class="d-flex">
              <edit-user-dialog
                  :users="users"
                  :editedUser="user"
                  :usersCallBackEdit="usersCallBackEdit"
              />
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      small
                      class="button-style"
                      text
                      @click="openTheDeleteDialog(user)"
                      style="text-align: center"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon small>mdi-trash-can</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </div>
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
        <v-card-title> Delete User </v-card-title>
        <v-card-subtitle>
          Are you sure that you want to delete this user? This action
          cannot be undone.
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              v-on:click="deleteUser(userToDelete)"
          >
            Confirm Delete
          </v-btn>
          <v-btn color="primary" text @click="closeTheDeleteDialog()"
          >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import editUserDialog from "./editUserDialog.vue";
export default {
  components: { editUserDialog },
  props: {
    type: "",
    products: [],
    allCategories: [],
    deleteProductCallBack: null,
    users: [],
    saveCallBack: null,
    sortCallback: null
  },
  data() {
    return {
      deleteDialog: false,
      loading: false,
      userToDelete: {},
      sortCriteria: {},
      sortObject: {},
      nameSort: null,
      surnameSort: null,
      emailSort: null,
      roleSort: null,
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
      console.log("🔥🔥On Click", this.userToDelete.id);
      this.deleteDialog = true;
    },
    async usersCallBackEdit(usersCallBack) {
      await this.saveCallBack();
    },
    async deleteUser(user) {
      this.loading = true;
      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: user,
        tableName: "users",
        operation: "delete",
      });
      this.loading = false;
      this.deleteDialog = false;
    },
    sort(calledFrom){
      
      // this.loading = true;

      if (this.sortObject.hasOwnProperty(calledFrom)) {
        if (this.sortObject[calledFrom] === 'DESC') {
            // Third Click
            delete this.sortObject[calledFrom]
            if(calledFrom == 'name'){
              this.nameSort = null
            }
            else if(calledFrom == 'surname'){
              this.surnameSort = null
            }
            else if(calledFrom == 'email'){
              this.emailSort = null
            }
            else if(calledFrom == 'role'){
              this.roleSort = null
            }
        } else {
            // Second Click
              this.sortObject[calledFrom] = 'DESC'
              if(calledFrom == 'name'){
                this.nameSort = 'DESC'
              }
              else if(calledFrom == 'surname'){
                this.surnameSort = 'DESC'
              }
              else if(calledFrom == 'email'){
                this.emailSort = 'DESC'
              }
              else if(calledFrom == 'role'){
                this.roleSort = 'DESC'
              }
        }
      } else {
          // First Click
          this.sortObject[calledFrom] = 'ASC'
          if(calledFrom == 'name'){
            this.nameSort = 'ASC'
          }
          else if(calledFrom == 'surname'){
            this.surnameSort = 'ASC'
          }
          else if(calledFrom == 'email'){
            this.emailSort = 'ASC'
          }
          else if(calledFrom == 'role'){
            this.roleSort = 'ASC'
          }
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
