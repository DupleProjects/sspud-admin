<template>
  <div style="height:100%; overflow-y:auto; overflow-x:hidden;" >
    <div
      v-if="loading"
      class="d-flex flex-column justify-content-center loader"
    >
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
    <div v-if="product && !loading">
      <v-form ref="validProductForm" v-model="validProductForm" lazy-validation>
        <div class="row"  style="height:75vh; overflow-y:auto; overflow-x:hidden;">
          <!--Name-->
          <div class="col-12">
            <v-text-field
              class="mb-0"
              label="Name"
              v-model="product.name"
              :rules="[(v) => !!v || 'A name is required']"
              :disabled="!edit"
            >
            </v-text-field>
          </div>
          <!--Description-->
          <div class="col-12">
            <v-textarea
              rows="2"
              class="pt-0 mt-0"
              label="Description"
              v-model="product.description"
              :rules="[(v) => !!v || 'A description is required']"
              :disabled="!edit"
            ></v-textarea>
          </div>
          <div class="row mt-n7">
            <!--Brand/category-->
            <div class="col-6">
              <!--Price-->
              <v-text-field
                label="Price"
                v-model="product.price"
                prepend-icon="mdi-alpha-p-box-outline"
                :rules="[(v) => !!v || 'A price is required']"
                :disabled="!edit"
              ></v-text-field>
              <!--Brand-->
              <p style="color: Red" v-if="type == 'scraped'">
                Brand:<u> {{ product.brand }}</u>
              </p>
              <v-autocomplete
                v-if="type === 'staged'"
                v-model="product.brandId"
                :items="brands"
                :item-value="'id'"
                :item-text="'name'"
                :disabled="!edit"
                label="Brand"
                prepend-icon="mdi-watermark"
                :rules="[(v) => !!v || 'A brand is required']"
                :messages="['Choose a BambaZonke Brand for this product']"
              ></v-autocomplete>
            </div>
            <div class="col-6">
              <!--Category-->
              <p v-if="type === 'scraped'" style="color: Red">
                Category:<u> {{ product.categoryName }}</u>
              </p>
              <v-autocomplete
                v-if="type === 'staged'"
                v-model="product.categoryId"
                v-on:change="onCategoryChange()"
                :items="categories"
                :item-value="'id'"
                :item-text="'name'"
                :disabled="!edit"
                label="Category"
                prepend-icon="mdi-shape"
                :rules="[(v) => !!v || 'A category is required']"
                :messages="['Choose a BambaZonke category for this product']"
              ></v-autocomplete>
              <!--Sub Category-->
              <p style="color: Red" v-if="type == 'scraped'">
                Sub Category:<u> {{ product.subCategoryName }}</u>
              </p>
              <v-autocomplete
                v-if="type === 'staged'"
                v-model="product.subCategoryId"
                v-on:change="onCategoryChange(true)"
                :items="subCategories"
                :item-value="'id'"
                :item-text="'name'"
                :disabled="!edit"
                label="Sub Category"
                prepend-icon="mdi-shape"
                :rules="[(v) => !!v || 'A sub category is required']"
                :messages="[
                  'Choose a BambaZonke sub category for this product',
                ]"
              ></v-autocomplete>
            </div>
          </div>
          <div class="mt-5 mb-n3 ml-7">
            <h4>Shipping Dimensions</h4>
          </div>
          <div class="row mb-5">
            <div class="col-3">
              <v-text-field
                class="mt-5"
                label="Shipping Length (mm)"
                v-model="product.shippingLength"
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Length is required']"
                :disabled="!edit"
              ></v-text-field>
            </div>
            <div class="col-3">
              <v-text-field
                class="mt-5"
                label="Shipping Width (mm)"
                v-model="product.shippingWidth"
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Width is required']"
                :disabled="!edit"
              ></v-text-field>
            </div>
            <div class="col-3">
              <v-text-field
                class="mt-5"
                label="Shipping Heigth (mm)"
                v-model="product.shippingHeight"
                prepend-icon="mdi-ruler"
                :rules="[(v) => !!v || 'Shipping Heigth is required']"
                :disabled="!edit"
              ></v-text-field>
            </div>
            <div class="col-3">
              <v-text-field
                class="mt-5"
                label="Shipping Weight (kg)"
                v-model="product.shippingWeight"
                prepend-icon="mdi-weight-kilogram"
                :rules="[(v) => !!v || 'Shipping Weight is required']"
                :disabled="!edit"
              ></v-text-field>
            </div>
          </div>
        </div>
        <div style="background-color:white;" class="w-100 text-end">
          <v-progress-circular
            v-if="saving"
            :size="20"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn
            v-if="type === 'staged' && !saving"
            color="green"
            @click="saveProductInfo()"
            :disabled="!edit"
          >
            <span style="color: white">Save Product Information</span>
          </v-btn>
        </div>
      </v-form>
    </div>
    <v-snackbar v-model="snackbar" outlined color="success" :timeout="timeout">
      {{ snackBarText }}
    </v-snackbar>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin";
