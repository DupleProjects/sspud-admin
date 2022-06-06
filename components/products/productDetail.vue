<template>
  <div>
    <div v-if="loading" class="d-flex flex-column justify-content-center loader">
      <div class="d-flex flex-row justify-content-center">
        <div class="text-center">
          <v-progress-circular
              :size="70"
              :width="7"
              color="purple"
              indeterminate
          ></v-progress-circular>
          <h1>Loading</h1>
        </div>
      </div>
    </div>
    <div v-if="product && !loading" class="card p-3">
      <v-form
          ref="validProductForm"
          v-model="validProductForm"
          lazy-validation>
        <div class="row">
          <!--Name-->
          <div class="col-12">
            <v-text-field
                label="Name"
                v-model="product.name"
                outlined
                :rules="[(v) => !!v || 'A name is required']"
                :disabled="!edit">
            </v-text-field>
          </div>
          <!--Description-->
          <div class="col-12">
            <v-textarea
                label="Description"
                outlined
                v-model="product.description"
                :rules="[(v) => !!v || 'A description is required']"
                :disabled="!edit"
            ></v-textarea>
          </div>
          <!--Price-->
          <div class="col-6">
            <v-text-field
                label="Price"
                v-model="product.price"
                outlined
                prepend-icon="mdi-currency-usd"
                :rules="[(v) => !!v || 'A price is required']"
                :disabled="!edit"
            ></v-text-field>
          </div>
          <!--Category-->
          <div class="col-6">
            <p v-if="type === 'scraped'" style="color: Red">
              Category:<u> {{ product.categoryName }}</u>
            </p>
            <v-autocomplete
                v-if="type === 'staged'"
                style="padding-top: 0px"
                v-model="product.categoryId"
                v-on:change="onCategoryChange()"
                :items="categories"
                :item-value="'id'"
                :item-text="'name'"
                outlined
                :disabled="!edit"
                label="Category"
                prepend-icon="mdi-shape"
                :rules="[(v) => !!v || 'A category is required']"
                :messages="['Choose a BambaZonke category for this product']"
            ></v-autocomplete>
          </div>
          <!--Brand-->
          <div class="col-6">
            <p style="color: Red" v-if="type == 'scraped'">
              Brand:<u> {{ product.brand }}</u>
            </p>
            <v-autocomplete
                v-if="type === 'staged'"
                style="padding-top: 0px"
                v-model="product.brandId"
                :items="brands"
                :item-value="'id'"
                :item-text="'name'"
                outlined
                :disabled="!edit"
                label="Brand"
                prepend-icon="mdi-watermark"
                :rules="[(v) => !!v || 'A brand is required']"
                :messages="['Choose a BambaZonke sub category for this product']"
            ></v-autocomplete>
          </div>
          <!--Sub Category-->
          <div class="col-6">
            <p style="color: Red" v-if="type == 'scraped'">
              Sub Category:<u> {{ product.subCategoryName }}</u>
            </p>
            <v-autocomplete
                v-if="type === 'staged'"
                style="padding-top: 0px"
                v-model="product.subCategoryId"
                v-on:change="onCategoryChange(true)"
                :items="subCategories"
                :item-value="'id'"
                :item-text="'name'"
                outlined
                :disabled="!edit"
                label="Sub Category"
                prepend-icon="mdi-shape"
                :rules="[(v) => !!v || 'A sub category is required']"
                :messages="['Choose a BambaZonke sub category for this product']"
            ></v-autocomplete>

          </div>
          <!--Dimensions-->
          <div class="col-6">
            <v-text-field
                label="Shipping Weight"
                v-model="product.shippingWeight"
                outlined
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Weight is required']"
                :disabled="!edit"
            ></v-text-field>
            <v-text-field
                label="Shipping Length"
                v-model="product.shippingLength"
                outlined
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Length is required']"
                :disabled="!edit"
            ></v-text-field>
          </div>
          <div class="col-6">
            <v-text-field
                label="Shipping Width"
                v-model="product.shippingWidth"
                outlined
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Width is required']"
                :disabled="!edit"
            ></v-text-field>
            <v-text-field
                label="Shipping Heigth"
                v-model="product.shippingHeight"
                outlined
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Heigth is required']"
                :disabled="!edit"
            ></v-text-field>
          </div>
        </div>
        <v-btn
            v-if="type === 'staged'"
            color="green"
            @click="saveProductInfo()"
            :disabled="!edit">
          Save Product Information
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    product: null,
    edit: true,
    type: null,
    allCategories: [],
  },
  data() {
    return {
      loading: true,
      validProductForm: false,
      allCategories: [],
      categories: [],
      subCategories: [],
      brands: [],
      category: null,
      subCategory: null,
    };
  },
  mounted() {},
  beforeMount() {
    this.$nextTick(async function () {
      await this.getData();
      this.showDetail = true;
      this.loading = true;
      if (this.type === 'scraped'){

      } else if (this.type === 'staged') {
        const categories = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });
        if (this.product) {
          this.allCategories = categories.data;
          categories.data.forEach((category) => {
            if (!category.parentId) {
              this.categories.push(category);
            }
            if (this.product.categoryId) {
              this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(
                  this.allCategories, {parentId: this.product.categoryId}, false
              );
            }
          });
        }
        const brandsResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedBrands",
          operation: "read",
        });
        if (brandsResponse.hasOwnProperty('data')) {
          this.brands = brandsResponse.data;
        }
      }
      this.loading = false;
    });
  },
  methods: {
    async saveProductInfo() {
      if (this.$refs.validProductForm.validate()) {
        if (this.type === "scraped") {
          // Can't
          // const response = await this.$store.dispatch("dataGate", {
          //   primaryKey: "id",
          //   entity: this.product,
          //   tableName: "scrapedProducts",
          //   operation: "update",
          // });
        } else if (this.type === "staged") {
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: this.product,
            tableName: "stagedProducts",
            operation: "update",
          });
        } else if (this.type === "published") {
          const response = await this.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: this.product,
            tableName: "publishedProducts",
            operation: "update",
          });
        }
      }
    },
    onCategoryChange(sub) {
      if (!sub) {
        this.product.subCategoryId = null;
        this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {parentId: this.product.categoryId}, false)
      }
      let BOBSRequired = false;
      let subBOBSRequired = false;
      let SABSRequired = false;
      let subSABSRequired = false;
      // Check subcategory
      const category = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {id: this.product.categoryId}, true);
      if (category) {
        BOBSRequired = category.BOBSRequired;
        SABSRequired = category.SABSRequired;
      }
      // Check subcategory
      const subCategory = baseMixin.methods.getObjectsWhereKeysHaveValues(this.allCategories, {id: this.product.subCategoryId}, true);
      if (subCategory) {
        subBOBSRequired = subCategory.BOBSRequired;
        subSABSRequired = subCategory.SABSRequired;
      }
      this.product.BOBSRequired = BOBSRequired || subBOBSRequired;
      this.product.SABSRequired = SABSRequired || subSABSRequired;
    },
    async getData(){
      if (this.type === 'scraped'){

      } else if (this.type === 'staged') {
        const categories = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });
        if (this.product) {
          this.allCategories = categories.data;
          categories.data.forEach((category) => {
            if (category.parentId) {
              this.subCategories.push(category);
            } else {
              this.categories.push(category);
            }
          });
        }
        const brandsResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedBrands",
          operation: "read",
        });
        if (brandsResponse.hasOwnProperty('data')) {
          this.brands = brandsResponse.data;
        }
      }
    }
  },
};
</script>

<style scoped>
.container {
  position: relative;
}
.loader {
  height: 60vh;
}
.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
