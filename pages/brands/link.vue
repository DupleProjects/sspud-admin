<template>
  <div>
    <h2>Link Brands</h2>
    <hr />
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">
            <h3>Scraped Brands</h3>
          </div>
          <div class="col">
            <v-text-field
              label="Search"
              v-model="scrapedSearch"
              style="margin-top: 0px"
              @change="filterScraped()"
            ></v-text-field>
          </div>
          <div class="col">
            <v-select
              style="padding-top: 0px"
              label="Shop"
              item-text="name"
              item-value="id"
              :items="shops"
              width="100%"
              v-model="shop"
              class="mt-3"
            ></v-select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Link</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(brand, index) of scarapedBrands" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ brand.name }}</td>
                <td>
                  <p v-if="brand.mappedBrandId != null">
                    {{ brands.find((x) => x.id === brand.mappedBrandId).name }}
                  </p>
                  <p v-if="brand.mappedBrandId == null" style="color: red">
                    Not Linked
                  </p>
                </td>
                <td>
                  <brands-link-brand-dialog
                    :brandCreateCallBackEdit="brandCreateCallBackEdit"
                    :brand="brand"
                    :bamBazonkeBrands="brands"
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
          <div class="col">
            <h3>Bambazonke Brands</h3>
          </div>
          <div class="col">
            <v-text-field
              label="Search"
              v-model="searchBrands"
              @change="filterBrands()"
            ></v-text-field>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Published</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(brand, index) of brands" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ brand.name }}</td>
                <td>
                  <v-icon
                    color="primary"
                    class="icon-style hide-on-desktop"
                    dark
                    v-if="brand.publish == 1"
                  >
                    mdi-publish
                  </v-icon>
                  <v-icon
                    color="blue"
                    class="icon-style hide-on-desktop"
                    dark
                    v-if="brand.publish == 0"
                  >
                    mdi-publish-off
                  </v-icon>
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
export default {
  mixins: [baseMixin],
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
    };
  },
  watch: {
    async page(val) {
      // Load the products
      const brandResponse = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
        page: val,
        numberPerPage: this.numberPerPage,
      });
      if (brandResponse.count) {
        this.brandCount = brandResponse.count;
      }
      if (brandResponse.data) {
        this.brands = brandResponse.data;
      }
    },
    async pageScraped(val) {
      this.loading = true;
      const brandScrapedResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedBrands",
        operation: "read",
        page: val,
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
    async shop() {
      this.filterScraped();
    },
    search(val) {},
  },
  beforeMount() {
    this.$nextTick(async function () {
      // var loggedInUser = this.$store.state.auth.user
      // Load the products
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
    setPage() {
      this.displayedBrands = [];
      function numPages(total, numPerPage) {
        return Math.ceil(total / numPerPage);
      }
      // Validate page
      if (this.page < 1) this.page = 1;
      if (this.page > numPages(this.filteredBrands.length, this.numberPerPage))
        this.page = numPages(this.filteredBrands.length, this.numberPerPage);
      for (
        let i = (this.page - 1) * this.numberPerPage;
        i < this.page * this.numberPerPage && i < this.filteredBrands.length;
        i++
      ) {
        if (this.filteredBrands[i]) {
          this.displayedBrands.push(this.filteredBrands[i]);
        }
      }
    },
    async filterScraped() {
      if (this.scrapedSearch == "" && this.shop != null) {
        const brandScrapedResponse = await this.$store.dispatch("dataGate", {
          tableName: "scrapedBrands",
          operation: "read",
          numberPerPage: this.numberPerPage,
          whereCriteria: { shopId: this.shop },
        });

        if (brandScrapedResponse.data) {
          this.scarapedBrands = brandScrapedResponse.data;
        }

        if (brandScrapedResponse.count) {
          this.brandScrapedCount = brandScrapedResponse.count;
        }
      } else if (this.shop == null && this.scrapedSearch != "") {
        const brandScrapedResponse = await this.$store.dispatch("dataGate", {
          tableName: "scrapedBrands",
          operation: "read",
          numberPerPage: this.numberPerPage,
          whereCriteria: { name: this.scrapedSearch },
        });

        if (brandScrapedResponse.data) {
          this.scarapedBrands = brandScrapedResponse.data;
        }

        if (brandScrapedResponse.count) {
          this.brandScrapedCount = brandScrapedResponse.count;
        }
      } else if (this.shop == null && this.scrapedSearch == "") {
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
      }
    },
    async filterBrands() {
      console.log(this.searchBrands);
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

<style scoped></style>
