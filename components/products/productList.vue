<template>
  <div class="p-3">
    <v-overlay :value="loading" style="text-align:center;">
    <v-progress-circular
            :size="100"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <h1>Sorting Products</h1>
    </v-overlay>
    <div class="fancy-table">
      <div class="fancy-heading-row">
        <div  v-bind:class="{ 'inner-fancy-heading-row': type === 'scraped', 'inner-fancy-heading-row-staged': type === 'staged' || type === 'published'}">
          <div v-on:click="sort('name','name')">Name</div>
          <div v-if="type === 'staged' || type === 'published'" v-on:click="sort('hasStock','hasStock')">Has Stock</div>
          <div v-on:click="sort('price','price')">Price</div>
          <div v-on:click="sort('subCategoryName','subCategoryId')">Subcategory</div>
          <div v-on:click="sort('brand','brandId')">Brand</div>
          <div v-if="type === 'staged' || type === 'published'" class="text-center" v-on:click="sort(null,'publish')">Published</div>
          <div v-if="type === 'staged' || type === 'published'" class="text-center" v-on:click="sort(null,'reviewRequired')">Review Required</div>
        </div>
      </div>
      <div class="product-list">
        <div class="fancy-row" v-for="(product, index) of products" :key="index">
          <div class="" v-bind:class="{ 'inner-fancy-row': type === 'scraped', 'inner-fancy-row-staged': type === 'staged' || type === 'published'}">
            <div class="column-1 pr-2">
              <div class="name-column">
                {{ product.name }}
              </div>
              <p class="mb-0" v-if="type === 'scraped'">
                {{ product.categoryName }}
              </p>
              <p class="mb-0" v-if="type === 'staged' || type === 'published'">
                {{ getCategoryName(product.categoryId)}}
              </p>
            </div>
            <div v-if="type === 'staged' || type === 'published'" class="column-1">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" :color="product.hasStock ? 'green' : 'orange'" medium>mdi-package</v-icon>
                </template>
                <span>{{product.hasStock ? 'In Stock' : 'Out of Stock'}}</span>
              </v-tooltip>
            </div>
            <div class="column-1">
              R {{ product.price }}
            </div>
            <div v-if="type === 'scraped'" class="column-1">
              {{ product.subCategoryName }}
            </div>
            <div v-if="type === 'staged' || type === 'published'" class="column-1">
              {{ getCategoryName(product.subCategoryId) }}
            </div>
            <div v-if="type === 'scraped'" class="column-1">
              {{ product.brand }}
            </div>
            <div v-if="type === 'staged' || type === 'published'" class="column-1">
              {{getBrandName(product.brandId)}}
            </div>
            <div v-if="type === 'staged' || type === 'published'" class="column-1 text-center">
              <v-tooltip v-if="product.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" color="green" medium>mdi-check-circle</v-icon>
                </template>
                <span>Published</span>
              </v-tooltip>
              <v-tooltip v-if="!product.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" color="orange" medium>mdi-close-circle</v-icon>
                </template>
                <span>UnPublished</span>
              </v-tooltip>
            </div>
            <div v-if="type === 'staged' || type === 'published'" class="column-1 text-center">
              <v-tooltip v-if="!product.reviewRequired" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" color="green" medium>mdi-file-document</v-icon>
                </template>
                <span>Reviewed</span>
              </v-tooltip>
              <v-tooltip v-if="product.reviewRequired" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                      v-bind="attrs"
                      v-on="on" color="red" medium>mdi-text-box-search</v-icon>
                </template>
                <span>Review Required</span>
              </v-tooltip>
            </div>
            <div class="actions-column">
              <!-- Edit button -->
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      v-if="type === 'staged'"
                      small
                      class="button-style"
                      text
                      @click="goToProductDashboard(product)"
                      style="text-align: center"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon small>mdi-lead-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <!-- View Button -->
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      v-if="type !== 'staged'"
                      small
                      class=""
                      text
                      @click="goToProductDashboard(product)"
                      style="text-align: center"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon small>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <span>View</span>
              </v-tooltip>
              <!-- View Button -->
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      :disabled="type !== 'staged'"
                      small
                      class="button-style"
                      text
                      @click="openTheDeleteDialog(product)"
                      style="text-align: center"
                      v-bind="attrs"
                      v-on="on">
                    <v-icon small>mdi-trash-can</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--Delete Dialog-->
    <v-dialog
        style="z-index: 10000"
        v-model="deleteDialog"
        max-width="800"
    >
      <v-card>
        <v-card-title> Delete Product </v-card-title>
        <v-card-subtitle>
          Are you sure that you want to delete this product from
          staged products? This action cannot be undone.
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-progress-circular
            v-if="loading"
            :size="20"
            indeterminate
            color="primary"
          ></v-progress-circular> -->
          <v-btn
              color="primary"
              text
              v-on:click="deleteThisProduct()"
          >
            Confirm Delete
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="closeTheDeleteDialog()"
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
    type: "",
    products: [],
    allCategories: [],
    allBrands: [],
    deleteProductCallBack: null,
    sortCallback: null,
    sortCallbackStaged: null,
  },
  data() {
    return {
      deleteDialog: false,
      loading: false,
      productToDelete: {},
      sortObject: {}
    };
  },
  mounted() {},
  methods: {
    goToProductDashboard(product) {
      const params = { id: product.id };
      // Go to different dashboards based on type
      if (this.type === "scraped") {
        this.$router.push({
          name: "products-scraped-dashboard-id",
          params,
        });
      } else if (this.type === "staged") {
        this.$router.push({
          name: "products-staged-dashboard-id",
          params,
        });
      } else if (this.type === "published") {
        this.$router.push({
          name: "products-published-dashboard-id",
          params,
        });
      }
    },
    closeTheDeleteDialog() {
      this.deleteDialog = false;
      this.productToDelete = {};
    },
    getBrandName(brandId) {
      if (this.allBrands) {
        const brand = this.allBrands.find((x) => x.id === brandId);
        if (brand) {
          return brand.name;
        }
      }
      return 'Brand Not Found';
    },
    getCategoryName(categoryId) {
      if (this.allCategories) {
        const category = this.allCategories.find((x) => x.id === categoryId);
        if (category) {
          return category.name;
        }
      }
      return 'Category Not Found';
    },
    async deleteThisProduct() {
      //delete the product from scrapedProducts
      const deleteResponse = await this.$store.dispatch("callMiddlewareRoute", {
        stagedProduct: this.productToDelete,
        route: 'products/deleteStagedProduct'
      });

      if (deleteResponse && deleteResponse.response) {
          this.deleteProductCallBack()
      } else {
      }
      this.deleteDialog = false;
      this.closeTheDeleteDialog();
    },
    async openTheDeleteDialog(product) { 
      this.productToDelete = product;   
      this.deleteDialog = true;
    },
    async sort(scrapedCriteria,stagedCriteria){
      this.loading = true

      if(this.type == "scraped"){
      
        if (this.sortObject.hasOwnProperty(scrapedCriteria)) {
          if (this.sortObject[scrapedCriteria] === 'DESC') {
              // Third Click
              delete this.sortObject[scrapedCriteria]
          } else {
              // Second Click
                this.sortObject[scrapedCriteria] = 'DESC'
          }
        } else {
            // First Click
            this.sortObject[scrapedCriteria] = 'ASC'
        }


        console.log("PROD SORT",this.sortObject);

        await this.sortCallback(this.sortObject)

      }

      if(this.type == "staged" || this.type == "published"){
        if (this.sortObject.hasOwnProperty(stagedCriteria)) {
          if (this.sortObject[stagedCriteria] === 'DESC') {
              // Third Click
              delete this.sortObject[stagedCriteria]
          } else {
              // Second Click
                this.sortObject[stagedCriteria] = 'DESC'
          }
        } else {
            // First Click
            this.sortObject[stagedCriteria] = 'ASC'
        }


        console.log("PROD SORT",this.sortObject);

        await this.sortCallbackStaged(this.sortObject)
      }

      this.loading = false

    }
  },
};
</script>

