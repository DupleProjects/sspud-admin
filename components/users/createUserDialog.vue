<template>
  <div>
    <button
        @click="openDialog()"
        type="button" class="btn btn-sm btn-outline-secondary">
      New User
    </button>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="newUserDialog" max-width="800">
      <v-card v-if="user">
        <v-card-title>
          New User
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
                v-model="user.name"
                :rules="[(v) => !!v || 'A name is required']"
                hint="The user's name"
                label="Name"
            ></v-text-field>
            <v-text-field
                prepend-icon="mdi-card-account-details-outline"
                v-model="user.surname"
                :rules="[(v) => !!v || 'A surname is required']"
                hint="The user's surname"
                label="Surname"
            ></v-text-field>
            <v-text-field
                prepend-icon="mdi-card-account-details-outline"
                v-model="user.email"
                :rules="[(v) => !!v || 'An email address is required']"
                hint="The user's email address"
                label="Email"
            ></v-text-field>
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
              v-on:click="saveUser">
            Save
          </v-btn>
          <v-btn
              :disabled="loading"
              color="primary"
              text
              @click="newUserDialog = false">Close</v-btn>
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
  },
  data() {
    return {
      loading: false,
      validCategoryForm: true,
      newUserDialog: false,
      user: null,
    }
  },
  mounted() {

  },
  methods: {
    async openDialog() {
      this.newUserDialog = true;
      // Create new  default user
      this.user = {
        name: '',
        surname: '',
        email: '',
        password: ''
      }
    },
    async saveUser() {
      this.loading = true;
      console.log("✔️✔️", this.user);
     // Save the new user if the form is valid
      if (this.$refs.newCategoryForm.validate()) {
        const response = await this.$store.dispatch('dataGate', {
          entity: this.user,
          tableName: 'users',
          operation: 'create',
        })
        // If valid response return value
        if (response && response.response) {
            console.log("1. createUserDialog Response Received!");
          await this.saveCallBack(this.user)
        }
      }
      this.newUserDialog = false;
      this.loading = false;
    },
  }
}
</script>

<style scoped>

</style>
