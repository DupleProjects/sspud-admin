<template>
  <div class="p-2">
    <div class="row" v-if="!loading">
      <div class="col-3" v-if="product">
        <v-card class="mt-12"   style="height:85vh;">
          <div class="m-2 fadeInUp animated animatedFadeInUp">
          <img v-if="product.imageSrc && product.imageSrc != 'null'" class="card-img-top" :src="product.imageSrc" alt="image" style="width:100%; text-align:auto">
          <v-btn
            color="primary"
            rounded
            dark
            :loading="isSelecting"
            @click="handleFileImport"
            class="mt-5"
            style="margin-left:auto; margin-right:auto;">
          Upload Product Image
        </v-btn>
        <!-- Create a File Input that will be hidden but triggered with JavaScript -->
        <input
            ref="uploader"
            class="d-none"
            type="file"
            @change="onNewFileUpload">
          <div class="card-body">
            <v-card class="mt-2">
              <v-alert
                border="right"
                colored-border
                dense
                :type="product.hasStock ? 'success' : 'error'"
                elevation="2">
              Has Stock
            </v-alert>
            </v-card>
            
            <v-card>
              <v-alert
                border="right"
                colored-border
                dense
                :type="product.special ? 'success' : 'error'"
                elevation="2">
              Special
            </v-alert>
            </v-card>
            
            <v-card>
              <v-alert
                border="right"
                colored-border
                dense
                :type="'info'"
                elevation="2">
              <a target="_blank" :href="product.href">Shop Link</a>
            </v-alert>
            </v-card>
            
            <v-card>
              <v-alert
                border="right"
                colored-border
                dense
                :type="'info'"
                :to="'../../products/scraped/' + product.scrapedProductId"
                router
                elevation="2">
              <a :href="'../../../products/scraped/dashboard/' + product.scrapedProductId">Scraped Product</a>
            </v-alert>
            </v-card>
            
          </div>
        </div>
        </v-card>
        
      </div>
      <div class="col-9">
        <v-tabs background-color="transparent" v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      <v-card style="height:85vh">
        <v-tabs-items v-model="tab">
          <v-tab-item class="p-3">
            <products-product-detail
                v-if="product"
                :type="'staged'"
                :edit="true"
                class="m-2 fadeInUp animated animatedFadeInUp"
                :product="product"
            />
          </v-tab-item>
          <v-tab-item class="p-3">
            <product-linked-entities :product="product" class="fadeInUp animated animatedFadeInUp"/>
          </v-tab-item>
          <v-tab-item  class="p-3">
            <products-product-price-breakdown :product="product" />
            <products-product-publish :product="product" />
          </v-tab-item>
          <v-tab-item class="p-3">
            <products-product-log
                :productId="this.$router.currentRoute.params.id"
                :type="'stagedProducts'"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
import productLinkedEntities from '../../../../components/products/productLinkedEntities.vue';
export default {
  components: { productLinkedEntities },
  mixins: [baseMixin],
  data() {
    return {
      tab: null,
      items: [
        'details', 'linked entities', 'publish', 'log'
      ],
      product: null,
      loading: false,
      isSelecting: false,
      newImage: null,
      certificates: [],
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      // Get the product for the product id
      console.log(
        "this.$router.currentRoute.params.id",
        this.$router.currentRoute.params.id
      );
      if (this.$router.currentRoute.params.id) {
        const productResponse = await this.$store.dispatch("dataGate", {
          tableName: "stagedProducts",
          operation: "read",
          whereCriteria: { id: this.$router.currentRoute.params.id },
        });
        console.log("productResponse", productResponse);
        // Check if valid response
        if (productResponse.data && productResponse.data.length > 0) {
          this.product = productResponse.data[0];
        }
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    async onNewFileUpload(e) {
      this.newImage = e.target.files[0];
      const fileReader = new FileReader();
      const self = this;
      // Determine the name
      let fileName = this.newImage.name.split('.')[0];
      fileName = fileName.replaceAll(' ', '');
      fileReader.onload = async function() {
        console.log("result:",fileReader.result);
        const response = await self.$store.dispatch("callMiddlewareRoute", {
          route: "aws/uploadFile",
          fileName,
          contentType: 'image/jpeg',
          file: fileReader.result,
          folder: 'images'
        });
        if (response) {
          // Save image
          const newImageToSave = self.product
          newImageToSave.imageSrc = response
          
          const updateStagedProductResponse = await self.$store.dispatch("dataGate", {
            primaryKey: "id",
            tableName: "stagedProducts",
            operation: "update",
            entity: newImageToSave
          });
          if (updateStagedProductResponse && updateStagedProductResponse.data) {
            self.product = updateStagedProductResponse.data
          }
        }
      },
      fileReader.readAsDataURL(this.newImage)
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
  },
};
</script>

<style scoped></style>
