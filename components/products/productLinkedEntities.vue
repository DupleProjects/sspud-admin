<template>
  <div
    class="product-publish-component card fadeInUp animated animatedFadeInUp"
    v-if="product"
  >
    <div class="">
      <table class="table">
        
        <thead>
          <tr>
            <th  scope="col"></th>
            <th class="table-cell" scope="col"><h5>{{ getCategory(product.categoryId) }}</h5>BambaZonke Category</th>
            <th class="table-cell" scope="col"><h5>{{ getSubcategory(product.subCategoryId) }}</h5>BambaZonke Subategory</th>
            <th class="table-cell" scope="col"><h5 v-if="linkedScrapedCategory">{{linkedScrapedCategory}}</h5>Scraped Category</th>
            <th class="table-cell" scope="col"><h5 v-if="linkedScrapedSubcategory">{{linkedScrapedSubcategory}}</h5>Scraped Subcategory</th>
          </tr>
        </thead>
        <tbody>
          <!-- Certificate Required -->
          <tr>
            <td class="left-cell"><b>Certificate Required</b></td>
            <td class="table-cell">
              <v-icon v-if="catCertificate  == 'TRUE'" large color="green">mdi-check</v-icon>
              <v-icon v-if="catCertificate == 'FALSE'"  large color="red">mdi-close</v-icon>
              <v-icon v-if="!catCertificate">Not Linked</v-icon>
            </td>
            <td class="table-cell">
              <v-icon v-if="subCatCertificate  == 'TRUE'"  large color="green">mdi-check</v-icon>
              <v-icon v-if="subCatCertificate == 'FALSE'"  large color="red">mdi-close</v-icon>
              <h5 style="color:red" v-if="!subCatCertificate">Not Linked</h5>
            </td>
            <td class="table-cell"><h5>N/A</h5></td>
            <td class="table-cell"><h5>N/A</h5></td>
            
          </tr>
          <!-- Publish -->
          <tr>
            <td class="left-cell"><b>Publish</b></td>
            <td class="table-cell">
              <v-icon v-if="catPublished == 'TRUE'"  large color="green">mdi-check</v-icon>
              <v-icon v-if="catPublished == 'FALSE'"  large color="red">mdi-close</v-icon>
              <h5 style="color:red" v-if="!catPublished">Not Linked</h5>
            </td>
            <td class="table-cell">
              <v-icon v-if="subcatPublished == 'TRUE'"  large color="green">mdi-check</v-icon>
              <v-icon v-if="subcatPublished == 'FALSE'"  large color="red">mdi-close</v-icon>
              <h5 style="color:red" v-if="!subcatPublished">Not Linked</h5>
            </td>
            <td class="table-cell">
              <v-icon v-if="scrapedcatPublished == 'TRUE'"  large color="green">mdi-check</v-icon>
              <v-icon v-if="scrapedcatPublished == 'FALSE'"  large color="red">mdi-close</v-icon>
              <h5 style="color:red" v-if="!scrapedcatPublished">Not Linked</h5>
            </td>
            <td class="table-cell">
              <v-icon v-if="scrapedSubcatPublished == 'TRUE'"  large color="green">mdi-check</v-icon>
              <v-icon v-if="scrapedSubcatPublished == 'FALSE'"  large color="red">mdi-close</v-icon>
              <h5 style="color:red" v-if="!scrapedSubcatPublished">Not Linked</h5>
            </td>
          </tr>
        </tbody>
      </table>
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
      catPublished: null,
      catCertificate: null,
      subcatPublished: null,
      subCatCertificate: null,
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
      console.log("🙌⚡",this.scrapedCategories);
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

        
          console.log("👉👉",category);

        if (category) {
          if (category.publish == 1) {
            this.catPublished = "TRUE";
          } else {
            this.catPublished = "FALSE";
          }

          // if (category.BOBSRequired == 1) {
          //   this.catBOBS = "TRUE";
          // } else {
          //   this.catBOBS = "FALSE";
          // }

          // if (category.SABSRequired == 1) {
          //   this.catSABS = "TRUE";
          // } else {
          //   this.catSABS = "FALSE";
          // }

          if(category.certificateRequired == 1){
            this.catCertificate = "TRUE";
          }else{
            this.catCertificate = "FALSE";
          }

          this.linkedScrapedSubcategory = null;
          const linkedScrapedCat = this.scrapedCategories.find(
            (x) => x.mappedCategoryId === category.id
          );
          console.log("LINKED SCRAPED CATEGORY",linkedScrapedCat);
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
      return null;
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

          if(category.certificateRequired == 1){
            this.subCatCertificate = "TRUE";
          }else{
            this.subCatCertificate = "FALSE";
          }

          // if (category.BOBSRequired == 1) {
          //   this.subcatBOBS = "TRUE";
          // } else {
          //   this.subcatBOBS = "FALSE";
          // }

          // if (category.SABSRequired == 1) {
          //   this.subcatSABS = "TRUE";
          // } else {
          //   this.subcatSABS = "FALSE";
          // }
          return category.name;
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.product-publish-component {
  padding: 20px;
}

.row-style {
  padding: 10px;
}

.info-message {
  width: 45%;
  float: left;
  margin-left: auto;
  margin-right: auto;
  height: auto;
}

.card-subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-top: -10px;
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
  background-color: #f5f6f8;
}
.fancy-row:hover .actions-column {
  display: flex;
}
.inner-fancy-heading-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-heading-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1fr 0.5fr 1fr 1fr 1fr 0.5fr;
  -webkit-box-align: center;
  align-items: center;
}
.inner-fancy-row-staged {
  min-width: 0px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr 1fr 1fr 0.5fr 0.5fr 0.5fr;
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
  min-width: 25%;
}

.product-list {
  height: 65vh;
  overflow: auto;
}

.table-cell{
  text-align: center;
}

.left-cell{
  vertical-align: middle;
}
</style>