import productMixin from "@/mixins/productMixin.js";

export default {
  props: {
    product: null,
    edit: true,
    type: null,
  },
  data() {
    return {
      loading: true,
      saving: false,
      validProductForm: false,
      allCategories: [],
      categories: [],
      subCategories: [],
      brands: [],
      category: null,
      subCategory: null,
      // Snackbar
      snackbar: false,
      snackBarText: "My timeout is set to 2000.",
      timeout: 2000,
      certificates: null,
    };
  },
  mounted() {},
  beforeMount() {
    this.$nextTick(async function () {
      await this.getData();
      this.showDetail = true;
      this.loading = true;
      if (this.type === "scraped") {
      } else if (this.type === "staged") {
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
              this.subCategories =
                baseMixin.methods.getObjectsWhereKeysHaveValues(
                  this.allCategories,
                  { parentId: this.product.categoryId },
                  false
                );
            }
          });
        }
        const brandsResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedBrands",
          operation: "read",
        });
        if (brandsResponse.hasOwnProperty("data")) {
          this.brands = brandsResponse.data;
        }
      }
      this.loading = false;
    });
  },
  methods: {
    async saveProductInfo() {
      if (this.$refs.validProductForm.validate()) {
        this.saving = true;
        if (this.type === "scraped") {
          // Can't
          // const response = await this.$store.dispatch("dataGate", {
          //   primaryKey: "id",
          //   entity: this.product,
          //   tableName: "scrapedProducts",
          //   operation: "update",
          // });
        } else if (this.type === "staged") {
          const certificatesResponse = await this.$store.dispatch("dataGate", {
            tableName: "stagedProductCertificates",
            operation: "read",
            whereCriteria: { stagedProductId: this.product.id },
          });
          if (certificatesResponse && certificatesResponse.data) {
            this.certificates = certificatesResponse.data;
          }

          if (
            productMixin.methods.canPublishProduct(
              this.product,
              this.certificates
            ).isValidProduct == true
          ) {
            this.product.reviewRequired = false;
          } else {
            this.product.reviewRequired = true;
          }

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
        this.snackBarText = "Product Successfully Saved";
        this.snackbar = true;
        this.saving = false;
      }
    },
    async getReviewRequired() {
      if (productMixin.methods.canPublishProduct(this.product)) {
        this.product.publish = !this.product.publish;
        // Remove review required if we are publishing
        if (this.product.publish) {
          this.product.reviewRequired = false;
        }
        await this.saveProduct();
      } else {
        alert("You can not publish this product. Stuff is still missing.");
      }
    },
    onCategoryChange(sub) {
      if (!sub) {
        this.product.subCategoryId = null;
        this.subCategories = baseMixin.methods.getObjectsWhereKeysHaveValues(
          this.allCategories,
          { parentId: this.product.categoryId },
          false
        );
      }
      let certificateRequired = false;
      let subCertificateRequired = false;
      // Check subcategory
      const category = baseMixin.methods.getObjectsWhereKeysHaveValues(
        this.allCategories,
        { id: this.product.categoryId },
        true
      );
      if (category) {
        certificateRequired = category.certificateRequired;
      }
      // Check subcategory
      const subCategory = baseMixin.methods.getObjectsWhereKeysHaveValues(
        this.allCategories,
        { id: this.product.subCategoryId },
        true
      );
      if (subCategory) {
        subCertificateRequired = subCategory.certificateRequired;
      }
      this.product.certificateRequired =
        certificateRequired || subCertificateRequired;
    },
    async getData() {
      if (this.type === "scraped") {
      } else if (this.type === "staged") {
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
        if (brandsResponse.hasOwnProperty("data")) {
          this.brands = brandsResponse.data;
        }
      }
    },
  },
};
</script>

<style>
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
:root {
  --size: 200px;
  --icon-size: 40px;
  --icon-color: #483c3e;
}

