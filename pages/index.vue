<template>
  <div>
    <div class="row" justify="center" align="center">
      <div class="col-lg-12 col-md-12 col-sm-12 ">
        <v-card class="rounded-xl card-row">
          <v-icon class="icon" light>
            fas fa-person-booth fa-2xl fa-beat-fade
          </v-icon>
          <v-card-title class="headline">
            <span class="font-size">Welcome to SPPUD!</span>
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn rounded color="primary" dark :to="'/categories/manage'" router exact>
                Lets Go
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>

          </v-card-actions>
        </v-card>
      </div>
      <!-- <div class="col-lg-3 col-md-4 col-sm-6 card-row2">
        <v-card class="rounded-xl">
          <v-icon class="icon" light>
             {{scrapedProductCount}}
            </v-icon>
          <v-card-title class="headline-card">
            <span class="font-size">Scraped Products</span> 
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                :to="'/products/scraped/list'"
                router
                exact
              >
                View
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
  
          </v-card-actions>
        </v-card>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6 card-row3">
        <v-card class="rounded-xl">
          <v-icon class="icon" light>
              {{productCount}}
            </v-icon>
          <v-card-title class="headline-card">
            <span class="font-size">Staged Products</span> 
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                :to="'/products/staged/list'"
                router
                exact
              >
                View
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
  
          </v-card-actions>
        </v-card>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6 card-row3">
        <v-card class="rounded-xl">
          <v-icon class="icon" light>
              {{publishedProductCount}}
            </v-icon>
          <v-card-title class="headline-card">
            <span class="font-size">Published Products</span> 
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                :to="'/products/published/list'"
                router
                exact
              >
                View
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
  
          </v-card-actions>
        </v-card>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6 card-row2">
        <v-card class="rounded-xl">
          <v-icon class="icon" light>
             {{deletedProductCount}}
            </v-icon>
          <v-card-title class="headline-card">
            <span class="font-size">Deleted Products</span> 
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                :to="'/products/deleted/list'"
                router
                exact
              >
                View
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
  
          </v-card-actions>
        </v-card>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6 card-row4">
        <v-card class="rounded-xl">
          <v-icon class="icon" light>
              {{unlinkedCategoriesCount}}
            </v-icon>
          <v-card-title class="headline-card">
            <span class="font-size">Linked Categories</span> 
          </v-card-title>
          <v-icon class="icon" light>
              {{linkedCategoriesCount}}
            </v-icon>
            <v-card-title class="headline-card">
            <span class="font-size">Unlinked Categories</span> 
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                :to="'/transportRates/mainTransportRates'"
                router
                exact
              >
                View
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
  
          </v-card-actions>
        </v-card>
      </div>
      <div class="col-lg-3 col-md-4 col-sm-6 card-row4">
        <v-card class="rounded-xl">
          <v-icon class="icon" light>
              {{unlinkedBrandCount}}
            </v-icon>
          <v-card-title class="headline-card">
            <span class="font-size">Linked Brands</span> 
          </v-card-title>
          <v-icon class="icon" light>
              {{linkedBrandCount}}
            </v-icon>
           <v-card-title class="headline-card">
            <span class="font-size">Unlinked Brands</span> 
          </v-card-title>
          <v-card-text>
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                :to="'/users/manage'"
                router
                exact
              >
                View
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
  
          </v-card-actions>
        </v-card>
      </div> -->
    </div>
    <v-card class="mt-10 ml-10 mb-10 mr-10" style="border-radius:20px;">
      <div class="row charts-row">
        <div class="col-6 poducts-chart" v-if="chartData.datasets[0].data.length > 0">
          <BarChart :chartdata="chartData" :options="options" :name="'Products'" />
        </div>
        <div class="col-6 poducts-chart" v-if="chartData2.datasets[0].data.length > 0">
          <BarChart :chartdata="chartData2" :options="options2" :name="'Categories'" />
        </div>
        <!-- <div class="col-6 poducts-chart" v-if="chartData2.datasets[0].data.length > 0">
            <BarChart2 :chartdata2="chartData2" :options2="options2"/>
          </div> -->
      </div>
    </v-card>
  </div>

