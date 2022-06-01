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
          </td>
        </tr>
      </tbody>
    </table>
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
  },
  data() {
    return {
      deleteDialog: false,
      loading: false,
      userToDelete: {},
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
      console.log("USER TO DELETE", user);
      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: user,
        tableName: "users",
        operation: "delete",
      });

      this.loading = true;

      const usersResponse = await this.$store.dispatch("dataGate", {
        tableName: "users",
        operation: "read",
      });

      if (usersResponse.data) {
          this.saveCallBack()
      }
      this.loading = false;
      this.deleteDialog = false;
    },
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
