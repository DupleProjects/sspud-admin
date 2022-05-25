<template>
  <div>
    <button
      @click="openDialog()"
      type="button"
      class="btn btn-sm btn-outline-secondary"
    >
      New Brand
    </button>
    <!--New Category Dialog-->
    <v-dialog
      style="z-index: 10000"
      v-model="newCategoryDialog"
      max-width="800"
    >
      <v-card v-if="brand">
        <v-card-title> New Brand </v-card-title>
        <v-card-subtitle> Create a new brand </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
            ref="newCategoryForm"
            v-model="validCategoryForm"
            lazy-validation
          >
            <v-text-field
              prepend-icon="mdi-card-account-details-outline"
              v-model="brand.name"
              :rules="[(v) => !!v || 'A Name is required']"
              hint="The name of the brand"
              label="Name"
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
            :disabled="!validBrandForm"
            color="primary"
            text
            v-on:click="saveBrand"
          >
            Save
          </v-btn>
          <v-btn
            :disabled="loading"
            color="primary"
            text
            @click="newCategoryDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    brands: [],
    brandCreateCallBack: null,
  },
  data() {
    return {
      loading: false,
      validBrandForm: true,
      newCategoryDialog: false,
      brand: null,
    };
  },
  mounted() {},
  methods: {
    async openDialog() {
      this.newCategoryDialog = true;
      // Create new  default category
      this.brand = {
        name: "",
        publish: false,
      };
    },
    async saveBrand() {
      this.loading = true;
      // Save the new category if the form is valid
      if (this.$refs.newCategoryForm.validate()) {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.brand,
          tableName: "mappedBrands",
          operation: "create",
        });
        // If valid response return value
        if (response && response.response) {
          this.brandCreateCallBack(this.brand);
          //this.brands.push(this.brand);
        }
      }
      this.newCategoryDialog = false;
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