</template>

 
<script>
import BarChart from '~/components/charts/BarChart.vue';
// import BarChart2 from '~/components/barChart/BarChart2.vue';

export default {
  name: "IndexPage",
  data() {
    return {
      loading: false,
      page: 1,
      numberPerPage: 15,
      filter: {},
      productCount: 0,
      scrapedProductCount: 0,
      deletedProductCount: 0,
      publishedProductCount: 0,
      unlinkedCategoriesCount: 0,
      linkedCategoriesCount: 0,
      unlinkedBrandCount: 0,
      linkedBrandCount: 0,
      products: [],
      allCategories: [],
      allBrands: [],
      options: null,
      // Current criteria
      criteria: { deleted: 0, publish: 0 },
      chartData: {
        labels: ['Scraped Products', 'Staged Products', 'Published Products', 'Deleted Products'],
        datasets: [{ labels: "", backgroundColor: "", data: [] }],
      },
      chartOptions: {
        responsive: true,
        name: "Products"
      },
      chartData2: {
        labels: ['Linked Categories', 'Unlinked Categories', 'Linked Brands', 'Unlinked Brands'],
        datasets: [{ labels: "", backgroundColor: "", data: [] }]
      },
      chartOptions2: {
        responsive: true,
        name: "Categories"
      }
    };
  },
  watch: {
    page(val) {
      this.loadProducts();
    },
  },
  beforeMount() {
    this.$nextTick(async function () {
      this.loading = true;
      var loggedInUser = this.$store.state.auth.user;
      console.log("loggedInUser", loggedInUser);
      // Load Products
      await this.loadProducts();
      await this.loadCategoriesAndBrands();
      this.loading = false;

    });
  },
  unmounted() {
    this.$nextTick(async function () { });
  },
  methods: {
    // Loading stuff
    async loadProducts(criteria) {
      if (!criteria) {
        criteria = this.criteria;
      }
      // Load the products
      const stagedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: { deleted: 0 },
        page: this.page,
        numberPerPage: this.numberPerPage,
      });
      console.log("stagedProducts", stagedProducts);
      if (stagedProducts.count) {
        this.productCount = stagedProducts.count;

      }
      if (stagedProducts.data) {
        this.products = stagedProducts.data;
      }
      // Load the products
      const scrapedProducts = await this.$store.dispatch("dataGate", {
        tableName: "scrapedProducts",
        operation: "read",
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      console.log(scrapedProducts);
      if (scrapedProducts.count) {
        this.scrapedProductCount = scrapedProducts.count;
        this.chartData.datasets[0].data[0] = this.scrapedProductCount;
        console.log("Chartdata", this.chartData.datasets[0].data[0]);
      }
      if (scrapedProducts.data) {
        this.scrapedProducts = scrapedProducts.data;
      }
      const deletedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: { deleted: 1 },
        page: this.page,
        numberPerPage: this.numberPerPage,
      });
      if (deletedProducts.count) {
        this.deletedProductCount = deletedProducts.count;
      }
      if (deletedProducts.data) {
        this.deletedPproducts = deletedProducts.data;
      }
      const publishedProducts = await this.$store.dispatch("dataGate", {
        tableName: "stagedProducts",
        operation: "read",
        whereCriteria: { deleted: 0, publish: 1 },
        page: this.page,
        numberPerPage: this.numberPerPage
      });
      console.log("Published Products", publishedProducts);
      if (publishedProducts) {
        this.publishedProductCount = publishedProducts.count;
      }
      if (publishedProducts.data) {
        this.publishedProducts = publishedProducts.data;
      }
      const categoriesResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedCategories",
        operation: "read",
      });
      //main category count
      if (categoriesResponse.count) {
        this.categoryCount = categoriesResponse.count;
      }
      //main category data
      if (categoriesResponse.data) {
        let unlinkedCount = 0;
        let linkedCount = 0;
        categoriesResponse.data.forEach(element => {
          if (element.mappedCategoryId != null) {
            linkedCount++;
          }
          else {

            unlinkedCount++;
          }
        });
        this.unlinkedCategoriesCount = unlinkedCount;
        this.linkedCategoriesCount = linkedCount;
        this.categories = categoriesResponse.data;
      }
      const brandScrapedResponse = await this.$store.dispatch("dataGate", {
        tableName: "scrapedBrands",
        operation: "read",
      });
      if (brandScrapedResponse.data) {
        let unlinkedBrandCounter = 0;
        let linkedBrandCounter = 0;
        brandScrapedResponse.data.forEach(element => {
          if (element.mappedBrandId != null) {
            linkedBrandCounter++;
          }
          else {

            unlinkedBrandCounter++;
          }
        });
        this.unlinkedBrandCount = unlinkedBrandCounter;
        this.linkedBrandCount = linkedBrandCounter;
        this.scarapedBrands = brandScrapedResponse.data;
      }
      if (brandScrapedResponse.count) {
        this.brandScrapedCount = brandScrapedResponse.count;
      }
      this.chartData.datasets = [
        {
          label: "Products",
          backgroundColor: '#3AB0FF',
          data: [
            this.productCount,
            this.scrapedProductCount,
            this.publishedProductCount,
            this.deletedProductCount
          ]
        }]
      this.chartData2.datasets = [
        {
          label: "Categories",
          backgroundColor: '#3AB0FF',
          data: [
            this.linkedCategoriesCount,
            this.unlinkedCategoriesCount,
            this.linkedBrandCount,
            this.unlinkedBrandCount,
          ]
        }
      ]
      console.log("ChartValues", this.chartData)
    },
    async loadCategoriesAndBrands() {
      const categories = await this.$store.dispatch("dataGate", {
        tableName: "mappedCategories",
        operation: "read",
      });
      if (categories.data) {
        this.allCategories = categories.data;
      }
      const brands = await this.$store.dispatch("dataGate", {
        tableName: "mappedBrands",
        operation: "read",
      });
      if (brands.data) {
        this.allBrands = brands.data;
      }
    },
    async deleteProductCallBack() {
      await this.loadProducts();
    },
    async filterChangeCallBack(filter) {
      // Build the where clause
      if (filter) {
        const criteria = {
          deleted: 0,
          publish: 0
        };
        if (filter.name) {
          criteria.name = { like: filter.name };
        }
        if (filter.categoryId === null) {
          delete filter.categoryId;
        }
        if (filter.subCategoryId === null) {
          delete filter.subCategoryId;
        }
        if (filter.brandId === null) {
          delete filter.brandId;
        }
        this.criteria = criteria;
        await this.loadProducts(filter);
      }

    },

  },
  components: { BarChart },
}

</script>
<style>
.card-row {
  margin-top: 2%;
  margin-left: 25%;
  margin-right: 25%;
}

.card-row2 {
  margin-top: 1%;
  margin-left: 5%;
  margin-right: 1%;
}

.card-row3 {
  margin-top: 1%;
  margin-left: 7%;
  margin-right: 1%;
}

.card-row4 {
  margin-top: 1%;
  margin-left: 7%;
  margin-right: 1%;
  margin-bottom: 2%;
}

.icon {
  color: white;
  size: 16px;
  margin-top: 7%;
}

.headline {
  margin-left: 35%;
}

.headline-card {
  margin-left: 20%;
}

.fas {
  color: blue;
}

.font-size {
  font-size: 22px;
}

.poducts-chart {
  max-width: 80vh;
  max-height: 80vh;
  margin-left: auto;
  margin-right: auto;
}

.charts-row {
  display: flex;
}
</style>
