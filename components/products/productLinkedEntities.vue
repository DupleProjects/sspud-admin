<template>
  <div class="product-publish-component card mt-10 mb-10">
    <div class="" v-if="product">
      <!-- BZ Main Category -->
      <v-card class="info-message">
        <v-card-title> BambaZonke Category </v-card-title>
        <v-card-subtitle class="card-subtitle">
          {{ getCategory(product.categoryId) }}
        </v-card-subtitle>
        <v-row>
          <v-col cols="7">
            <v-card-text>
              <h6>BOBS Required:</h6>
              <h6>SABS Required:</h6>
              <h6>Published:</h6>
            </v-card-text>
          </v-col>
          <v-col cols="5">
            <v-card-text>
              <h6>{{ catBOBS }}</h6>
              <h6>{{ catSABS }}</h6>
              <h6>{{ catPublished }}</h6>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>

      <!-- BZ Subcategory -->
      <v-card class="info-message">
        <v-card-title> BambaZonke Subcategory </v-card-title>
        <v-card-subtitle class="card-subtitle">
          {{ getSubcategory(product.subCategoryId) }}
        </v-card-subtitle>
        <v-row>
          <v-col cols="7">
            <v-card-text>
              <h6>BOBS Required:</h6>
              <h6>SABS Required:</h6>
              <h6>Published:</h6>
            </v-card-text>
          </v-col>
          <v-col cols="5">
            <v-card-text>
              <h6>{{ subcatBOBS }}</h6>
              <h6>{{ subcatSABS }}</h6>
              <h6>{{ subcatPublished }}</h6>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
      <!-- Scraped Category -->
      <v-card class="info-message" v-if="linkedScrapedCategory">
        <v-card-title> Scraped Category </v-card-title>
        <v-card-subtitle class="card-subtitle">
          {{ linkedScrapedCategory }}
        </v-card-subtitle>
        <v-row>
          <v-col cols="7">
            <v-card-text>
              <h6>Published:</h6>
            </v-card-text>
          </v-col>
          <v-col cols="5">
            <v-card-text>
              <h6>{{ scrapedcatPublished }}</h6>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
      <!-- Scraped Subcategory -->
      <v-card class="info-message" v-if="linkedScrapedSubcategory">
        <v-card-title> Scraped Subcategory </v-card-title>
        <v-card-subtitle class="card-subtitle">
          {{ linkedScrapedSubcategory }}
        </v-card-subtitle>
        <v-row>
          <v-col cols="7">
            <v-card-text>
              <h6>Published:</h6>
            </v-card-text>
          </v-col>
          <v-col cols="5">
            <v-card-text>
              <h6>{{ scrapedSubcatPublished }}</h6>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script>
import productMixin from "@/mixins/productMixin.js";
export default {
  props: {
    product: null,
  },
  data() {
    return {
      BOBSCertificate: null,
      SABSCertificate: null,
      allBZCategories: [],
      allBrands1: [],
      thisProduct: null,
      scrapedCategories: [],
      linkedScrapedCategory: null,
      linkedScrapedSubcategory: null,
      catBOBS: null,
      catSABS: null,
      catPublished: null,
      subcatBOBS: null,
      subcatSABS: null,
      subcatPublished: null,
      scrapedcatPublished: null,
      scrapedSubcatPublished: null,
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      // this.thisProduct = this.product;
      const categories = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });

      this.allBZCategories = categories.data;

      const scrapedCategoriesResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedCategories",
        operation: "read",
      });

      this.scrapedCategories = scrapedCategoriesResponse.data;
    });
  },
  methods: {
    async publishProduct() {
      console.log("this.product", this.product);
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
    async saveProduct() {
      const response = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        entity: this.product,
        tableName: "stagedProducts",
        operation: "update",
      });
    },
    async onNewFileUpload(folder, type) {
      const fileReader = new FileReader();
      const self = this;
      // Determine the name
      let fileName = this.BOBSCertificate.name.split(".")[0];
      fileName = fileName.replaceAll(" ", "");
      fileReader.onload = async function () {
        const response = await self.$store.dispatch("callMiddlewareRoute", {
          route: "aws/uploadFile",
          fileName,
          contentType: "application/" + type,
          file: fileReader.result,
          folder,
        });
        if (response) {
          if (folder === "BOBSCertificates") {
            self.product.BOBSCertificate = response;
          } else if (folder === "SABSCertificates") {
            self.product.SABSCertificate = response;
          }
          await self.saveProduct();
        }
      };
      fileReader.readAsDataURL(this.BOBSCertificate);
    },
    downloadBOBSCertificate() {
      const link = document.createElement("a");
      link.href =
        "https://tsazonkeimages.s3.af-south-1.amazonaws.com/BOBSCertificates/test.pdf";
      link.download = "test.pdf";
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    },
    getCategory(categoryId) {
      if (this.allBZCategories) {
        const category = this.allBZCategories.find((x) => x.id === categoryId);

        if (category) {
          if (category.publish == 1) {
            this.catPublished = "TRUE";
          } else {
            this.catPublished = "FALSE";
          }

          if (category.BOBSRequired == 1) {
            this.catBOBS = "TRUE";
          } else {
            this.catBOBS = "FALSE";
          }

          if (category.SABSRequired == 1) {
            this.catSABS = "TRUE";
          } else {
            this.catSABS = "FALSE";
          }

          this.linkedScrapedSubcategory = null;
          const linkedScrapedCat = this.scrapedCategories.find(
            (x) => x.mappedCategoryId === category.id
          );
          if (linkedScrapedCat) {
            if (
              linkedScrapedCat.parentId == null ||
              linkedScrapedCat.parentId == "0"
            ) {
              this.linkedScrapedCategory = linkedScrapedCat.name;
              if (linkedScrapedCat.publish == 1) {
                this.scrapedcatPublished = "TRUE";
              } else {
                this.scrapedcatPublished = "FALSE";
              }
            } else {
              const scrapedCategoryParent = this.scrapedCategories.find(
                (x) => x.id === linkedScrapedCat.parentId
              );
              if (linkedScrapedCat.publish == 1) {
                this.scrapedSubcatPublished = "TRUE";
              } else {
                this.scrapedSubcatPublished = "FALSE";
              }
              if (scrapedCategoryParent.publish == 1) {
                this.scrapedcatPublished = "TRUE";
              } else {
                this.scrapedcatPublished = "FALSE";
              }
              this.linkedScrapedCategory = scrapedCategoryParent.name;
              this.linkedScrapedSubcategory = linkedScrapedCat.name;
            }
          } else {
            this.linkedScrapedCategory = null;
          }

          return category.name;
        }
      }
      return "Category Not Found";
    },
    getSubcategory(categoryId) {
      if (this.allBZCategories) {
        const category = this.allBZCategories.find((x) => x.id === categoryId);
        if (category) {
          if (category.publish == 1) {
            this.subcatPublished = "TRUE";
          } else {
            this.subcatPublished = "FALSE";
          }

          if (category.BOBSRequired == 1) {
            this.subcatBOBS = "TRUE";
          } else {
            this.subcatBOBS = "FALSE";
          }

          if (category.SABSRequired == 1) {
            this.subcatSABS = "TRUE";
          } else {
            this.subcatSABS = "FALSE";
          }
          return category.name;
        }
      }
      return "Category Not Found";
    },
  },
};
</script>

<style scoped>
.product-publish-component {
  padding: 20px;
}

.info-message {
  width: 23%;
  float: left;
  margin-right: 20px;
  height: 200px;
}

.card-subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-top: -10px;
}
</style>
