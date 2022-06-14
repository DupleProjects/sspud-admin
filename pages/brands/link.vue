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
      <h2>Link Brands</h2>
    </div>
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col-5">
            <h3>Scraped Brands</h3>
          </div>
          <div class="col-3">
            <v-text-field
              label="Search"
              v-model="scrapedSearch"
              style="padding-top: 0px"
            ></v-text-field>
          </div>
          <div class="col-3">
            <v-select
              style="padding-top: 0px"
              label="Shop"
              item-text="name"
              item-value="id"
              :items="shops"
              width="100%"
              v-model="shop"
            ></v-select>
          </div>
        </div>
        <export-modal :exportTableName="'scrapedBrands'" :exportSheetName="'Scraped Brands'" :products="scarapedBrands" />

        <div class="fancy-table">
          <table>
            <thead>
              <tr class="fancy-heading-row">
                <th scope="col">Name</th>
                <th scope="col">Link</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(brand, index) of displayedScrapedBrands"
                :key="index"
                class="fancy-row"
              >
                <!-- <td v-if="pageScraped == 1">{{ index + 1 }}</td>
                <td v-if="pageScraped > 1">{{ (pageScraped * 10) + index + 1 }}</td> -->
                <td>{{ brand.name }}</td>
                <td>
                  <span v-if="brand.mappedBrandId != null">
                    {{ allMappedBrands.find((x) => x.id === brand.mappedBrandId).name }}
                  </span>
                  <span v-if="brand.mappedBrandId == null" style="color: red">
                    Not Linked
                  </span>
                </td>
                <td>
                  <brands-link-brand-dialog
                    :brandCreateCallBackEdit="brandCreateCallBackEdit"
                    :brand="brand"
                    :bamBazonkeBrands="brands"
                    :allMappedBrands="allMappedBrands"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Pagination-->
        <template>
          <div class="text-end">
            <v-pagination
              color="primary"
              v-model="pageScraped"
              :length="Math.ceil(this.brandScrapedCount / this.numberPerPage)"
              :total-visible="7"
            ></v-pagination>
          </div>
        </template>
      </div>

      <div class="col">
        <div class="row">
          <div class="col-6">
            <h3>Bambazonke Brands</h3>
          </div>
          <div class="col-4">
            <v-text-field
              style="padding-top: 0px"
              label="Search"
              v-model="searchBrands"
            ></v-text-field>
          </div>
        </div>
        <export-modal :exportTableName="'mappedBrands'" :exportSheetName="'BambaZonke Brands'" :products="brands" />
        <div class="fancy-table">
          <table>
            <thead>
              <tr class="fancy-heading-row">
                <th scope="col">Name</th>
                <th scope="col">Published</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(brand, index) of displayedMappedBrands"
                :key="index"
                class="fancy-row"
              >
                <!-- <td v-if="page == 1">{{ index + 1 }}</td>
                <td v-if="page > 1">{{ (page * 10) + index + 1 }}</td> -->
                <td>{{ brand.name }}</td>
                <td>
                  <v-tooltip v-if="brand.publish" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on" color="green" medium
                        >mdi-check-circle</v-icon
                      >
                    </template>
                    <span>Published</span>
                  </v-tooltip>
                  <v-tooltip v-if="!brand.publish" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on" color="orange" medium
                        >mdi-close-circle</v-icon
                      >
                    </template>
                    <span>Published</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Pagination-->
        <template>
          <div class="text-end">
            <v-pagination
              color="primary"
              v-model="page"
              :length="Math.ceil(this.brandCount / this.numberPerPage)"
              :total-visible="7"
            ></v-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import baseMixin from "@/mixins/baseMixin.js";
