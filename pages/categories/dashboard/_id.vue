<template>
  <div class="pa-3">
    <div
      class="
        d-flex
        justify-content-start
        flex-wrap flex-md-nowrap
        align-end
        pt-3
      ">
      <v-btn
          class="ma-2 mb-1"
          outlined
          x-small
          fab
          color="primary"
          @click="$router.go(-1)">
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>
      <h2 class="mb-0">Category Dashboard</h2>
    </div>
    <hr class="">
    <div v-if="category">
      <analytics-category-breakdown :categoryId="category.id" :linkedCategories="linkedCategories" />
      <!--Detail Section-->
      <div class="p-3">
        <div class="confluence-card p-3">
          <p class="lead mb-0 header-style"><strong>Category Details</strong></p>
          <hr class="header-hr">
          <v-form
              ref="newCategoryForm"
              v-model="validCategoryForm"
              lazy-validation>
            <!-- <v-card class="category-subcards"> -->
            <v-row  style="margin-left:auto; margin-right:auto; margin-top:20px;" >
              <v-col cols="6">
                <v-card class="category-subcards">
                  <v-card-text class="category-subcard-text">
                    <img v-if="category.imageSrc && category.imageSrc !== 'null'" class="category-image" :src="category.imageSrc"
                         alt="image">
                    <div v-if="!category.imageSrc" class="no-image">
                      <v-icon
                          large
                          color="warning"
                          dark>
                        mdi-alert
                      </v-icon>
                      No image uploaded
                    </div>
                    <div class="text-center">
                      <v-btn
                          color="primary"
                          small
                          :loading="isSelecting"
                          @click="handleFileImport"
                          class="mt-5"
                          style="margin-left:auto; margin-right:auto;">
                        Upload Category Image
                      </v-btn>
                      <!-- Create a File Input that will be hidden but triggered with JavaScript -->
                      <input
                          ref="uploader"
                          class="d-none"
                          type="file"
                          @change="onNewFileUpload">
                    </div>
                    <v-text-field
                        class="category-fields"
                        prepend-icon="mdi-card-account-details-outline"
                        v-model="category.name"
                        :rules="[(v) => !!v || 'A Name is required']"
                        hint="The name of the category"
                        label="Name"
                    ></v-text-field>
                    <v-autocomplete
                        class="category-fields"
                        prepend-icon="mdi-clipboard-check-multiple"
                        label="Parent Category"
                        :item-text="'name'"
                        :item-value="'id'"
                        :items="categories"
                        v-model="category.parentId"
                        :messages="['Choose a parent or leave blank']"
                    ></v-autocomplete>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="">
                  <v-card-text class="">
                    <p>Should products from this category be published automatically?</p>
                    <v-radio-group v-model="category.publish">
                      <v-radio
                          :label="`Yes`"
                          :value="1"
                      ></v-radio>
                      <v-radio
                          :label="`No`"
                          :value="0"
                      ></v-radio>
                    </v-radio-group>
                    <p>Does the products in this category require Right of Authority Certificates?</p>
                    <v-radio-group v-model="category.certificateRequired">
                      <v-radio
                          :label="`Yes`"
                          :value="1"
                      ></v-radio>
                      <v-radio
                          :label="`No`"
                          :value="0"
                      ></v-radio>
                    </v-radio-group>
                    <p>Is this category alcohol?</p>
                    <v-radio-group v-model="category.isAlcohol">
                      <v-radio
                          :label="`Yes`"
                          :value="1"
                      ></v-radio>
                      <v-radio
                          :label="`No`"
                          :value="0"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <!-- </v-card> -->
          </v-form>
          <v-row>
            <v-col cols="12" style="text-align: center">
              <button style="margin-top:20px; margin-bottom:20px;background-color:#52bdfa;color:white;" @click="saveCategory()" class="btn">
                <v-progress-circular
                    v-if="loading"
                    :size="20"
                    indeterminate
                    color="primary"
                ></v-progress-circular>
                Save
              </button>
            </v-col>
          </v-row>
        </div>
      </div>
      <!--Linked Categories Section-->
      <div class="p-3">
        <div class="confluence-card p-3">
          <p class="lead mb-0 header-style"><strong>Linked Categories</strong></p>
          <hr class="header-hr">
          <categories-category-list
              v-if="linkedCategories.length > 0"
              :type="'mapped'"
              :categories="linkedCategories"
              :title="'Linked Categories'"
              :allCategories="categories"
              :location="'dashboard'"
              :sortCallBack="sortCallBack"
          />
          <!--No categories warning-->
          <div v-if="linkedCategories.length === 0"
               class="d-flex flex-column justify-content-center no-categories">
            <div class="text-center">
              <v-icon
                  large
                  color="warning"
                  dark>
                mdi-alert
              </v-icon>
              <p class="lead">No Categories Linked</p>
            </div>
          </div>
        </div>
      </div>
      <!--Scraped Categories Section-->
      <div class="p-3">
        <div class="confluence-card p-3">
          <p class="lead mb-0 header-style"><strong>Linked Scraped Categories</strong></p>
          <hr class="header-hr">
          <categories-category-list
              v-if="linkedScrapedCategories.length > 0"
              :type="'scraped'"
              :categories="linkedScrapedCategories"
              :title="'Linked Scraped Categories'"
              :tableStyle="'max-height: 75vh'"
          />
          <!--No scraped categories warning-->
          <div v-if="linkedScrapedCategories.length === 0"
               class="d-flex flex-column justify-content-center no-categories">
            <div class="text-center">
              <v-icon
                  large
                  color="warning"
                  dark>
                mdi-alert
              </v-icon>
              <p class="lead">No Scraped Categories Linked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
