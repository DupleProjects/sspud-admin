<template>
  <div class="product-publish-component card mt-4">
    <h1>Product Publish Component</h1>
    <div v-if="product">
      <v-alert
          v-if="!product.publish"
          border="right"
          colored-border
          type="error"
          elevation="2">
        This Product is not published
      </v-alert>
      <v-alert
          v-if="product.publish"
          border="right"
          colored-border
          type="success"
          elevation="2">
        This Product is  published
      </v-alert>
      <v-alert
          v-if="product.BOBSRequired"
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
<!--        <v-btn-->
<!--            :disabled="!product.BOBSCertificate"-->
<!--            @click="downloadBOBSCertificate()"-->
<!--            class="mt-3">Download BOBS</v-btn>-->
        <v-file-input
            label="BOBS Certificate"
            hide-input
            v-on:change="onNewFileUpload('BOBSCertificates', 'pdf')"
            v-model="BOBSCertificate"
        ></v-file-input>
      </div>
      <v-alert
          v-if="product.SABSRequired"
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
      <v-btn
          v-if="!product.publish"
          :disabled="product.publish"
          @click="publishProduct()"
          color="primary">Publish Product</v-btn>
      <v-btn
          v-if="product.publish"
          :disabled="!product.publish"
          @click="publishProduct()"
          color="warning">Un Publish Product</v-btn>
    </div>
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
      BOBSCertificate: null,
      SABSCertificate: null
    }
  },
  mounted() {

  },
  methods: {
    async publishProduct() {
      console.log('this.product', this.product)
      if (productMixin.methods.evaluateProduct(this.product)) {
        await this.saveProduct();
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
          this.product.BOBSCertificate = response;
        }
      }
      fileReader.readAsDataURL(this.BOBSCertificate)
    },
    downloadBOBSCertificate() {
      const link = document.createElement('a');
      // create a blobURI pointing to our Blob
      // link.href = this.product.BOBSCertificate;
      console.log('this.product.BOBSCertificate', this.product.BOBSCertificate)

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
