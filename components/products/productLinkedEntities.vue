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
            <!-- <th class="table-cell" scope="col"><h5 v-if="linkedScrapedCategory">{{linkedScrapedCategory}}</h5>Scraped Category</th>
            <th class="table-cell" scope="col"><h5 v-if="linkedScrapedSubcategory">{{linkedScrapedSubcategory}}</h5>Scraped Subcategory</th> -->
            <th class="table-cell" scope="col"><h6>Certificate Required</h6></th>
            <th class="table-cell" scope="col"><h6>Publish Allowed</h6></th>
          </tr>
        </thead>
        <tbody>
          <!-- BZ Category -->
          <tr>
            <td class="left-cell">
              <h5 class="table-item-heading">{{ productDetails.categoryName}}</h5>
              <span class="table-item-subheading">BambaZonke Category</span>
            </td>
            <td class="table-cell">
              <v-icon v-if="productDetails.certificateRequired == 1" large color="green">mdi-check</v-icon>
              <v-icon v-else-if="productDetails.certificateRequired == 0"  large color="red">mdi-close</v-icon>
              <!-- <v-icon v-if="!productDetails.certificateRequired">Not Linked</v-icon> -->
            </td>
            <td class="table-cell">
              <v-icon v-if="productDetails.categoryPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="productDetails.categoryPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!productDetails.categoryPublish">Not Linked</h5> -->
            </td>       
          </tr>
          <!-- BZ Subcategory -->
          <tr v-if="productDetails.subCategoryName">
            <td class="left-cell">
              <h5 class="table-item-heading">{{ productDetails.subCategoryName }}</h5>
              <span class="table-item-subheading">BambaZonke Subcategory</span>
            </td>
            <td class="table-cell">
              <v-icon v-if="productDetails.subCertificateRequired == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="productDetails.subCertificateRequired == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!productDetails.subCertificateRequired">Not Linked</h5> -->
            </td>
            <td class="table-cell">
              <v-icon v-if="productDetails.subCategoryPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="productDetails.subCategoryPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!productDetails.subCategoryPublish">Not Linked</h5> -->
            </td>       
          </tr>
          <!-- BZ Brand -->
          <tr v-if="productDetails.brandName">
            <td class="left-cell">
              <h5 class="table-item-heading">{{ productDetails.brandName }}</h5>
              <span class="table-item-subheading">BambaZonke Brand</span>
            </td>
            <td class="table-cell"><h5>N/A</h5></td>
            <td class="table-cell">
              <v-icon v-if="productDetails.brandPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="productDetails.brandPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!productDetails.subCategoryPublish">Not Linked</h5> -->
            </td>       
          </tr>
          <!-- Scraped Category -->
          <tr>
            <td class="left-cell">
              <h5 class="table-item-heading">{{scrapedProductDetails.categoryName}}</h5>
              <span class="table-item-subheading">Scraped Category</span>
            </td>
            <td class="table-cell"><h5>N/A</h5></td>
            <td class="table-cell">
              <v-icon v-if="scrapedProductDetails.categoryPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="scrapedProductDetails.categoryPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!scrapedProductDetails.categoryPublish">Not Linked</h5> -->
            </td>
          </tr>
          <!-- Scraped Subcategory -->
          <tr>
            <td class="left-cell">
              <h5 class="table-item-heading">{{scrapedProductDetails.subCategoryName}}</h5>
              <!-- <h5 class="table-item-heading">{{linkedScrapedSubcategory}}</h5> -->
              <span class="table-item-subheading">Scraped Subcategory</span>
            </td>
            <td class="table-cell"><h5>N/A</h5></td>
            <td class="table-cell">
              <v-icon v-if="scrapedProductDetails.subCategoryPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="scrapedProductDetails.subCategoryPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!scrapedProductDetails.subCategoryPublish">Not Linked</h5> -->
            </td>  
          </tr>
          <!-- Scraped Sub-Subcategory -->
          <tr v-if="scrapedProductDetails.subSubCategoryName">
            <td class="left-cell">
              <!-- Certificate -->
              <h5 class="table-item-heading">{{scrapedProductDetails.subSubCategoryName}}</h5>
              <span class="table-item-subheading">Scraped Sub-Subcategory</span>
              <!-- Publish -->
            </td>
            <td class="table-cell"><h5>N/A</h5></td>
            <td class="table-cell">
              <v-icon v-if="scrapedProductDetails.subSubCategoryPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="scrapedProductDetails.subSubCategoryPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!scrapedProductDetails.subSubCategoryPublish">Not Linked</h5> -->
            </td> 
          </tr>
          <!-- Scraped Brand -->
          <tr v-if="scrapedProductDetails.brandName">
            <td class="left-cell">
              <!-- Certificate -->
              <h5 class="table-item-heading">{{scrapedProductDetails.brandName}}</h5>
              <span class="table-item-subheading">Scraped Brand</span>
              <!-- Publish -->
            </td>
            <td class="table-cell"><h5>N/A</h5></td>
            <td class="table-cell">
              <v-icon v-if="scrapedProductDetails.brandPublish == 1"  large color="green">mdi-check</v-icon>
              <v-icon v-if="scrapedProductDetails.brandPublish == 0"  large color="red">mdi-close</v-icon>
              <!-- <h5 style="color:red" v-if="!scrapedProductDetails.subSubCategoryPublish">Not Linked</h5> -->
            </td> 
          </tr>
          <!-- Net Publish & Certificate -->
          <tr>
            <td class="left-cell">
              <h5 class="table-item-heading">Net Values</h5>
            </td>
            <td class="table-cell"><h6 style="color:red" v-if="netCertificateRequired">CERTIFICATE REQUIRED</h6><h6 style="color:green" v-else>NO CERTIFICATE REQUIRED</h6></td>
            <td class="table-cell"><h6 style="color:green" v-if="netPublish">CAN PUBLISH</h6><h6 style="color:red" v-else>CANNOT PUBLISH</h6></td>
          </tr>
          <!-- Certificate Required -->
          <!-- <tr>
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
            
          </tr> -->
          <!-- Publish -->
          <!-- <tr>
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
          </tr> -->
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
      scrapedCategory: null,
      scrapedProductDetails:{},
      productDetails:{},
      netPublish: true,
      netCertificateRequired: false,
      allBrands: [],
      allScrapedBrands: []
    };
  },
  beforeMount() {
    this.$nextTick(async function () {

      // this.thisProduct = this.product;
      console.log("THIS PRODUCT", this.product);
      // BZ Category Details
      const categories = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });

      if(categories.data){
        this.allBZCategories = categories.data;

        const mainCategoryBz = this.allBZCategories.find(cat => cat.id === this.product.categoryId);
        if(mainCategoryBz){
          this.productDetails.categoryName = mainCategoryBz.name,
          this.productDetails.categoryPublish = mainCategoryBz.publish,
          this.productDetails.certificateRequired = mainCategoryBz.certificateRequired
        }

        const subCategoryBz = this.allBZCategories.find(cat => cat.id === this.product.subCategoryId);
        if(subCategoryBz){
          this.productDetails.subCategoryName = subCategoryBz.name,
          this.productDetails.subCategoryPublish = subCategoryBz.publish,
          this.productDetails.subCertificateRequired = subCategoryBz.certificateRequired
        }

      }

      // BZ Brand Details
      const mappedBrandsResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read"
      });

      if(mappedBrandsResponse.data){
        this.allBrands = mappedBrandsResponse.data

        const brand = this.allBrands.find(brand => brand.id === this.product.brandId);
        if(brand){
          this.productDetails.brandName = brand.name,
          this.productDetails.brandPublish = brand.publish
        }
      }

      console.log("this.productDetails",this.productDetails);



      
      if(this.productDetails.certificateRequired == 1 || this.productDetails.subCertificateRequired == 1){
        this.netCertificateRequired = true;
      }

      // Scraped Category Details
      const scrapedCategoriesResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedCategories",
        operation: "read",
      });

      if(scrapedCategoriesResponse.data){
        this.scrapedCategories = scrapedCategoriesResponse.data;
      }
      const scrapedProductsResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedProducts",
        operation: "read",
        whereCriteria: {id: this.product.scrapedProductId}
      });

      
      const scrapedBrandsResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedBrands",
        operation: "read",
      });
        this.allScrapedBrands = scrapedBrandsResponse.data

      if(scrapedProductsResponse.data){
        this.scrapedCategory = scrapedProductsResponse.data
        console.log("this.scrapedCategory",this.scrapedCategory);

        const category = this.scrapedCategories.find(cat => cat.name === this.scrapedCategory[0].categoryName);
        if(category){
          this.scrapedProductDetails.categoryName = category.name,
          this.scrapedProductDetails.categoryPublish = category.publish
        }
        const subCategory = this.scrapedCategories.find(cat => cat.name === this.scrapedCategory[0].subCategoryName);
        if(subCategory){
          this.scrapedProductDetails.subCategoryName = subCategory.name,
          this.scrapedProductDetails.subCategoryPublish = subCategory.publish
        }
        const subSubCategory = this.scrapedCategories.find(cat => cat.name === this.scrapedCategory[0].subSubCategoryName);
        if(subSubCategory){
          this.scrapedProductDetails.subSubCategoryName = subSubCategory.name,
          this.scrapedProductDetails.subSubCategoryPublish = subSubCategory.publish
        }
        const scrapedBrand = this.allScrapedBrands.find(brand => brand.name === this.scrapedCategory[0].brand);
        if(scrapedBrand){
          this.scrapedProductDetails.brandName = scrapedBrand.name,
          this.scrapedProductDetails.brandPublish = scrapedBrand.publish
        }

        
        this.scrapedProductDetails = {
          categoryName: category.name,
          categoryPublish: category.publish,
          subCategoryName: subCategory.name,
          subCategoryPublish: subCategory.publish,
          subSubCategoryName: subSubCategory.name,
          subSubCategoryPublish: subSubCategory.publish,
          brandName: scrapedBrand.name,
          brandPublish: scrapedBrand.publish
        }
        
      }

      if(
        this.productDetails.categoryPublish == 0 ||
        this.productDetails.subCategoryPublish == 0 ||
        this.productDetails.brandPublish == 0 ||
        this.scrapedProductDetails.subCategoryPublish == 0 ||
        this.scrapedProductDetails.subSubCategoryName == 0 ||
        this.scrapedProductDetails.subSubCategoryPublish == 0 ||
        this.scrapedProductDetails.brandPublish == 0
      ){
        this.netPublish = false;
      }


      

      console.log("this.scrapedProductDetails",this.scrapedProductDetails);
      

      
    });
  },
  methods: {
    async publishProduct() {
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
  font-size: small;
}

.left-cell{
  vertical-align: middle;
}

.table-item-heading{
  margin-bottom:-3px;
  font-size: medium;
}

.table-item-subheading{
  font-size:13px;
  margin-top:-15px;
}
</style>
