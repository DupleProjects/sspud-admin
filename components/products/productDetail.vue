<template>
  <div>
    <div class="row">
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
          v-if="edit == true"
        ></v-text-field>
        <v-textarea
          label="Descrition"
          outlined
          v-model="product.description"
          v-if="edit == true"
        ></v-textarea>
        <div class="row">
          <div class="col-6">
            <p v-if="type == 'scraped'" style="color: Red">
              Currnet Category:<u> {{ product.categoryName }}</u>
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
              v-if="edit == true"
            ></v-select>

            <v-text-field
              label="Price"
              v-model="product.price"
              outlined
              v-if="edit == true"
            ></v-text-field>
          </div>
          <div class="col-6">
            <p style="color: Red" v-if="type == 'scraped'">
              Currnet Sub Category:<u> {{ product.subCategoryName }}</u>
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
              v-if="edit == true"
            ></v-select>
            <v-text-field
              label="Brand"
              v-model="product.brand"
              outlined
              v-if="edit == true"
            ></v-text-field>
            <v-text-field
              label="Shipping Weight"
              v-model="product.shippingWeight"
              outlined
              v-if="edit == true"
            ></v-text-field>
            <v-text-field
              label="Shipping Length"
              v-model="product.shippingLength"
              outlined
              v-if="edit == true"
            ></v-text-field>
            <v-text-field
              label="Shipping Width"
              v-model="product.shippingWidth"
              outlined
              v-if="edit == true"
            ></v-text-field>
            <v-text-field
              label="Shipping Heigth"
              v-model="product.shippingHeight"
              outlined
              v-if="edit == true"
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
      console.log(this.product);
      const categorys = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });

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
