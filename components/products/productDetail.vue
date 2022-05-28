<template>
  <div>
    <div class="row" v-if="product">
      <div class="col-3">
        <v-img
          style="border-style: solid; width: 100%; border-color: yellow"
          lazy-src="https://picsum.photos/id/11/10/6"
          :src="product.imageSrc"
        ></v-img>
      </div>
      <div class="col-9">
        <v-text-field
          label="Name"
          v-model="product.name"
          outlined
          :disabled="!edit"
        ></v-text-field>
        <v-textarea
          label="Descrition"
          outlined
          v-model="product.description"
          :disabled="!edit"
        ></v-textarea>
        <div class="row">
          <div class="col-6">
            <p v-if="type == 'scraped'" style="color: Red">
              Current Category:<u> {{ product.categoryName }}</u>
            </p>
            <v-select
              style="padding-top: 0px"
              outlined
              label="Category"
              return-object
              item-text="name"
              item-value="id"
              :items="categories"
              width="100%"
              v-model="category"
              class="mt-3"
              :disabled="!edit"
            ></v-select>

            <v-text-field
              label="Price"
              v-model="product.price"
              outlined
              :disabled="!edit"
            ></v-text-field>
          </div>
          <div class="col-6">
            <p style="color: Red" v-if="type == 'scraped'">
              Current Sub Category:<u> {{ product.subCategoryName }}</u>
            </p>
            <v-select
              style="padding-top: 0px"
              outlined
              label="Sub Category"
              return-object
              item-text="name"
              item-value="id"
              :items="subCategories"
              width="100%"
              v-model="subCategory"
              class="mt-3"
              :disabled="!edit"
            ></v-select>
            <v-text-field
              label="Brand"
              v-model="product.brand"
              outlined
              :disabled="!edit"
            ></v-text-field>
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
      </div>
    </div>
    <div class="container">
      <div class="center">
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="saveProductInfo()"
          :disabled="!edit"
        >
          Save Product Information
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: null,
    edit: true,
    type: null,
  },
  data() {
    return {
      categories: [],
      subCategories: [],
      category: null,
      subCategory: null,
    };
  },
  mounted() {},
  beforeMount() {
    this.$nextTick(async function () {
      console.log("🤩🤩🤩PRODUCT ON DETAIL PAGE",this.product);

      if(this.type == 'scraped'){
        const categorys = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });

        if (this.product) {
          categorys.data.forEach((element) => {
            if (element.name == this.product.categoryName) {
              this.category = element.id;
            }
            if (element.name == this.product.subCategoryName) {
              this.subCategory = element.id;
            }

            if (element.parentId == 0) {
              this.categories.push(element);
            } else {
              this.subCategories.push(element);
            }
          });
        }
      }else if(this.type == 'staged'){
        const categorys = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });

        if (this.product) {
          categorys.data.forEach((element) => {
            if (element.id == this.product.categoryId) {
              this.category = element.id;
            }
            if (element.id == this.product.subCategoryId) {
              this.subCategory = element.id;
            }

            if (element.parentId == 0) {
              this.categories.push(element);
            } else {
              this.subCategories.push(element);
            }
          });
        }
      }
      
    });
  },
  methods: {
    async saveProductInfo() {
      console.log(this.product);
      console.log(this.category);
      console.log(this.subCategory);

      if (this.type == "scraped") {
        if (this.category.id != null) {
          this.product.categoryName = this.category.name;
        } else {
          this.product.categoryName = this.categories.find(
            (x) => x.id === this.category
          ).name;
        }

        if (this.subCategory.id != null) {
          this.product.subCategoryName = this.subCategory.name;
        } else {
          this.product.subCategoryName = this.subCategory.find(
            (x) => x.id === this.subCategory
          ).name;
        }

        console.log(this.product);
        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.product,
          tableName: "scrapedProducts",
          operation: "update",
        });
      } else if (this.type == "staged") {
        if (this.category.id != null) {
          this.product.categoryName = this.category.id;
        } else {
          this.product.categoryName = this.category;
        }

        if (this.subCategory.id != null) {
          this.product.subCategoryName = this.subCategory.id;
        } else {
          this.product.subCategoryName = this.subCategory;
        }

        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.product,
          tableName: "stagedProducts",
          operation: "update",
        });
      } else if (this.type == "published") {
        if (this.category.id != null) {
          this.product.categoryName = this.category.id;
        } else {
          this.product.categoryName = this.category;
        }

        if (this.subCategory.id != null) {
          this.product.subCategoryName = this.subCategory.id;
        } else {
          this.product.subCategoryName = this.subCategory;
        }

        const response = await this.$store.dispatch("dataGate", {
          primaryKey: "id",
          entity: this.product,
          tableName: "publishedProducts",
          operation: "update",
        });
      }
    },
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