export default {
  mixins: [baseMixin],
  data() {
    return {
      loading: false,
      category: null,
      categories: [],
      validCategoryForm: true,
      linkedCategories: [],
      linkedScrapedCategories: [],
      isAlcohol: false,
      isSelecting: false,
      newImage: null,
    };
  },
  watch: {
    page(val) {},
    search(val) {},
  },
  beforeMount() {
    this.$nextTick(async function () {
      // console.log(this.$route.params.id);
      if (this.$route.params.id) {
        // Load all the categories so that the parent can still be chosen
        const categoriesResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedCategories",
          operation: "read",
        });
        if (categoriesResponse.data) {
          this.categories = categoriesResponse.data;
          // Get the actual category and the linked ones
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id === Number(this.$route.params.id)) {
              // console.log('this.category', this.category)
              this.category = this.categories[i];
            } else if (
              this.categories[i].parentId === Number(this.$route.params.id)
            ) {
              this.linkedCategories.push(this.categories[i]);
            }
          }
        }
        // Now load all the linked categories
        const linkedScraped = await this.$store.dispatch("dataGate", {
          tableName: "scrapedCategories",
          operation: "read",
          whereCriteria: { mappedCategoryId: this.$route.params.id },
        });
        if (linkedScraped.data) {
          this.linkedScrapedCategories = linkedScraped.data;
        }
      } else {
        alert("No category id found");
      }
      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    async saveCategory() {
      this.loading = true;
      const categoryResponse = await this.$store.dispatch("dataGate", {
        primaryKey: "id",
        tableName: "mappedCategories",
        operation: "update",
        entity: this.category,
      });

      if (categoryResponse) {
        const responseUpdateWC = await this.$store.dispatch(
          "callMiddlewareRoute",
          {
            category: this.category,
            route: "categories/updateCategoryWC ",
          }
        );
      }
      this.loading = false;
    },
    async sortCallBack(crit) {
      this.linkedCategories = []
      const categoriesResponse = await this.$store.dispatch('dataGate', {
        tableName: 'mappedCategories',
        operation: 'read',
        sortCriteria: crit
      });
      // this.categories = categoriesResponse.data

      if (categoriesResponse.data) {
          this.categories = categoriesResponse.data;
          // Get the actual category and the linked ones
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id === Number(this.$route.params.id)) {
              // console.log('this.category', this.category)
              this.category = this.categories[i];
            } else if (
              this.categories[i].parentId === Number(this.$route.params.id)
            ) {
              console.log("👉👉",this.categories[i]);
              this.linkedCategories.push(this.categories[i]);
            }
          }
      this.linkedCategories = this.linkedCategories 
      // const pageInfo = breadcrumbMixin.methods.getPage('mappedCategoryList')
      // this.page = pageInfo.page
      // this.setPage();
      }
    },
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
          self.category.imageSrc = response;
          await self.saveCategory();
        }
      }, fileReader.readAsDataURL(this.newImage)
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

<style scoped>
.linked-components {
  margin-top: 30px;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.category-fields {
  max-width: 600px;
}

.category-subcards {
  width:100%;
  margin-left: auto;
  margin-right: auto;
}

.category-subcard-text {
  text-align: center;
}

.card-title-style{
  background-color:#52bdfa;
  color:white;
}

.header-style {
  color: #1976d2 !important;
}

.header-hr {
  color: #1976d2 !important;
}

.no-image {
  min-height: 10vh;
}
.category-image {
  width: auto;
  height: 150px;
}
.no-categories {
  min-height: 30vh;
}
</style>
