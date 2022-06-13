<template>
  <div v-if="product" class="product-publish-component card mt-4 fadeInUp animated animatedFadeInUp">
    <div>
      <v-alert
          v-if="!product.publish"
          border="right"
          colored-border
          :type="product.publish ? 'success' : 'error'"
          elevation="2">
        {{product.publish ? 'This Product is published' : 'This Product is not published'}}
      </v-alert>
      <v-alert
          v-if="product.BOBSRequired && !product.BOBSCertificate"
          border="right"
          colored-border
          type="error"
          elevation="2">
        This Product requires a BOBS Certificate
      </v-alert>
      <v-alert
          v-if="!product.BOBSRequired"
          border="right"
          colored-border
          type="success"
          elevation="2">
        This Product does not require a BOBS Certificate
      </v-alert>
      <div class="d-flex mb-3">
        <v-btn
            :disabled="!product.BOBSCertificate"
            @click="downloadBOBSCertificate()"
            class="mt-3">Download BOBS</v-btn>
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
          elevation="2">
        This Product requires a SABS Certificate
      </v-alert>
      <v-alert
          v-if="!product.SABSRequired"
          border="right"
          colored-border
          type="success"
          elevation="2">
        This Product does not require a SABS Certificate
      </v-alert>
      <div class="d-flex mb-3">
        <v-btn
            :disabled="!product.SABSCertificate"
            @click="downloadBOBSCertificate()"
            class="mt-3">Download SABS</v-btn>
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
          color="primary">Publish Product</v-btn>
      <v-btn
          v-if="product.publish && !saving"
          @click="unpublishProduct()"
          color="warning">Un Publish Product</v-btn>
    </div>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout">
      {{ snackBarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import productMixin from '@/mixins/productMixin.js'
export default {
  props: {
    product: null
  },
  data() {
    return {
      snackbar: false,
      snackBarText: 'My timeout is set to 2000.',
      timeout: 2000,
      loading: false,
      saving: false,
      BOBSCertificate: null,
      SABSCertificate: null
    }
  },
  mounted() {

  },
  methods: {
    async publishProduct() {
      if (productMixin.methods.canPublishProduct(this.product)) {
        this.saving = true;
        const response = await this.$store.dispatch("callMiddlewareRoute", {
          product: this.product,
          route: 'products/publishStagedProduct'
        });
        if (response.success) {
          // Remove review required if we are publishing
          this.product.reviewRequired = false;
          this.product.publish = !this.product.publish;
          this.snackBarText = 'Product Successfully Published!';
          this.snackbar = true;
        } else {
          this.snackBarText = 'Product Not Successfully Published :(';
          this.snackbar = true;
        }
        this.saving = false;
      } else {
        alert('You can not publish this product. Stuff is still missing.')
      }
    },
    async unpublishProduct() {
      this.saving = true;
      const response = await this.$store.dispatch("callMiddlewareRoute", {
        product: this.product,
        route: 'products/unpublishStagedProduct'
      });
      if (response.success) {
        // Remove review required if we are publishing
        this.product.reviewRequired = false;
        this.product.publish = !this.product.publish;
        this.snackBarText = 'Product Successfully Published!';
        this.snackbar = true;
      } else {
        this.snackBarText = 'Product Not Successfully Published :(';
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
      let fileName = this.BOBSCertificate.name.split('.')[0];
      fileName = fileName.replaceAll(' ', '');
      fileReader.onload = async function() {
        const response = await self.$store.dispatch("callMiddlewareRoute", {
          route: "aws/uploadFile",
          fileName,
          contentType: 'application/' + type,
          file: fileReader.result,
          folder
        });
        if (response) {
          if (folder === 'BOBSCertificates') {
            self.product.BOBSCertificate = response;
          } else if (folder === 'SABSCertificates') {
            self.product.SABSCertificate = response;
          }
          await self.saveProduct();
        }
      }
      fileReader.readAsDataURL(this.BOBSCertificate)
    },
    downloadBOBSCertificate() {
      const link = document.createElement('a');
      link.href = 'https://tsazonkeimages.s3.af-south-1.amazonaws.com/BOBSCertificates/test.pdf';
      link.download = 'test.pdf';
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    }
  }
}
</script>

<style scoped>
.product-publish-component {
  padding: 20px;
}
</style>
