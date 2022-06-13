<template>
  <div class="">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 mx-3">
      <h2>Link Categories</h2>

      <v-text-field v-model="search" label="Search" class="px-5"></v-text-field>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <export-modal :exportTableName="'scrapedCategories'" :exportSheetName="'Scraped Categories'" :products="scrapedCategories" />
        </div>
      </div>
    </div>
    <hr class="my-0 mx-3">
    <div class="p-3" style="border-radius: 20px !important">
      <div class="fancy-table">
        <table>
          <thead>
          <tr class="fancy-heading-row">
            <th>Name</th>
            <th>Shop</th>
            <th>Linked Category</th>
            <th>Publish</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(scrapedCategory, index) of scrapedCategories"
              :key="index"
              class="fancy-row"
          >
            <td style="font-weight: bold; font-size: 15px">
              {{ scrapedCategory.name }}
            </td>
            <td>{{ scrapedCategory.shopId }}</td>
            <td>
              {{ linkMappedCategoryName(scrapedCategory.mappedCategoryId) }}
            </td>
            <td>
              <v-tooltip v-if="scrapedCategory.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" color="green" medium
                  >mdi-check-circle</v-icon
                  >
                </template>
                <span>Published</span>
              </v-tooltip>
              <v-tooltip v-if="!scrapedCategory.publish" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" color="orange" medium
                  >mdi-close-circle</v-icon
                  >
                </template>
                <span>Published</span>
              </v-tooltip>
            </td>
            <td>
              {{ formatDate(scrapedCategory.createdAt) }}
            </td>
            <td class="d-flex">
              <!--Opens link dialog-->
              <categories-link-scraped-category-dialog
                  :categories="categories"
                  :scrapedCategory="scrapedCategory"
              />
              <!-- Opens Linked Categories Dialog -->
              <linked-categories-modal :category="scrapedCategory" :subCategories="allScrapedCategories" />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
    <!--Pagination-->
    <template>
      <div class="text-end">
        <v-pagination
          color="primary"
          v-model="page"
          :length="Math.ceil(this.scrapedCategoryCount / this.numberPerPage)"
          :total-visible="7"
        ></v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
import exportModal from '../../components/dialogs/exportModal.vue';
import LinkedCategoriesModal from '../../components/dialogs/linkedCategoriesModal.vue';
export default {
  components: { exportModal,LinkedCategoriesModal },
  mixins: [baseMixin],
  data() {
      return {
        loading: false,
        page: 1,
        search: "",
        numberPerPage: 20,
        categoryCount: 0,
        scrapedCategoryCount: 0,
        categories: [],
        scrapedCategories: [],
        filteredCategories: [],
        filteredScrapedCategories: [],
        displayedCategories: [],
        displayedScrapedCategories: [],
        allScrapedCategories:[],
        // Filtering
        lastUsedFilter: null,
    };
  },
  watch: {
    page(val) {
      this.loadScrapedCategories(this.lastUsedFilter);
    },
    search(val) {
      if (val && val !== "") {
        this.loadScrapedCategories({
          name: {
            like: val,
          },
        });
      } else {
        this.loadScrapedCategories();
      }
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the mapped categories
      await this.loadMappedCategories();
      // Load the scraped categories
      await this.loadScrapedCategories();
      // Load here because we only need to load this once
      const allScrapedCategoriesResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedCategories",
        operation: "read",
      });
      if (allScrapedCategoriesResponse.data) {
        this.allScrapedCategories = allScrapedCategoriesResponse.data;
      }
      console.log("ALL SCRAPED CATEGORIES!!", this.allScrapedCategories);
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  computed: {},
  methods: {
    // used to display the name of the linked category
    linkMappedCategoryName: function (mappedCategoryId) {
      const linkedMappedCategory =
        baseMixin.methods.getObjectsWhereKeysHaveValues(
          this.categories,
          { id: mappedCategoryId },
          true
        );
      if (linkedMappedCategory) {
        return linkedMappedCategory.name;
      }
      return "No linked category";
    },
    async loadMappedCategories() {
      //main categories
      const categoriesResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });
      //main category count
      if (categoriesResponse.count) {
        this.categoryCount = categoriesResponse.count;
      }
      //main category data
      if (categoriesResponse.data) {
        this.categories = categoriesResponse.data;
      }
    },
    async loadScrapedCategories(filter) {
      if (filter) {
        this.lastUsedFilter = filter;
      }
      //scraped categories
      const scrapedCategoriesResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedCategories",
        operation: "read",
        whereCriteria: filter,
        page: this.page,
        numberPerPage: this.numberPerPage,
      });
      //scraped category count
      if (scrapedCategoriesResponse.count) {
        this.scrapedCategoryCount = scrapedCategoriesResponse.count;
      }
      //scraped category data
      if (scrapedCategoriesResponse.data) {
        this.scrapedCategories = scrapedCategoriesResponse.data;
      }
      this.loading = false;
    },
    formatDate(datetime) {
      var date = new Date(datetime).toISOString().substring(0, 10);
      var time = new Date(datetime).toLocaleTimeString("en", {
        timeStyle: "short",
        hour12: false,
        timeZone: "UTC",
      });

      return date + " " + time;
    },
  },
};
</script>

<style scoped>
.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  max-height: 79vh;
  border-radius: 10px !important;
  overflow: auto;
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
  font-weight: normal !important;
}

.fancy-heading-row th {
  font-weight: normal;
  padding: 8px;
  padding-left: 15px;
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
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
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
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 0.5fr;
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

.fancy-row td {
  padding: 8px;
  font-size: 15px;
  padding-left: 15px;
}

.product-list {
  min-height: 68vh;
  max-height: 68vh;
  overflow: auto;
}
</style>
