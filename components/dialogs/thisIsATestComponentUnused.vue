<template>
  <div class="">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="!canDelete"
          small
          class="button-style"
          text
          @click="openDialog()"
          style="text-align: center"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
      </template>
      <span>Delete</span>
    </v-tooltip>
    <!--New Category Dialog-->
    <v-dialog style="z-index: 10000" v-model="deleteDialog" max-width="800">
      <v-card v-if="product">
        <v-card-title> Delete Product </v-card-title>
        <v-card-subtitle>
          Are you sure that you want to delete this product? This action cannot
          be undone.
        </v-card-subtitle>
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
            color="primary"
            text
            v-on:click="deleteProduct(product)"
          >
            Confirm Delete
          </v-btn>
          <v-btn
            :disabled="loading"
            color="primary"
            text
            @click="deleteDialog = false"
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
    product: null,
    canDelete: false,
    deleteProductCallBack: null,
  },
  data() {
    return {
      loading: false,
      deleteDialog: false,
    };
  },
  mounted() {},
  methods: {
    async openDialog() {
      this.deleteDialog = true;
    },
    async deleteProduct(product) {
    //   console.log(product);
    //   //delete the product from scrapedProducts
    //   const deleteResponse = await this.$store.dispatch("dataGate", {
    //     primaryKey: "id",
    //     entity: product,
    //     tableName: "stagedProducts",
    //     operation: "delete",
    //   });

    //   this.loading = true;

    //   const newScrapedProductsResponse = await this.$store.dispatch("dataGate", {
    //     tableName: "stagedProducts",
    //     operation: "read",
    //   });
    //   if (newScrapedProductsResponse.count) {
    //     this.brandCount = newScrapedProductsResponse.count;
    //   }
    //   if (newScrapedProductsResponse.data) {
    //     console.log("brandsResponse.data", newScrapedProductsResponse.data);
    //     this.brands = newScrapedProductsResponse.data;
    //     this.filteredBrands = this.brands;
    //     this.setPage();
    //   }
    //   this.loading = false;
    },
    // async saveBrand() {
    //   console.log(this.brand);

    //   if (this.brand.publish == true) {
    //     this.brand.publish = 1;
    //   } else {
    //     this.brand.publish = 0;
    //   }
    //   this.loading = true;
    //   // Save the  category if the form is valid
    //   if (this.$refs.newCategoryForm.validate()) {
    //     const response = await this.$store.dispatch("dataGate", {
    //       primaryKey: "id",
    //       entity: this.brand,
    //       tableName: "mappedBrands",
    //       operation: "update",
    //     });
    //     // If valid response return value
    //     if (response && response.response) {
    //       this.brandCreateCallBackEdit(this.brand);
    //       //this.brands.push(this.brand);
    //     }
    //   }
    //   this.newCategoryDialog = false;
    //   this.loading = false;
    // },
  },
};
</script>

<style scoped>
/* .button-style{
  float:right;
} */
</style>