<style scoped>
.actions-column {
  display: none;
}

.name-column {
  width: 28%;
}

.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  min-width: 600px;
}
.fancy-heading-row {
  position: relative;
  background-color: #5268fa;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  color: white;
  border-image: initial;
  border-bottom: none;
}
.fancy-row {
  position: relative;
  background-color: white;
  border-radius: 0px;
  box-shadow: none;
  --show-action: 0;
  border-top: 1px solid rgb(223, 225, 230);
  border-right: 1px solid rgb(223, 225, 230);
  border-left: 1px solid rgb(223, 225, 230);
  border-image: initial;
  border-bottom: none;
  cursor: pointer;
}
.fancy-row:hover {
  background-color: #F5F6F8;
}
.fancy-row:hover .actions-column {
  display: flex;
}
.inner-fancy-heading-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-heading-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 0.5fr 1fr 0.5fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 0.5fr 1fr 0.5fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.name-column {
  color: #000000;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  text-decoration: none;
  outline: none;
  display: contents;
  overflow: hidden;
  text-overflow: ellipsis;
}
.column-1 {
  -webkit-box-align: center;
  align-items: center;
  min-width: 0px;
}

.product-list {
  height: 65vh;
  overflow: auto;
}
/* .button-style{
  float:right;
} */
</style>
