<template>
  <div
    v-if="product"
    class="product-publish-component fadeInUp animated animatedFadeInUp">
    <div class="d-flex flex-column justify-content-between">
      <div>
        <!-- Heading -->
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap pt-5">
          <p class="lead">Publish Detail</p>
          <!--Search would be here-->
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group me-2">
              <!-- Publish Buttons -->
              <v-progress-circular
                  v-if="saving"
                  :size="20"
                  indeterminate
                  color="primary"
              ></v-progress-circular>
              <v-btn
                  small
                  v-if="!product.publish && !saving"
                  @click="publishProduct()"
                  color="success">Publish</v-btn>
              <v-btn
                  small
                  v-if="product.publish && !saving"
                  @click="unpublishProduct()"
                  color="warning">Unpublish</v-btn>
            </div>
          </div>
        </div>
        <hr class="mt-0" />
        <div class="d-flex justify-content-between publish-meta align-baseline">
          <div class="flex-grow-1 d-flex justify-content-between px-3">
            <p class="mb-0">Published</p>
            <v-icon
                v-if="!product.publish"
                style="color:red;">mdi-close-thick</v-icon>
            <v-icon
                v-if="product.publish"
                style="color:#53fd00;">mdi-check-bold</v-icon>
          </div>
          <div class="flex-grow-1">

          </div>
        </div>
        <v-alert
            v-if="product.certificateRequired && certificates.length === 0"
            border="right"
            colored-border
            type="error"
            elevation="2">
          This Product requires a certificates
        </v-alert>
        <!-- Heading -->
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap pt-5">
          <p class="lead">Documents <small v-if="product.certificateRequired" class="text-muted">(Required)</small></p>
          <!--Search would be here-->
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group me-2">
              <v-btn
                  color="primary"
                  small
                  dark
                  :disabled="saving"
                  :loading="isSelecting"
                  @click="handleFileImport"
                  class="">
                Upload File
              </v-btn>
              <!-- Create a File Input that will be hidden but triggered with JavaScript -->
              <input
                  ref="uploader"
                  class="d-none"
                  type="file"
                  @change="onNewFileUpload"
                  accept=".pdf">
            </div>
          </div>
        </div>
        <hr class="mt-0" />
        <!-- List of the files -->
        <div v-for="(certificate, index) of certificates" :key="index" class="d-flex justify-content-between border-bottom py-2 px-2 align-baseline">
          <a class="link mb-0" @click="downloadCertificate(certificate)">{{getCertificateFileName(certificate)}}</a>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button
                @click="downloadCertificate(certificate)"
                class="btn btn-primary">Download</button>
            <button
                @click="deleteCertificate(certificate)"
                class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
        <div class="text-center no-certificates d-flex flex-column justify-content-center" v-if="certificates.length === 0">
          <v-icon large style="color:#ffd200;">mdi-alert</v-icon>
          <p>No certificates uploaded</p>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackBarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Could Not Publish Dialog -->
    <template>
      <div class="text-center">
        <v-dialog v-model="couldNotPublishdialog" width="500">
          <v-card>
            <v-card-title class="text-h5 red">
              Could Not Publish Product
            </v-card-title>

            <v-card-text class="mt-3">
              <h6>
                This product could not be published due to invalid fields.
                Please rectify the below fields before publishing.
              </h6>

              <v-list>
                
                <v-list-item
                  v-for="item in invalidItems"
                  :key="item"
                  style="color:red;"
                >
                <v-list-item-icon class="mr-3">
                  <v-icon style="color:red;">mdi-alert-box</v-icon>
                </v-list-item-icon> 
                  <h6 class="mb-0">{{ item }}</h6>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="couldNotPublishdialog = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import productMixin from "@/mixins/productMixin.js";
import baseMixin from "@/mixins/baseMixin";

