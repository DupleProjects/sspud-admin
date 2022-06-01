<template>
  <div>
    <div class="row" v-if="product && showDetail">
      <div class="col-3">
        <v-img
          style="border-style: solid; width: 100%; border-color: yellow"
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="product.imageSrc"
        ></v-img>
        <p>Has Stock: {{product.hasStock}}</p>
        <p>Special: {{product.special}}</p>
        <a target="_blank" :href="product.href">Shop Link</a>
      </div>
      <div class="col-9">
        <v-form
            ref="validProductForm"
            v-model="validProductForm"
            lazy-validation>
          <v-text-field
              label="Name"
              v-model="product.name"
              outlined
              :disabled="!edit"
          ></v-text-field>
          <v-textarea
              label="Description"
              outlined
              v-model="product.description"
              :disabled="!edit"
          ></v-textarea>
          <div class="row">
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
                  prepend-icon="mdi-tractor"
                  :rules="[(v) => !!v || 'A category is required']"
                  :messages="['Choose a BambaZonke category for this product']"
              ></v-autocomplete>
              <v-text-field
                  label="Price"
                  v-model="product.price"
                  outlined
                  :disabled="!edit"
              ></v-text-field>
            </div>
            <div class="col-6">
              <p style="color: Red" v-if="type == 'scraped'">
                Sub Category:<u> {{ product.subCategoryName }}</u>
              </p>
              <v-autocomplete
                  v-if="type === 'staged'"
                  style="padding-top: 0px"
                  v-model="product.subCategoryId"
                  v-on:change="onCategoryChange()"
                  :items="subCategories"
                  :item-value="'id'"
                  :item-text="'name'"
                  outlined
                  :disabled="!edit"
                  label="Sub Category"
                  prepend-icon="mdi-tractor"
                  :rules="[(v) => !!v || 'A sub category is required']"
                  :messages="['Choose a BambaZonke sub category for this product']"
              ></v-autocomplete>
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
                  prepend-icon="mdi-tractor"
                  :rules="[(v) => !!v || 'A sub category is required']"
                  :messages="['Choose a BambaZonke sub category for this product']"
              ></v-autocomplete>
              <v-text-field
                  label="Shipping Weight"
                  v-model="product.shippingWeight"
                  outlined
                  :disabled="!edit"
              ></v-text-field>
              <v-text-field
                  label="Shipping Length"
                  v-model="product.shippingLength"
                  outlined
                  :disabled="!edit"
              ></v-text-field>
              <v-text-field
                  label="Shipping Width"
                  v-model="product.shippingWidth"
                  outlined
                  :disabled="!edit"
              ></v-text-field>
              <v-text-field
                  label="Shipping Heigth"
                  v-model="product.shippingHeight"
                  outlined
                  :disabled="!edit"
              ></v-text-field>
            </div>
          </div>
        </v-form>
      </div>
    </div>
    <div class="container">
      <div class="center">
        <button
            v-if="type === 'staged'"
          class="btn btn-sm btn-outline-secondary"
          @click="saveProductInfo()"
          :disabled="!edit">
          Save Product Information
        </button>
      </div>
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
  },
  data() {
    return {
      showDetail: false,
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
    });
  },
  methods: {
    async saveProductInfo() {
      if (this.$refs.validProductForm.validate()) {
        if (this.type === "scraped") {
          console.log(this.product);
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
    onCategoryChange() {
      let BOBSRequired = false;
      let subBOBSRequired = false;
      let SABSRequired = false;
      let subSABSRequired = false;
      // Check subcategory
      console.log('this.allCategories', this.allCategories)
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
      console.log("🤩🤩🤩PRODUCT ON DETAIL PAGE",this.product);
      if (this.type === 'scraped'){

      } else if (this.type === 'staged') {
        const categories = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });
        console.log("",this.product);
        if (this.product) {
          this.allCategories = categories.data;
          categories.data.forEach((category) => {
            if (category.parentId) {
              this.subCategories.push(category);
            } else {
              this.categories.push(category);
            }
          });
          console.log("ALL SUBCATEGORIES",this.subCategories);
          console.log("ALL CATEGORIES",this.categories);
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

.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