import exportModal from '../../components/dialogs/exportModal.vue';
import breadcrumbMixin from "@/mixins/breadcrumbMixin.js";
export default {
  components: { exportModal },
  mixins: [baseMixin,breadcrumbMixin],
  data() {
    return {
      loading: false,
      page: 1,
      pageScraped: 1,
      numberPerPage: 20,
      brandCount: 0,
      brandScrapedCount: 0,
      brands: [],
      scarapedBrands: [],
      shops: [],
      shop: null,
      scrapedSearch: "",
      searchBrands: "",
      allMappedBrands: [],
      filteredScrapedBrands: [],
      filteredMappedBrands: [],
      displayedMappedBrands: [],
      displayedScrapedBrands: []
    };
  },
  watch: {
    page(val) {
      this.setPageMapped();
    },
    pageScraped(val) {
      this.setPageScraped()
    },
    async shop() {
      this.filterScraped();
    },
    searchBrands(val) {
      this.filteredMappedBrands = this.brands.filter((brand) => {
        return (
            brand.name.toLowerCase().includes(val.toLowerCase())
        )
      })
      this.setPageMapped()
    },
    scrapedSearch(val) {
      this.filteredScrapedBrands = this.scarapedBrands.filter((brand) => {
        return (
            brand.name.toLowerCase().includes(val.toLowerCase())
        )
      })
      this.setPageScraped()
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
      const brandResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });
      if (brandResponse.count) {
        this.brandCount = brandResponse.count;
      }
      if (brandResponse.data) {
        this.brands = brandResponse.data;
        this.filteredMappedBrands = brandResponse.data;
        const pageInfo = breadcrumbMixin.methods.getPage('scrapedPageMappedCategories')
      this.page = pageInfo.page
        this.setPageMapped();
      }

      //get all BZ brands
      const allMappedBrandResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });
      if (allMappedBrandResponse.data) {
        this.allMappedBrands = allMappedBrandResponse.data;
      }

      //get all scraped brands
      const brandScrapedResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedBrands",
        operation: "read",
      });
      if (brandScrapedResponse.count) {
        this.brandScrapedCount = brandScrapedResponse.count;
      }
      if (brandScrapedResponse.data) {
        this.scarapedBrands = brandScrapedResponse.data;
        this.filteredScrapedBrands = brandScrapedResponse.data;
        const pageInfo = breadcrumbMixin.methods.getPage('scrapedPageScrapedCategories')
        this.pageScraped = pageInfo.page
        this.setPageScraped();
      }
      
      const shopsResponse = await this.$store.dispatch("dataGate", {
        tableName: "shops",
        operation: "read",
        page: 1,
        numberPerPage: this.numberPerPage,
      });

      if (shopsResponse.data) {
        this.shops = shopsResponse.data;
      }

      this.loading = false;
    });
  },
  unmounted() {
    this.$nextTick(async function () {});
  },
  methods: {
    setPageMapped() {
      this.displayedMappedBrands = [];
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage);
      }
      // Validate page
      if (this.page < 1) this.page = 1;
      breadcrumbMixin.methods.savePage('scrapedPageMappedCategories', this.page)
      if (this.page > numPages(this.filteredMappedBrands.length, this.numberPerPage))
        this.page = numPages(this.filteredMappedBrands.length, this.numberPerPage);
      for (
        let i = (this.page - 1) * this.numberPerPage;
        i < this.page * this.numberPerPage && i < this.filteredMappedBrands.length;
        i++
      ) {
        if (this.filteredMappedBrands[i]) {
          this.displayedMappedBrands.push(this.filteredMappedBrands[i]);
        }
      }
      this.brandCount = this.filteredMappedBrands.length
    },
    setPageScraped() {
      this.displayedScrapedBrands = [];
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage);
      }

      // Validate page
      if (this.pageScraped < 1) this.pageScraped = 1;
      breadcrumbMixin.methods.savePage('scrapedPageScrapedCategories', this.pageScraped)
      if (this.pageScraped > numPages(this.filteredScrapedBrands.length, this.numberPerPage))
        this.pageScraped = numPages(this.filteredScrapedBrands.length, this.numberPerPage);
      for (
        let i = (this.pageScraped - 1) * this.numberPerPage;
        i < this.pageScraped * this.numberPerPage && i < this.filteredScrapedBrands.length;
        i++
      ) {
        if (this.filteredScrapedBrands[i]) {
          this.displayedScrapedBrands.push(this.filteredScrapedBrands[i]);
        }
      }
      this.brandScrapedCount = this.filteredScrapedBrands.length
    },
    // async filterScraped() {
      // if (this.scrapedSearch == "" && this.shop != null) {
      //   const brandScrapedResponse = await this.$store.dispatch("dataGate", {
      //     tableName: "scrapedBrands",
      //     operation: "read",
      //     numberPerPage: this.numberPerPage,
      //     whereCriteria: { shopId: this.shop },
      //   });

      //   if (brandScrapedResponse.data) {
      //     this.scarapedBrands = brandScrapedResponse.data;
      //   }

      //   if (brandScrapedResponse.count) {
      //     this.brandScrapedCount = brandScrapedResponse.count;
      //   }
      // } else if (this.shop == null && this.scrapedSearch != "") {
      //   const brandScrapedResponse = await this.$store.dispatch("dataGate", {
      //     tableName: "scrapedBrands",
      //     operation: "read",
      //     numberPerPage: this.numberPerPage,
      //     whereCriteria: { name: this.scrapedSearch },
      //   });

      //   if (brandScrapedResponse.data) {
      //     this.scarapedBrands = brandScrapedResponse.data;
      //   }

      //   if (brandScrapedResponse.count) {
      //     this.brandScrapedCount = brandScrapedResponse.count;
      //   }
      // } else if (this.shop == null && this.scrapedSearch == "") {
      //   const brandScrapedResponse = await this.$store.dispatch("dataGate", {
      //     tableName: "scrapedBrands",
      //     operation: "read",
      //     page: 1,
      //     numberPerPage: this.numberPerPage,
      //   });

      //   if (brandScrapedResponse.data) {
      //     this.scarapedBrands = brandScrapedResponse.data;
      //   }

      //   if (brandScrapedResponse.count) {
      //     this.brandScrapedCount = brandScrapedResponse.count;
      //   }
      // }
    // },
    async filterBrands() {
      if (this.searchBrands == "") {
        const brandResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedBrands",
          operation: "read",
          page: 1,
          numberPerPage: this.numberPerPage,
        });
        if (brandResponse.count) {
          this.brandCount = brandResponse.count;
        }
        if (brandResponse.data) {
          this.brands = brandResponse.data;
        }
      } else {
        const brandResponse = await this.$store.dispatch("dataGate", {
          tableName: "mappedBrands",
          operation: "read",
          numberPerPage: this.numberPerPage,
          whereCriteria: { name: this.searchBrands },
        });
        if (brandResponse.count) {
          this.brandCount = brandResponse.count;
        }
        if (brandResponse.data) {
          this.brands = brandResponse.data;
        }
      }
    },
    async brandCreateCallBackEdit() {
      this.loading = true;
      const brandResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
        page: 1,
        numberPerPage: this.numberPerPage,
      });
      if (brandResponse.count) {
        this.brandCount = brandResponse.count;
      }
      if (brandResponse.data) {
        this.brands = brandResponse.data;
      }

      const brandScrapedResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedBrands",
        operation: "read",
        page: 1,
        numberPerPage: this.numberPerPage,
      });

      if (brandScrapedResponse.data) {
        this.scarapedBrands = brandScrapedResponse.data;
      }

      if (brandScrapedResponse.count) {
        this.brandScrapedCount = brandScrapedResponse.count;
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.fancy-table {
  font-size: small;
  display: flex;
  flex-direction: column;
  min-width: 600px;
  border-radius: 10px !important;
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