export default {
  props: {
    product: null,
  },
  data() {
    return {
      isSelecting: false,
      snackbar: false,
      snackBarText: "My timeout is set to 2000.",
      timeout: 2000,
      loading: false,
      saving: false,
      couldNotPublishdialog: false,
      invalidItems: [],
      newCertificate: null,
      certificates: [],
      allBZCategories: [],
      scrapedProductDetails:{},
      productDetails:{},
      netPublish: true,
      netCertificateRequired: false,
      allBrands: [],
      allScrapedBrands: [],
      unlinkedEntities: false,
      // Used to compare at the end
      originalProduct: null,
    }
  },
  beforeMount() {
    this.$nextTick(async function () {
      // Clone the product to compare later
      this.originalProduct = baseMixin.methods.clone(this.product);
      await this.loadCertificates();

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
        }else{
          this.productDetails.categoryName = null
          this.productDetails.categoryPublish = null
          this.productDetails.certificateRequired = null
        }

        const subCategoryBz = this.allBZCategories.find(cat => cat.id === this.product.subCategoryId);
        if(subCategoryBz){
          this.productDetails.subCategoryName = subCategoryBz.name,
          this.productDetails.subCategoryPublish = subCategoryBz.publish,
          this.productDetails.subCertificateRequired = subCategoryBz.certificateRequired
        }else{
          this.productDetails.subCategoryName = null
          this.productDetails.subCategoryPublish = null
          this.productDetails.subCertificateRequired = null
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
        }else{
          this.productDetails.brandName = null
          this.productDetails.brandPublish = null
        }
      }
      
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
        this.productDetails.categoryPublish == null ||
        this.productDetails.subCategoryPublish == 0 ||
        this.productDetails.subCategoryPublish == null ||
        this.productDetails.brandPublish == 0 ||
        this.productDetails.brandPublish == null ||
        this.scrapedProductDetails.subCategoryPublish == 0 ||
        this.scrapedProductDetails.subSubCategoryName == 0 ||
        this.scrapedProductDetails.subSubCategoryPublish == 0 ||
        this.scrapedProductDetails.brandPublish == 0
      ){
        if(this.productDetails.categoryPublish == null ||this.productDetails.subCategoryPublish == null ||this.productDetails.brandPublish == null){
          this.unlinkedEntities = true;
        }
        this.netPublish = false;
      }
      
    });
  },
  mounted() {
  },
  methods: {
    async loadCertificates() {
      const certificatesResponse = await this.$store.dispatch("dataGate", {
        tableName: "stagedProductCertificates",
        operation: "read",
        whereCriteria: {stagedProductId: this.product.id}
      });
      if (certificatesResponse && certificatesResponse.data) {
        this.certificates = certificatesResponse.data;
      }
    },
    checkIfCanPublish(){
      this.loading = true
      if(productMixin.methods.canPublishProduct(this.product,this.certificates).isValidProduct == true){
        if(this.netPublish == true){
          this.loading = false
          return false;
        }else{
          this.loading = false
          return true;
        }
    }
      else{
        this.loading = false
        return true;
      }
    },
    async publishProduct() {
      if (productMixin.methods.canPublishProduct(this.product, this.certificates).isValidProduct == true ) {
        this.saving = true;
        const response = await this.$store.dispatch("callMiddlewareRoute", {
          product: this.product,
          route: "products/publishStagedProduct",
        });
        if (response.success) {
          // Remove review required if we are publishing
          this.product.reviewRequired = false;
          this.product.publish = true;
          await this.compareProduct();
          this.snackBarText = "Product Successfully Published!";
          this.snackbar = true;
        } else {
          this.snackBarText = "Product Not Successfully Published :(";
          this.snackbar = true;
        }
        this.saving = false;
      } else {
        // alert("You can not publish this product. Stuff is still missing.");
        this.couldNotPublishdialog = true;
        var returnedDetails = productMixin.methods.canPublishProduct(
          this.product, this.certificates
        );


        this.invalidItems = [];

        if (!returnedDetails.productDetails.validBrand) {
          this.invalidItems.push("Invalid Brand");
        }
        if (!returnedDetails.productDetails.validCategory) {
          this.invalidItems.push("Invalid Category");
        }
        if (!returnedDetails.productDetails.validDescription) {
          this.invalidItems.push("Invalid Description");
        }
        if (!returnedDetails.productDetails.validHeight) {
          this.invalidItems.push("Invalid Height");
        }
        if (!returnedDetails.productDetails.validLength) {
          this.invalidItems.push("Invalid Length");
        }
        if (!returnedDetails.productDetails.validName) {
          this.invalidItems.push("Invalid Name");
        }
        if (!returnedDetails.productDetails.validPrice) {
          this.invalidItems.push("Invalid Price");
        }
        if (!returnedDetails.productDetails.validStock) {
          this.invalidItems.push("Invalid Stock");
        }
        if (!returnedDetails.productDetails.validSubCategory) {
          this.invalidItems.push("Invalid Subcategory");
        }
        if (!returnedDetails.productDetails.validWeight) {
          this.invalidItems.push("Invalid Weight");
        }
        if (!returnedDetails.productDetails.validWidth) {
          this.invalidItems.push("Invalid Width");
        }
        if (!returnedDetails.productDetails.validCertificates) {
          this.invalidItems.push("Required certificates not uploaded");
        }
        if(!this.netPublish){
          if(this.unlinkedEntities){
            this.invalidItems.push("Some entities have not been linked.");
          }else{
            this.invalidItems.push("Publish is not allowed on some or all of the linked entities.");
          }
        }
      }
    },
    async unpublishProduct() {
      this.saving = true;
      const response = await this.$store.dispatch("callMiddlewareRoute", {
        product: this.product,
        route: "products/unpublishStagedProduct",
      });
      if (response.success) {
        // Remove review required if we are publishing
        this.product.reviewRequired = false;
        this.product.publish = !this.product.publish;
        this.snackBarText = "Product Successfully Published!";
        this.snackbar = true;
      } else {
        this.snackBarText = "Product Not Successfully Published :(";
        this.snackbar = true;
      }
      this.saving = false;
    },
    async compareProduct() {
      // Check if there is any difference between original and saved product
      const logs = productMixin.methods.createProductLogs(this.product, this.originalProduct, this.$store.state.auth.user);
      console.log('logs', logs)
      // Save the logs
      for (let i = 0; i < logs.length; i++) {
        // Only handle the publish and review required property here
        if (logs[i].property === 'publish' || logs[i].property === 'reviewRequired') {
          const logCreateResponse = await this.$store.dispatch("dataGate", {
            tableName: "stagedProductLogs",
            operation: "create",
            primaryKey: 'id',
            entity: logs[i]
          });
        }
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
    async onNewFileUpload(e) {
      this.newCertificate =e.target.files[0];
      const fileReader = new FileReader();
      const self = this;
      // Determine the name
      let fileName = this.newCertificate.name.split('.')[0];
      fileName = fileName.replaceAll(' ', '');
      fileReader.onload = async function() {
        const response = await self.$store.dispatch("callMiddlewareRoute", {
          route: "aws/uploadFile",
          fileName,
          contentType: 'application/pdf',
          file: fileReader.result,
          folder: 'product-certificates'
        });
        if (response) {
          // Save certificate
          const newCertificateToSave = {
            stagedProductId: self.product.id,
            certificateLink: response
          }
          const savedCertificate = await self.$store.dispatch("dataGate", {
            primaryKey: "id",
            entity: newCertificateToSave,
            tableName: "stagedProductCertificates",
            operation: "create",
          });
          // Add the certificate to the certificate list
          if (savedCertificate && savedCertificate.response) {
            self.certificates.push(savedCertificate.response);
          }
          await self.saveProduct();
        }
      }
      fileReader.readAsDataURL(this.newCertificate)
    },
    downloadCertificate(certificate) {
      const link = document.createElement('a');
      link.href = certificate.certificateLink;
      link.download = this.getCertificateFileName(certificate);
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    },
    handleFileImport() {
      this.isSelecting = true;

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true });

      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
    getCertificateFileName(certificate) {
      return certificate.certificateLink.split('/')[certificate.certificateLink.split('/').length - 1]
    },
    async deleteCertificate(certificate) {
      this.saving = true;
      // Get the name
      let fileName = this.getCertificateFileName(certificate);
      const response = await this.$store.dispatch("callMiddlewareRoute", {
        route: "aws/deleteFile",
        fileName,
        folder: 'product-certificates'
      });
      const certificateDeleteResponse = await this.$store.dispatch("dataGate", {
        tableName: "stagedProductCertificates",
        operation: "delete",
        primaryKey: 'id',
        entity: certificate
      });
      await this.loadCertificates();
      this.saving = false;
    }
  }
}
</script>

<style scoped>
.product-publish-component {
  padding: 20px;
}
.no-certificates {
  height: 40vh
}
.publish-meta {
  min-height: 20vh
}
</style>