.picka-picka {
  display: grid;
  min-height: 30vh;
  place-items: center;
}
/* BOX STYLES*/
.box {
  position: relative;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
  transform: rotatex(345deg) rotateY(216deg);
  z-index: 0;
}
.face {
  position: absolute;
  height: 100%;
  width: 100%;
}
.bottom {
  transform: rotatex(-90deg);
  transform-origin: bottom center;
  background-color: #98511b;
  z-index: 0;
  box-shadow: 0 var(--size) 3px #0005;
}
.front {
  background-color: #cb9869;
  z-index: 5;
}
.back {
  background-color: #af8e6f;
  transform: translatez(var(--size));
  z-index: 2;
}
.right {
  background-color: #8d745e;
  transform-origin: center left;
  z-index: 4;
}
.left {
  background-color: #ffc889;
  transform: rotatey(90deg);
  transform-origin: center right;
  z-index: 3;
}
.face.left::after,
.face.right::after {
  content: "";
  height: 15%;
  width: 10%;
  position: absolute;
  top: 0;
  left: 45%;
  background-color: #0004;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
/* COVER STYLES*/
.top {
  transform: rotatex(90deg);
  transform-origin: top center;
  z-index: 6;
  position: absolute;
  transform-style: preserve-3d;
  cursor: pointer;
}
.cover-back,
.cover-front {
  width: var(--size);
  height: calc(var(--size) / 2);
  background-color: #ebb27a;
  position: absolute;
  transition: transform 0.5s 0.35s linear;
  z-index: 8;
}
.cover-back::after,
.cover-front::after {
  content: "";
  height: 10%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0004;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.cover-front::after {
  top: 90%;
}
.cover-back {
  left: 0;
  bottom: 0;
  transform-origin: center bottom;
}
.top:active > .cover-back {
  transform: rotatex(-200deg);
  transition: transform 0.5s linear;
}
.cover-front {
  left: 0;
  top: 0;
  transform-origin: center top;
}
.top:active > .cover-back + .cover-right + .cover-left + .cover-front {
  transform: rotatex(200deg);
  transition: transform 0.5s linear;
}
.cover-left,
.cover-right {
  height: var(--size);
  width: calc(var(--size) / 3);
  background-color: #c99e76;
  position: absolute;
  transition: transform 0.5s linear;
  z-index: 7;
}
.cover-left {
  left: 0;
  bottom: 0;
  transform-origin: center left;
}
.top:active > .cover-back + .cover-right + .cover-left {
  transform: rotatey(-190deg);
  transition: transform 0.5s 0.35s linear;
}
.cover-right {
  right: 0;
  top: 0;
  transform-origin: center right;
}
.top:active > .cover-back + .cover-right {
  transform: rotatey(190deg);
  transition: transform 0.5s 0.35s linear;
}
.content {
  width: 80%;
  height: 80%;
  position: absolute;
  bottom: 1px;
  display: grid;
  place-items: center;
  transform: rotateY(-216deg) translatez(calc(var(--size) / -2))
    translatex(-50%);
  transition: transform 0.4s linear;
}
.top:active + .content {
  transform: rotateY(-216deg) translatez(calc(var(--size) / -2))
    translatex(-50%) translatey(-82%);
  transition: transform 0.5s 1s cubic-bezier(0.24, 0.05, 0.66, 1.24);
}

/* ICONS STYLES*/
.icons {
  display: flex;
  justify-content: flex-start;
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.icons div {
  margin: 2px;
  border-radius: 3px;
}
.arrow {
  height: 100%;
  width: 100%;
  clip-path: polygon(
    21% 28%,
    41% 39%,
    52% 22%,
    56% 29%,
    48% 36%,
    72% 38%,
    84% 14%,
    75% 19%,
    67% 5%,
    39% 5%
  );
  background-color: var(--icon-color);
  position: absolute;
}
.arrow:nth-child(2) {
  transform: rotate(120deg);
}
.arrow:nth-child(3) {
  transform: rotate(-125deg);
}
.umbrella {
  height: var(--icon-size);
  width: var(--icon-size);
  position: relative;
  border: 1px solid var(--icon-color);
}
.umbrella::after {
  content: "";
  height: 40%;
  width: 100%;
  top: 20%;
  position: absolute;
  background-color: var(--icon-color);
  border-radius: 50% 50% 50% 50% / 90% 90% 10% 10%;
}
.umbrella::before {
  content: "";
  height: 80%;
  width: 10%;
  top: 10%;
  left: 50%;
  position: absolute;
  border-radius: 0% 0% 50% 50% / 0% 0% 10% 10%;
  border: calc(var(--icon-size) * 4 / 100) solid var(--icon-color);
  border-top: none;
  border-right: none;
}
.glass {
  height: var(--icon-size);
  width: var(--icon-size);
  position: relative;
  border: 1px solid var(--icon-color);
}
.glass::after {
  content: "";
  height: 60%;
  width: 70%;
  top: 5%;
  left: 15%;
  position: absolute;
  background-color: var(--icon-color);
  border-radius: 0% 0% 50% 50% / 0% 0% 100% 100%;
  clip-path: polygon(
    0% 0%,
    55% 0,
    68% 20%,
    54% 34%,
    75% 55%,
    61% 34%,
    75% 19%,
    67% 0,
    100% 0%,
    100% 100%,
    0% 100%
  );
}
.glass::before {
  content: "";
  height: 95%;
  width: 100%;
  position: absolute;
  background-color: var(--icon-color);
  clip-path: polygon(15% 100%, 45% 90%, 40% 55%, 60% 55%, 55% 90%, 85% 100%);
}
.orientation {
  height: var(--icon-size);
  width: var(--icon-size);
  position: relative;
  border: 1px solid var(--icon-color);
}
.orientation::after,
.orientation::before {
  content: "";
  height: 70%;
  width: 40%;
  top: 5%;
  left: 15%;
  position: absolute;
  background-color: var(--icon-color);
  clip-path: polygon(
    50% 0,
    80% 30%,
    60% 30%,
    60% 100%,
    40% 100%,
    40% 30%,
    20% 30%
  );
}
.orientation::after {
  left: 45%;
}
.base {
  height: 8%;
  width: 70%;
  left: 15%;
  bottom: 10%;
  position: absolute;
  background-color: var(--icon-color);
}
.recycled {
  height: calc(var(--icon-size) * 2);
  width: calc(var(--icon-size) * 2);
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.ball {
  height: calc(var(--icon-size) * 1.3);
  width: calc(var(--icon-size) * 1.3);
  position: absolute;
  bottom: 10px;
  left: 10px;
  border-radius: 50%;
  border: 1px solid var(--icon-color);
  background-image: radial-gradient(
      #cb9869 10%,
      var(--icon-color) 11% 13%,
      #cb9869 14% 20%,
      var(--icon-color) 21% 22%,
      #0000 24%
    ),
    linear-gradient(
      var(--icon-color) 48%,
      #0000 46% 54%,
      var(--icon-color) 54% 55%,
      #0000 57%
    );
}
.label {
  height: calc(var(--icon-size) * 1.5);
  width: calc(var(--icon-size) * 2);
  position: absolute;
  background-color: #ddd;
  border: 3px double var(--icon-color);
  border-radius: 5px;
  top: 5px;
  left: 5px;
}
.label::before {
  content: "From: Duple \A To: Leandra";
  font-family: sans-serif;
  font-size: 0.7rem;
  transform: scalex(-1);
  display: inline-block;
  white-space: pre;
  position: absolute;
  right: 3px;
  top: 3px;
}
.label::after {
  height: 15px;
  width: 3px;
  content: "";
  position: absolute;
  bottom: 3px;
  left: 5px;
  color: var(--icon-color);
  background-color: var(--icon-color);
  box-shadow: 3px 0, 6px 0, 10px 0, 13px 0, 15px 0, 19px 0;
}

/* Picachu Styles*/
.pikachu {
  --pikachu-size: calc(var(--size) * 0.7);
  width: var(--pikachu-size);
  height: var(--pikachu-size);
  position: absolute;
}
.pikachu .ear {
  width: calc(var(--pikachu-size) * 0.174);
  height: calc(var(--pikachu-size) * 0.514);
  position: absolute;
  border-radius: 20% 80% 35% 35% / 77% 60% 40% 23%;
  background-image: linear-gradient(90deg, #0000 30%, #fff4 48% 53%, #0000 70%),
    radial-gradient(
      calc(var(--pikachu-size) * 0.2429) calc(var(--pikachu-size) * 0.4714) at
        calc(var(--pikachu-size) * 0.0714) calc(var(--pikachu-size) * 0.3571),
      #e3d831 49%,
      #000 51%
    );
  transform: rotate(30deg);
  top: -1%;
  right: 3%;
  animation: move-right 2s linear infinite;
  transform-origin: 0 70%;
}
.ear.left {
  transform: scalex(-1) rotate(30deg);
  animation: move 2s linear infinite;
  transform-origin: 140% 100%;
  top: 3.5%;
  right: 95.5%;
}
@keyframes move-right {
  0%,
  40%,
  80% {
    transform: rotate(30deg);
  }
  50%,
  60% {
    transform: rotate(33deg);
  }
}
@keyframes move {
  0%,
  40%,
  80% {
    transform: scalex(-1) rotate(30deg);
  }
  50%,
  60% {
    transform: scalex(-1) rotate(33deg);
  }
}
.pikachu .head {
  width: calc(var(--pikachu-size) * 0.693);
  height: calc(var(--pikachu-size) * 0.629);
  position: absolute;
  background-color: #dcd132;
  border-radius: 50%;
  box-shadow: inset 5px 0 8px #f5ef30;
  bottom: 6px;
  left: 22px;
}
.pikachu .head::before {
  width: calc(var(--pikachu-size) * 0.72);
  height: calc(var(--pikachu-size) * 0.5);
  content: "";
  position: absolute;
  background-color: #dcd132;
  border-radius: 50%;
  bottom: -5px;
  left: -2px;
  background-image: radial-gradient(
      calc(var(--pikachu-size) * 0.1285) calc(var(--pikachu-size) * 0.1714) at
        calc(var(--pikachu-size) * 0.0714) calc(var(--pikachu-size) * 0.25),
      #aa0515 50%,
      #0000 54%
    ),
    radial-gradient(
      calc(var(--pikachu-size) * 0.1285) calc(var(--pikachu-size) * 0.1714) at
        calc(var(--pikachu-size) * 0.65) calc(var(--pikachu-size) * 0.25),
      #aa0515 50%,
      #0000 54%
    ),
    radial-gradient(
      calc(var(--pikachu-size) * 0.45) calc(var(--pikachu-size) * 0.3714) at
        calc(var(--pikachu-size) * 0.1428) calc(var(--pikachu-size) * 0.45),
      #b0a828 50%,
      #0000 60%
    ),
    radial-gradient(
      calc(var(--pikachu-size) * 0.7857) calc(var(--pikachu-size) * 0.5357) at
        calc(var(--pikachu-size) * 0.4286) calc(var(--pikachu-size) * 0.1286),
      #0000 50%,
      #b0a828 60%
    ),
    radial-gradient(
      calc(var(--pikachu-size) * 0.7857) calc(var(--pikachu-size) * 0.5357) at
        calc(var(--pikachu-size) * 0.3571) calc(var(--pikachu-size) * 0.4857),
      #0001 50%,
      #0000 60%
    ),
    radial-gradient(
      calc(var(--pikachu-size) * 0.3143) calc(var(--pikachu-size) * 0.4143) at
        calc(var(--pikachu-size) * 0.3571) calc(var(--pikachu-size) * 0.25),
      #fff1 50%,
      #0000 70%
    );
}
.pikachu .eye {
  width: calc(var(--pikachu-size) * 0.114);
  height: calc(var(--pikachu-size) * 0.136);
  position: absolute;
  background-color: #000;
  border-radius: 50%;
  z-index: 1;
  top: 32%;
  left: 15%;
}
.pikachu .eye::after {
  content: "";
  width: 35%;
  height: 35%;
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  top: 20%;
  right: 10%;
}
.pikachu .eye:nth-child(2)::after {
  left: 10%;
}
.pikachu .eye:nth-child(2) {
  left: 67%;
}
.pikachu .nouse {
  width: calc(var(--pikachu-size) * 0.043);
  height: calc(var(--pikachu-size) * 0.022);
  background-color: #000;
  z-index: 1;
  position: absolute;
  top: 54%;
  left: 47%;
  border-radius: 30% 30% 50% 50% / 30% 30% 70% 70%;
}
.pikachu .mouth {
  width: calc(var(--pikachu-size) * 0.2143);
  height: calc(var(--pikachu-size) * 0.04);
  position: absolute;
  top: 70%;
  left: 35%;
  overflow: hidden;
}
.pikachu .mouth::before,
.pikachu .mouth::after {
  content: "";
  width: 50%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 1px 0 #0004;
  bottom: 1px;
  left: 0;
}
.pikachu .mouth::after {
  left: 50%;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
  height: 40%;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(88, 131, 196);
  height: 40%;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(16, 61, 129);
  height: 40%;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
  height: 40%;
  border-radius: 10px;
}
</style>
