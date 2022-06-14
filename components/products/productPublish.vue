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
    "
  >
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
        v-if="product.BOBSRequired && !product.BOBSCertificate"
        border="right"
        colored-border
        type="error"
        elevation="2"
      >
        This Product requires a BOBS Certificate
      </v-alert>
      <v-alert
        v-if="!product.BOBSRequired"
        border="right"
        colored-border
        type="success"
        elevation="2"
      >
        This Product does not require a BOBS Certificate
      </v-alert>
      <div class="d-flex mb-3">
        <v-btn
          :disabled="!product.BOBSCertificate"
          @click="downloadBOBSCertificate()"
          class="mt-3"
          >Download BOBS</v-btn
        >
        <v-file-input
          label="BOBS Certificate"
          hide-input
          v-on:change="onNewFileUpload('BOBSCertificates', 'pdf')"
          v-model="BOBSCertificate"
        ></v-file-input>
      </div>
      <v-alert
        v-if="product.SABSRequired && !product.SABSCertificate"
        border="right"
        colored-border
        type="error"
        elevation="2"
      >
        This Product requires a SABS Certificate
      </v-alert>
      <v-alert
        v-if="!product.SABSRequired"
        border="right"
        colored-border
        type="success"
        elevation="2"
      >
        This Product does not require a SABS Certificate
      </v-alert>
      <div class="d-flex mb-3">
        <v-btn
          :disabled="!product.SABSCertificate"
          @click="downloadSABSCertificate()"
          class="mt-3"
          >Download SABS</v-btn
        >
        <v-file-input
          label="SABS Certificate"
          hide-input
          v-on:change="onNewFileUpload('SABSCertificates', 'pdf')"
          v-model="SABSCertificate"
        ></v-file-input>
      </div>
      <v-progress-circular
        v-if="saving"
        :size="20"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-btn
        v-if="!product.publish && !saving"
        @click="publishProduct()"
        color="primary"
        >Publish Product</v-btn
      >
      <v-btn
        v-if="product.publish && !saving"
        @click="unpublishProduct()"
        color="warning"
        >Un Publish Product</v-btn
      >
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
      snackbar: false,
      snackBarText: "My timeout is set to 2000.",
      timeout: 2000,
      loading: false,
      saving: false,
      BOBSCertificate: null,
      SABSCertificate: null,
      couldNotPublishdialog: false,
      invalidItems: [],
    };
  },
  mounted() {},
  methods: {
    async publishProduct() {
      if (productMixin.methods.canPublishProduct(this.product).isValidProduct == true ) {
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
          this.product
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
    async onNewFileUpload(folder, type) {
      const fileReader = new FileReader();
      const self = this;
      // Determine the name
      let fileName = "";
      if (folder === "BOBSCertificates") {
        fileName = this.BOBSCertificate.name.split(".")[0];
      } else if (folder === "SABSCertificates") {
        fileName = this.SABSCertificate.name.split(".")[0];
      }
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
      if (folder === "BOBSCertificates") {
        fileReader.readAsDataURL(this.BOBSCertificate);
      } else if (folder === "SABSCertificates") {
        fileReader.readAsDataURL(this.SABSCertificate);
      }
    },
    downloadBOBSCertificate() {
      const link = document.createElement("a");
      link.href = this.product.BOBSCertificate;
      link.download = "BOBSCertificate.pdf";
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    },
    downloadSABSCertificate() {
      const link = document.createElement("a");
      link.href = this.product.SABSCertificate;
      link.download = "SABSCertificate.pdf";
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    },
  },
};
</script>

<style scoped>
.product-publish-component {
  padding: 20px;
}
</style>
