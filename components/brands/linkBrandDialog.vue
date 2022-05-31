<template>
  <div>
    <v-icon
      color="primary"
      class="icon-style hide-on-desktop"
      dark
      @click="openDialog()"
    >
      mdi-arrow-right-thick
    </v-icon>

    <!--New Category Dialog-->
    <v-dialog
      style="z-index: 10000"
      v-model="newCategoryDialog"
      max-width="800"
    >
      <v-card v-if="brand">
        <v-card-title> Link Brand </v-card-title>
        <v-card-subtitle>
          Link a scraped brand to a Bambazonke brand
        </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
            ref="newCategoryForm"
            v-model="validBrandForm"
            lazy-validation
          >
            <v-text-field
              disabled
              prepend-icon="mdi-card-account-details-outline"
              v-model="brand.name"
              :rules="[(v) => !!v || 'A Name is required']"
              hint="The name of the brand"
              label="Name"
            ></v-text-field>
            <v-switch
              v-model="brand.publish"
              label="Published"
              disabled
            ></v-switch>
            <v-select
              label="Bambazonke Brand Link"
              item-text="name"
              item-value="id"
              :items="bamBazonkeBrands"
              width="100%"
              v-model="brand.mappedBrandId"
              class="mt-3"
            ></v-select>
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
            Link
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
    brand: null,
    brandCreateCallBackEdit: null,
    bamBazonkeBrands: [],
  },
  data() {
    return {
      loading: false,
      validBrandForm: true,
      newCategoryDialog: false,
      linkBrand: null,
    };
  },
  mounted() {},
  methods: {
    async openDialog() {
      this.newCategoryDialog = true;
    },
    async saveBrand() {
      console.log(this.brand);

      this.loading = true;
      // Save the  category if the form is valid
      if (this.$refs.newCategoryForm.validate()) {
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.brand,
          tableName: "scrapedBrands",
          operation: "update",
        });
        // If valid response return value
        if (response && response.response) {
          this.brandCreateCallBackEdit(this.brand);
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
