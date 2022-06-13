<template>
  <div>
    <!-- <v-icon
      color="primary"
      class="icon-style hide-on-desktop"
      dark
      @click="openDialog()"
    >
      mdi-arrow-right-thick
    </v-icon> -->
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on" color="blue" medium @click="openDialog()">mdi-link-variant</v-icon>
      </template>
      <span>Link</span>
    </v-tooltip>

    <!--New Category Dialog-->
    <v-dialog
      style="z-index: 10000"
      v-model="newCategoryDialog"
      max-width="800">
      <v-card v-if="brand">
        <v-card-title> Link Brand </v-card-title>
        <v-card-subtitle>
          Link a scraped brand to a Bambazonke brand
        </v-card-subtitle>
        <v-card-text class="pb-0">
          <v-form
            ref="newCategoryForm"
            v-model="validBrandForm"
            lazy-validation>
            <v-text-field
              disabled
              prepend-icon="mdi-card-account-details-outline"
              v-model="brand.name"
              :rules="[(v) => !!v || 'A Name is required']"
              hint="The name of the brand"
              label="Name"
            ></v-text-field>
            <v-autocomplete
                prepend-icon="mdi-link-variant"
                v-model="brand.mappedBrandId"
                item-text="name"
                item-value="id"
                :items="allMappedBrands"
                :hide-details="true"
                label="Bambazonke Brand Link"
                dense
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
    allMappedBrands: []
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
        if (response && response.success) {
          this.brandCreateCallBackEdit(this.brand);
          // Link staged products
          const brandLinkResponse = await this.$store.dispatch("callMiddlewareRoute", {
            brand: this.brand,
            route: 'brands/linkBrand'
          });
        }
      }
      this.newCategoryDialog = false;
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
