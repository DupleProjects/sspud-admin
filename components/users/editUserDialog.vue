<template>
  <div>
    <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
        <v-btn
        small
        class="button-style"
        icon
        color="black"
        @click="editUser(editedUser)"
        style="text-align: center"
        v-bind="attrs"
        v-on="on"
        >
        <v-icon small>mdi-lead-pencil</v-icon>
        </v-btn>
    </template>
    <span>Edit</span>
    </v-tooltip>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="editUserDialog" max-width="800">
      <v-card v-if="editedUser">
        <v-card-title>
          Edit User
        </v-card-title>
        <v-card-subtitle>
          Create a new user
        </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
              ref="newCategoryForm"
              v-model="validCategoryForm"
              lazy-validation>
            <v-text-field
                prepend-icon="mdi-card-account-details-outline"
                v-model="editedUser.name"
                :rules="[(v) => !!v || 'A name is required']"
                hint="The user's name"
                label="Name"
            ></v-text-field>
            <v-text-field
                prepend-icon="mdi-card-account-details-outline"
                v-model="editedUser.surname"
                :rules="[(v) => !!v || 'A surname is required']"
                hint="The user's surname"
                label="Surname"
            ></v-text-field>
            <v-text-field
                prepend-icon="mdi-card-account-details-outline"
                v-model="editedUser.email"
                :rules="[(v) => !!v || 'An email address is required']"
                hint="The user's email address"
                label="Email"
            ></v-text-field>
            <v-autocomplete
              prepend-icon="mdi-card-account-details-outline"
              v-model="editedUser.role"
              :items="roles"
              label="User Role"
              required
              :rules="[(v) => !!v || 'A user role is required']"
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular
              v-if="loading"
              :size="20"
              indeterminate
              color="primary"
          ></v-progress-circular>
          <v-btn
              v-if="!loading"
              :disabled="!validCategoryForm"
              color="primary"
              text
              v-on:click="saveCategory">
            Save
          </v-btn>
          <v-btn
              :disabled="loading"
              color="primary"
              text
              @click="editUserDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    users: [],
    saveCallBack: null,
    usersCallBackEdit: null,
    editedUser: null
  },
  data() {
    return {
      loading: false,
      validCategoryForm: true,
      editUserDialog: false,
      user: null,
      roles: ["Standard","Tech Wizard","Administration"]
    }
  },
  mounted() {

  },
  methods: {
    async openDialog() { 
      this.editUserDialog = true;
      // Create new  default user
    //   this.editedUser = {
    //     name: '',
    //     surname: '',
    //     email: '',
    //     password: '',
    //   }

      console.log("⚡⚡⚡",this.editedUser);
    },
    async saveCategory() {
      this.loading = true;
     // Save the new user if the form is valid
      // Save the  category if the form is valid
      if (this.$refs.newCategoryForm.validate()) {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.editedUser,
          tableName: "users",
          operation: "update",
        });
        // If valid response return value
        if (response && response.response) {
          this.usersCallBackEdit(this.editedUser)
        }
      }
      this.editUserDialog = false;
      this.loading = false;
    },
    editUser(user){
        this.editUserDialog = true;
    }
  }
}
</script>

<style scoped>

</style>
