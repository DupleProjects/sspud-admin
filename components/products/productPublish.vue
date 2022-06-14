<template>
  <div
    v-if="product"
    class="
      product-publish-component
      card
      mt-4
      fadeInUp
      animated
      animatedFadeInUp
    ">
    <div>
      <v-alert
        v-if="!product.publish"
        border="right"
        colored-border
        :type="product.publish ? 'success' : 'error'"
        elevation="2"
      >
        {{
          product.publish
            ? "This Product is published"
            : "This Product is not published"
        }}
      </v-alert>
      <v-alert
        v-if="product.certificateRequired && certificates.length === 0"
          border="right"
          colored-border
          type="error"
          elevation="2">
        This Product requires a certificates
      </v-alert>
      <div class="d-flex justify-content-between">
        <div>
          <h2>Product Certificates</h2>
          <p v-if="product.certificateRequired" class="text-muted">This product requires a certificate</p>
        </div>
        <v-btn
            color="primary"
            rounded
            dark
            :loading="isSelecting"
            @click="handleFileImport">
          Upload File
        </v-btn>
        <!-- Create a File Input that will be hidden but triggered with JavaScript -->
        <input
            ref="uploader"
            class="d-none"
            type="file"
            @change="onNewFileUpload">
      </div>
      <hr>
      <div v-for="(certificate, index) of certificates" :key="index" class="d-flex justify-content-between border-bottom py-2 align-baseline">
        <a class="link mb-0">{{getCertificateFileName(certificate)}}</a>
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
      <div class="text-center no-certificates" v-if="certificates.length === 0">
        <p>No certificates uploaded</p>
      </div>
      <!-- Publish Buttons -->
      <div class="text-end py-3">
        <v-progress-circular
            v-if="saving"
            :size="20"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <v-btn
            v-if="!product.publish && !saving"
            @click="publishProduct()"
            color="primary">Publish Product</v-btn>
        <v-btn
            v-if="product.publish && !saving"
            @click="unpublishProduct()"
            color="warning">Un Publish Product</v-btn>
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
      certificates: []
    }
  },
  beforeMount() {
    this.$nextTick(async function () {
      await this.loadCertificates();
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
    async publishProduct() {
      console.log("1. 👉",this.certificates);
      if (productMixin.methods.canPublishProduct(this.product, this.certificates).isValidProduct == true ) {
        this.saving = true;
        const response = await this.$store.dispatch("callMiddlewareRoute", {
          product: this.product,
          route: "products/publishStagedProduct",
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
      } else {
        // alert("You can not publish this product. Stuff is still missing.");
        this.couldNotPublishdialog = true;
        var returnedDetails = productMixin.methods.canPublishProduct(
          this.product, this.certificates
        );

        console.log("details---",returnedDetails);

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
        console.log('response', response)
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
          console.log(savedCertificate)
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
      console.log('certificate', certificate)
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
      console.log('response', response)
      const certificateDeleteResponse = await this.$store.dispatch("dataGate", {
        tableName: "stagedProductCertificates",
        operation: "delete",
        primaryKey: 'id',
        entity: certificate
      });
      console.log('certificateDeleteResponse', certificateDeleteResponse)
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
  height: 30vh
}
</style>
