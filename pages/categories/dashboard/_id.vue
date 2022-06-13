<template>
  <div class="pa-3">
    <div
      class="
        d-flex
        justify-content-between
        flex-wrap flex-md-nowrap
        align-items-center
        pt-3
        pb-2
        mb-3
        border-bottom
      "
    >
    <h2>Category Dashboard</h2>
    </div>
    <!--Detail Section-->
    <div v-if="category">
      <v-card class="linked-components">
          <v-card-title class="card-title-style py-1">
            Category Details
          </v-card-title>
        <v-card-text>
          <v-form
            ref="newCategoryForm"
            v-model="validCategoryForm"
            lazy-validation
          >
                <!-- <v-card class="category-subcards"> -->
            <v-row  style="margin-left:auto; margin-right:auto; margin-top:20px;" >
              <v-col cols="6">
                <v-card class="category-subcards">
                  <v-card-text class="category-subcard-text">
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
                          :value="true"
                      ></v-radio>
                      <v-radio
                          :label="`No`"
                          :value="false"
                      ></v-radio>
                    </v-radio-group>
                    <p>Does the products in this category require Right of Authority Certificates?</p>
                    <v-radio-group v-model="category.certificateRequired">
                      <v-radio
                          :label="`Yes`"
                          :value="true"
                      ></v-radio>
                      <v-radio
                          :label="`No`"
                          :value="false"
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
                Save
              </button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <!--Linked Section-->
    <!-- <div class="linked-components"> -->
    <v-card class="linked-components">
      <v-card-title class="card-title-style py-1">Linked Categories</v-card-title>
      <v-card-text>
        <categories-category-list
          :type="'mapped'"
          :categories="linkedCategories"
          :title="'Linked Categories'"
          :allCategories="categories"
        />
      </v-card-text>
    </v-card>
    <!-- </div> -->
    <v-card class="linked-components">
      <!--Linked Scraped Categories Section-->
      <v-card-title class=" card-title-style py-1">Linked Scraped Categories</v-card-title>
      <v-card-text>
        <categories-category-list
          :type="'scraped'"
          :categories="linkedScrapedCategories"
          :title="'Linked Scraped Categories'"
        />
      </v-card-text>
    </v-card>
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
  height: 185px;
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
</style>
